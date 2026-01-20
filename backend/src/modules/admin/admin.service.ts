import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';
import {
  PaginationQueryDto,
  PaginatedResponse,
  createPaginatedResponse,
} from '../../common/dto/pagination.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { AdminLog } from './schemas/admin-log.schema';

interface LogActionData {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  changes?: {
    before: any;
    after: any;
  };
  reason?: string;
  ipAddress?: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminLog.name) private adminLogModel: Model<AdminLog>,
    private transactionsService: TransactionsService,
  ) {}

  async verifyPayment(
    transactionId: string,
    adminId: string,
    isApproved: boolean,
    note?: string,
  ): Promise<any> {
    const transaction = await this.transactionsService.findOne(transactionId);

    if (transaction.status !== TransactionStatus.PAYMENT_VERIFICATION) {
      throw new BadRequestException(
        'Transaction is not in payment verification status',
      );
    }

    const newStatus = isApproved
      ? TransactionStatus.AWAITING_SHIPMENT
      : TransactionStatus.PAYMENT_REJECTED;

    const updated = await this.transactionsService.updateStatus(
      transactionId,
      newStatus,
      adminId,
      note || (isApproved ? 'Payment verified' : 'Payment rejected'),
    );

    // Log action
    await this.logAction({
      adminId,
      action: 'verify_payment',
      targetType: 'transaction',
      targetId: transactionId,
      changes: {
        before: { status: TransactionStatus.PAYMENT_VERIFICATION },
        after: { status: newStatus },
      },
      reason: note,
    });

    return updated;
  }

  async resolveDispute(
    transactionId: string,
    adminId: string,
    decision: 'refund_buyer' | 'release_to_seller' | 'partial_refund',
    explanation: string,
    refundAmount?: number,
  ): Promise<any> {
    const transaction = await this.transactionsService.findOne(transactionId);

    if (!transaction.dispute?.isDisputed) {
      throw new BadRequestException('Transaction is not in disputed status');
    }

    transaction.dispute.resolution = {
      decision,
      explanation,
      resolvedBy: new Types.ObjectId(adminId),
      resolvedAt: new Date(),
      refundAmount,
    } as any;

    const newStatus =
      decision === 'refund_buyer'
        ? TransactionStatus.REFUNDED
        : TransactionStatus.COMPLETED;

    transaction.status = newStatus;
    const saved = await transaction.save();

    // Log action
    await this.logAction({
      adminId,
      action: 'resolve_dispute',
      targetType: 'transaction',
      targetId: transactionId,
      changes: {
        before: { status: TransactionStatus.DISPUTED },
        after: { status: newStatus, decision },
      },
      reason: explanation,
    });

    return saved;
  }

  async getAdminLogs(
    filters?: any,
    paginationQuery?: PaginationQueryDto,
  ): Promise<AdminLog[] | PaginatedResponse<AdminLog>> {
    // If no pagination params provided, return all with limit 100 (backward compatibility)
    if (!paginationQuery) {
      return this.adminLogModel
        .find(filters || {})
        .populate('adminId')
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    }

    const { page = 1, pageSize = 20, sortBy, sortOrder = 'desc' } = paginationQuery;
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
      this.adminLogModel
        .find(filters || {})
        .populate('adminId')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.adminLogModel.countDocuments(filters || {}).exec(),
    ]);

    return createPaginatedResponse(data, total, page, pageSize);
  }

  async getDashboardStats(): Promise<{
    totalTransactions: number;
    pendingVerification: number;
    inDispute: number;
    completedToday: number;
    totalVolume: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [allTransactions, pendingVerification, inDispute, completedToday] =
      await Promise.all([
        this.transactionsService.findAll(),
        this.transactionsService.findAll({
          status: TransactionStatus.PAYMENT_VERIFICATION,
        }),
        this.transactionsService.findAll({
          status: TransactionStatus.DISPUTED,
        }),
        this.transactionsService.findAll({
          status: TransactionStatus.COMPLETED,
          completedAt: { $gte: today },
        }),
      ]);

    const totalVolume = allTransactions
      .filter((tx) => tx.status === TransactionStatus.COMPLETED)
      .reduce((sum, tx) => sum + tx.payment.productPrice, 0);

    return {
      totalTransactions: allTransactions.length,
      pendingVerification: pendingVerification.length,
      inDispute: inDispute.length,
      completedToday: completedToday.length,
      totalVolume,
    };
  }

  async getRecentTransactions(limit = 10): Promise<any[]> {
    return this.transactionsService.findAll();
  }

  async assignTransactionToAdmin(
    transactionId: string,
    adminId: string,
  ): Promise<any> {
    const updated = await this.transactionsService.assignAdmin(
      transactionId,
      adminId,
    );

    await this.logAction({
      adminId,
      action: 'assign_transaction',
      targetType: 'transaction',
      targetId: transactionId,
    });

    return updated;
  }

  private async logAction(logData: LogActionData): Promise<AdminLog> {
    const log = new this.adminLogModel({
      adminId: new Types.ObjectId(logData.adminId),
      adminName: 'Admin', // TODO: Get from user service
      action: logData.action,
      targetType: logData.targetType,
      targetId: new Types.ObjectId(logData.targetId),
      changes: logData.changes,
      reason: logData.reason,
      ipAddress: logData.ipAddress,
    });
    return log.save();
  }
}
