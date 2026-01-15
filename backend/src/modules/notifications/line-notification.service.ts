import { Client, TextMessage } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITransactionDocument } from '../../common/interfaces/transaction.interface';

@Injectable()
export class LineNotificationService {
  private client: Client | null = null;

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>(
      'line.channelAccessToken',
    );
    const channelSecret = this.configService.get<string>('line.channelSecret');

    if (accessToken && channelSecret) {
      this.client = new Client({
        channelAccessToken: accessToken,
        channelSecret: channelSecret,
      });
    }
  }

  async sendTextMessage(userId: string, text: string): Promise<void> {
    if (!this.client) {
      console.warn('LINE client not initialized. Skipping notification.');
      return;
    }

    try {
      const message: TextMessage = {
        type: 'text',
        text,
      };
      await this.client.pushMessage(userId, message);
    } catch (error) {
      console.error('Failed to send LINE message:', error);
      throw error;
    }
  }

  async sendTransactionNotification(
    transaction: ITransactionDocument,
    type: 'created' | 'updated',
  ): Promise<void> {
    if (!this.client) {
      console.warn('LINE client not initialized. Skipping notification.');
      return;
    }

    const recipients: string[] = [];
    if (transaction.buyer.lineUserId) {
      recipients.push(transaction.buyer.lineUserId);
    }
    if (transaction.seller.lineUserId) {
      recipients.push(transaction.seller.lineUserId);
    }

    for (const userId of recipients) {
      try {
        await this.sendTextMessage(
          userId,
          this.buildTransactionMessage(transaction, type),
        );
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error);
      }
    }
  }

  private buildTransactionMessage(
    transaction: ITransactionDocument,
    type: 'created' | 'updated',
  ): string {
    if (type === 'created') {
      return (
        `🎉 สร้างรายการใหม่\n\n` +
        `เลขที่: ${transaction.transactionNumber}\n` +
        `สินค้า: ${transaction.product.name}\n` +
        `ราคา: ฿${transaction.payment.totalAmount.toLocaleString()}`
      );
    }
    return `🔔 อัพเดทรายการ ${transaction.transactionNumber}`;
  }

  async sendStatusUpdateNotification(
    lineUserId: string,
    transactionNumber: string,
    statusMessage: string,
  ): Promise<void> {
    if (!this.client) {
      console.warn('LINE client not initialized. Skipping notification.');
      return;
    }

    try {
      await this.sendTextMessage(
        lineUserId,
        `🔔 ${statusMessage}\n\nรายการ: ${transactionNumber}`,
      );
    } catch (error) {
      console.error('Failed to send status update:', error);
    }
  }
}
