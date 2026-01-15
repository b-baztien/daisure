import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TransactionStatus } from 'src/common/enums/transaction-status.enum';
import { ITransactionDocument } from 'src/common/interfaces/transaction.interface';
import { LineNotificationService } from './line-notification.service';
import { Notification } from './schemas/notification.schema';

interface CreateNotificationDto {
  userId: Types.ObjectId;
  transactionId?: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private lineNotificationService: LineNotificationService,
  ) {}

  async sendTransactionCreated(
    transaction: ITransactionDocument,
  ): Promise<void> {
    // Create notifications for buyer
    await this.create({
      userId: transaction.buyer.userId,
      transactionId: transaction._id,
      type: 'transaction_created',
      title: 'สร้างรายการซื้อขายใหม่',
      message: `รายการซื้อ ${transaction.product.name} ถูกสร้างแล้ว`,
    });

    // Create notifications for seller
    await this.create({
      userId: transaction.seller.userId,
      transactionId: transaction._id,
      type: 'transaction_created',
      title: 'มีคนต้องการซื้อสินค้าของคุณ',
      message: `${transaction.buyer.displayName} ต้องการซื้อ ${transaction.product.name}`,
    });

    // Send LINE notification
    await this.lineNotificationService.sendTransactionNotification(
      transaction,
      'created',
    );
  }

  async sendStatusUpdate(
    transaction: ITransactionDocument,
    status: TransactionStatus,
  ): Promise<void> {
    const statusMessages: Record<string, string> = {
      [TransactionStatus.PAYMENT_VERIFICATION]: 'กำลังตรวจสอบการชำระเงิน',
      [TransactionStatus.AWAITING_SHIPMENT]: 'รอจัดส่งสินค้า',
      [TransactionStatus.SHIPPED]: 'สินค้าถูกจัดส่งแล้ว',
      [TransactionStatus.DELIVERED]: 'สินค้าถูกส่งถึงแล้ว',
      [TransactionStatus.COMPLETED]: 'ธุรกรรมสำเร็จ',
    };

    const message = statusMessages[status] || `สถานะเปลี่ยนเป็น ${status}`;

    await this.create({
      userId: transaction.buyer.userId,
      transactionId: transaction._id,
      type: 'status_update',
      title: 'อัพเดทสถานะรายการ',
      message: `${transaction.transactionNumber}: ${message}`,
    });

    // Send LINE notification
    if (transaction.buyer.lineUserId) {
      await this.lineNotificationService.sendStatusUpdateNotification(
        transaction.buyer.lineUserId,
        transaction.transactionNumber,
        message,
      );
    }
  }

  async sendDisputeCreated(transaction: ITransactionDocument): Promise<void> {
    await this.create({
      userId: transaction.buyer.userId,
      transactionId: transaction._id,
      type: 'dispute_created',
      title: 'มีข้อพิพาท',
      message: 'มีการสร้างข้อพิพาทสำหรับรายการนี้',
      priority: 'high',
    });
  }

  private async create(
    notificationData: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = new this.notificationModel(notificationData);
    return notification.save();
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(
        notificationId,
        { 'channels.web.isRead': true, 'channels.web.readAt': new Date() },
        { new: true },
      )
      .exec();
  }

  async getUserNotifications(
    userId: string,
    limit = 20,
  ): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
