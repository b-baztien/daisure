// ========================================
// COMPLETE: src/modules/transactions/transactions.service.ts
// ========================================

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PaginatedResponse,
  PaginationQueryDto,
  createPaginatedResponse,
} from '../../common/dto/pagination.dto';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';
import { ITransactionDocument } from '../../common/interfaces/transaction.interface';
import { KycService } from '../kyc/kyc.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService,
    private kycService: KycService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    sellerId: string,
  ): Promise<Transaction> {
    // ผู้ขายคือผู้ที่ login อยู่ (authenticated user)
    const seller = await this.usersService.findOne(sellerId);

    const productPrice = createTransactionDto.product.price;

    // ตรวจสอบ KYC ของผู้ขาย
    const kycCheck = await this.kycService.checkKycRequired(
      sellerId,
      productPrice,
    );

    if (kycCheck.required && !kycCheck.verified) {
      throw new BadRequestException({
        message: kycCheck.message,
        kycStatus: kycCheck.status,
        requireKyc: true,
      });
    }

    // Calculate fees
    const settings = await this.settingsService.getEscrowFee();
    const escrowFee = this.calculateEscrowFee(productPrice, settings);
    const shippingFee = createTransactionDto.shippingFee || 0;
    const totalAmount = productPrice + escrowFee + shippingFee;

    // Generate transaction number
    const transactionNumber = await this.generateTransactionNumber();

    const transaction = new this.transactionModel({
      transactionNumber,
      product: createTransactionDto.product,
      seller: {
        userId: seller._id,
        displayName: seller.profile.displayName,
        phone: seller.profile.phone,
        lineUserId: seller.auth.lineUserId,
      },
      payment: {
        productPrice,
        escrowFee,
        shippingFee,
        totalAmount,
      },
      status: TransactionStatus.INITIATED,
      metadata: {
        createdFrom: 'web',
        source: createTransactionDto.source || 'direct',
      },
      timeline: [
        {
          status: TransactionStatus.INITIATED,
          action: 'created',
          description: 'ผู้ขายสร้างรายการซื้อขาย',
          actorId: sellerId as any,
          platform: 'web',
          timestamp: new Date(),
        },
      ],
    });

    const saved = await transaction.save();

    // Send notifications
    await this.notificationsService.sendTransactionCreated(
      saved as unknown as ITransactionDocument,
    );

    return saved;
  }

  async findAll(
    filters?: any,
    paginationQuery?: PaginationQueryDto,
  ): Promise<Transaction[] | PaginatedResponse<Transaction>> {
    // If no pagination params provided, return all (backward compatibility)
    if (!paginationQuery) {
      return this.transactionModel
        .find(filters || {})
        .populate('buyer.userId seller.userId admin.userId')
        .sort({ createdAt: -1 })
        .exec();
    }

    const {
      page = 1,
      pageSize = 20,
      sortBy,
      sortOrder = 'desc',
    } = paginationQuery;
    const skip = (page - 1) * pageSize;

    // Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      this.transactionModel
        .find(filters || {})
        .populate('buyer.userId seller.userId admin.userId')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.transactionModel.countDocuments(filters || {}).exec(),
    ]);

    return createPaginatedResponse(data, total, page, pageSize);
  }

  async findOne(id: string): Promise<Transaction> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid transaction ID');
    }

    const transaction = await this.transactionModel
      .findById(id)
      .populate('buyer.userId seller.userId admin.userId')
      .exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async findByTransactionNumber(
    transactionNumber: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findOne({ transactionNumber })
      .populate('buyer.userId seller.userId admin.userId')
      .exec();

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with number ${transactionNumber} not found`,
      );
    }
    return transaction;
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    actorId: string,
    note?: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);

    // Add to timeline
    transaction.timeline.push({
      status,
      action: 'status_updated',
      description: note || `Status changed to ${status}`,
      actorId: actorId as any,
      platform: 'web',
      timestamp: new Date(),
    } as any);

    transaction.status = status;

    // Set auto-complete date if delivered
    if (status === TransactionStatus.DELIVERED) {
      const autoCompleteDays = 7; // Get from settings
      const autoCompleteAt = new Date();
      autoCompleteAt.setDate(autoCompleteAt.getDate() + autoCompleteDays);
      transaction.autoCompleteAt = autoCompleteAt;
    }

    // Set completed date if completed
    if (status === TransactionStatus.COMPLETED) {
      transaction.completedAt = new Date();
    }

    const saved = await transaction.save();

    // Send notification
    await this.notificationsService.sendStatusUpdate(
      saved as unknown as ITransactionDocument,
      status,
    );

    return saved;
  }

  async findByUser(
    userId: string,
    role: 'buyer' | 'seller',
    paginationQuery?: PaginationQueryDto,
  ): Promise<Transaction[] | PaginatedResponse<Transaction>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const filter =
      role === 'buyer'
        ? { 'buyer.userId': userId }
        : { 'seller.userId': userId };

    // If no pagination params provided, return all (backward compatibility)
    if (!paginationQuery) {
      return this.transactionModel
        .find(filter)
        .populate('buyer.userId seller.userId')
        .sort({ createdAt: -1 })
        .exec();
    }

    const {
      page = 1,
      pageSize = 20,
      sortBy,
      sortOrder = 'desc',
    } = paginationQuery;
    const skip = (page - 1) * pageSize;

    // Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .populate('buyer.userId seller.userId')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.transactionModel.countDocuments(filter).exec(),
    ]);

    return createPaginatedResponse(data, total, page, pageSize);
  }

  async confirmDelivery(
    id: string,
    userId: string,
    note?: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);

    // Verify user is the buyer
    if (transaction.buyer.userId.toString() !== userId) {
      throw new BadRequestException('Only buyer can confirm delivery');
    }

    // Check status
    if (transaction.status !== TransactionStatus.DELIVERED) {
      throw new BadRequestException('Transaction must be in delivered status');
    }

    return this.updateStatus(
      id,
      TransactionStatus.COMPLETED,
      userId,
      note || 'Buyer confirmed delivery',
    );
  }

  async createDispute(
    id: string,
    userId: string,
    reason: string,
    description: string,
    evidence: string[],
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);

    // Determine who initiated
    let initiatedBy: 'buyer' | 'seller';
    if (transaction.buyer.userId.toString() === userId) {
      initiatedBy = 'buyer';
    } else if (transaction.seller.userId.toString() === userId) {
      initiatedBy = 'seller';
    } else {
      throw new BadRequestException('User not part of this transaction');
    }

    transaction.dispute = {
      isDisputed: true,
      initiatedBy,
      initiatedAt: new Date(),
      reason,
      reasonCategory: reason,
      description,
      evidence: evidence.map((url) => ({
        type: 'image',
        url,
        uploadedAt: new Date(),
      })),
    } as any;

    transaction.status = TransactionStatus.DISPUTED;

    transaction.timeline.push({
      status: TransactionStatus.DISPUTED,
      action: 'dispute_created',
      description: `Dispute created by ${initiatedBy}: ${reason}`,
      actorId: userId as any,
      platform: 'web',
      timestamp: new Date(),
    } as any);

    const saved = await transaction.save();

    // Notify admin
    await this.notificationsService.sendDisputeCreated(
      saved as unknown as ITransactionDocument,
    );

    return saved;
  }

  async assignAdmin(
    transactionId: string,
    adminId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(transactionId);
    const admin = await this.usersService.findOne(adminId);

    transaction.admin = {
      userId: admin._id as any,
      displayName: admin.profile.displayName,
      phone: admin.profile.phone,
      lineUserId: admin.auth.lineUserId,
    } as any;

    transaction.timeline.push({
      status: transaction.status,
      action: 'admin_assigned',
      description: `Admin ${admin.profile.displayName} assigned to transaction`,
      actorId: adminId as any,
      platform: 'web',
      timestamp: new Date(),
    } as any);

    return transaction.save();
  }

  async updateShipping(
    transactionId: string,
    shippingData: {
      method: string;
      trackingNumber: string;
      trackingUrl?: string;
      proofImages?: string[];
    },
  ): Promise<Transaction> {
    const transaction = await this.findOne(transactionId);

    transaction.shipping = {
      method: shippingData.method,
      trackingNumber: shippingData.trackingNumber,
      shippedAt: new Date(),
    };

    transaction.status = TransactionStatus.SHIPPED;

    transaction.timeline.push({
      status: TransactionStatus.SHIPPED,
      action: 'shipment_updated',
      description: `Tracking number: ${shippingData.trackingNumber}`,
      actorId: transaction.seller.userId as any,
      platform: 'web',
      timestamp: new Date(),
    } as any);

    const saved = await transaction.save();

    // Notify buyer
    await this.notificationsService.sendStatusUpdate(
      saved as unknown as ITransactionDocument,
      TransactionStatus.SHIPPED,
    );

    return saved;
  }

  async markAsDelivered(transactionId: string): Promise<Transaction> {
    const transaction = await this.findOne(transactionId);

    if (transaction.status !== TransactionStatus.SHIPPED) {
      throw new BadRequestException('Transaction must be in shipped status');
    }

    if (transaction.shipping) {
      transaction.shipping.deliveredAt = new Date();
    }

    return this.updateStatus(
      transactionId,
      TransactionStatus.DELIVERED,
      'system',
      'Package delivered',
    );
  }

  async cancelTransaction(
    transactionId: string,
    userId: string,
    reason: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(transactionId);

    // Check if user can cancel
    const isBuyer = transaction.buyer.userId.toString() === userId;
    const isSeller = transaction.seller.userId.toString() === userId;

    if (!isBuyer && !isSeller) {
      throw new BadRequestException(
        'Only buyer or seller can cancel transaction',
      );
    }

    // Check if transaction can be cancelled
    const cancellableStatuses = [
      TransactionStatus.INITIATED,
      TransactionStatus.PENDING_PAYMENT,
      TransactionStatus.PAYMENT_VERIFICATION,
    ];

    if (!cancellableStatuses.includes(transaction.status)) {
      throw new BadRequestException(
        'Transaction cannot be cancelled at this stage',
      );
    }

    return this.updateStatus(
      transactionId,
      TransactionStatus.CANCELLED,
      userId,
      reason,
    );
  }

  async getTransactionStats(): Promise<{
    total: number;
    byStatus: Record<TransactionStatus, number>;
    totalVolume: number;
  }> {
    const transactions = await this.transactionModel.find().exec();

    const byStatus = Object.values(TransactionStatus).reduce(
      (acc, status) => {
        acc[status] = transactions.filter((tx) => tx.status === status).length;
        return acc;
      },
      {} as Record<TransactionStatus, number>,
    );

    const totalVolume = transactions
      .filter((tx) => tx.status === TransactionStatus.COMPLETED)
      .reduce((sum, tx) => sum + tx.payment.productPrice, 0);

    return {
      total: transactions.length,
      byStatus,
      totalVolume,
    };
  }

  private calculateEscrowFee(amount: number, settings: any): number {
    const percentage = settings.percentage || 3;
    const fee = (amount * percentage) / 100;

    if (settings.minimumFee && fee < settings.minimumFee) {
      return settings.minimumFee;
    }

    if (settings.maximumFee && fee > settings.maximumFee) {
      return settings.maximumFee;
    }

    return Math.round(fee);
  }

  private async generateTransactionNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const prefix = `ESC${year}${month}${day}`;

    const count = await this.transactionModel.countDocuments({
      transactionNumber: new RegExp(`^${prefix}`),
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
  }
}
