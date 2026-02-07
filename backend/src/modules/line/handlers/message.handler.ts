import { Client, TextMessage } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { TransactionsService } from '../../transactions/transactions.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class MessageHandler {
  constructor(
    private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) {}

  async handle(event: any, client: Client) {
    const { replyToken, message, source } = event;
    const userId = source.userId;

    if (message.type !== 'text') {
      return;
    }

    const text = message.text.toLowerCase().trim();

    // Check if user exists
    const user = await this.usersService.findByLineUserId(userId);

    // Command handling
    if (text === 'เมนู' || text === 'menu') {
      await this.sendMainMenu(replyToken, client);
      return;
    }

    if (text === 'รายการซื้อ' || text.startsWith('my purchases')) {
      await this.sendMyPurchases(userId, replyToken, client);
      return;
    }

    if (text === 'รายการขาย' || text.startsWith('my sales')) {
      await this.sendMySales(userId, replyToken, client);
      return;
    }

    if (text.startsWith('track ')) {
      const transactionNumber = text.replace('track ', '').trim();
      await this.sendTransactionStatus(transactionNumber, replyToken, client);
      return;
    }

    // Default response
    const replyMessage: TextMessage = {
      type: 'text',
      text: `สวัสดีค่ะ! 👋\n\nคุณสามารถใช้คำสั่งต่อไปนี้:\n• เมนู - แสดงเมนูหลัก\n• รายการซื้อ - ดูรายการที่คุณซื้อ\n• รายการขาย - ดูรายการที่คุณขาย\n• track [เลขที่] - ติดตามสถานะ`,
    };

    await client.replyMessage(replyToken, replyMessage);
  }

  private async sendMainMenu(replyToken: string, client: Client) {
    const message = {
      type: 'template',
      altText: 'เมนูหลัก',
      template: {
        type: 'buttons',
        text: 'เลือกรายการที่ต้องการ',
        actions: [
          {
            type: 'postback',
            label: '📦 รายการซื้อของฉัน',
            data: 'action=my_purchases',
          },
          {
            type: 'postback',
            label: '💰 รายการขายของฉัน',
            data: 'action=my_sales',
          },
          {
            type: 'uri',
            label: '🌐 เปิดเว็บไซต์',
            uri: 'https://your-website.com',
          },
        ],
      },
    };

    await client.replyMessage(replyToken, message as any);
  }

  private async sendMyPurchases(
    userId: string,
    replyToken: string,
    client: Client,
  ) {
    const user = await this.usersService.findByLineUserId(userId);

    if (!user) {
      const message: TextMessage = {
        type: 'text',
        text: 'กรุณาลงทะเบียนผ่านเว็บไซต์ก่อนใช้งาน',
      };
      await client.replyMessage(replyToken, message);
      return;
    }

    const transactions = (await this.transactionsService.findByUser(
      user._id.toString(),
      'buyer',
    )) as Transaction[];

    if (transactions.length === 0) {
      const message: TextMessage = {
        type: 'text',
        text: 'คุณยังไม่มีรายการซื้อ',
      };
      await client.replyMessage(replyToken, message);
      return;
    }

    // Send list of transactions (max 5)
    const limitedTransactions = transactions.slice(0, 5);
    const text = limitedTransactions
      .map(
        (tx, index) =>
          `${index + 1}. ${tx.product.name}\n` +
          `   เลขที่: ${tx.transactionNumber}\n` +
          `   สถานะ: ${this.getStatusText(tx.status)}\n` +
          `   ราคา: ฿${tx.payment.totalAmount.toLocaleString()}`,
      )
      .join('\n\n');

    const message: TextMessage = {
      type: 'text',
      text: `📦 รายการซื้อของคุณ:\n\n${text}`,
    };

    await client.replyMessage(replyToken, message);
  }

  private async sendMySales(
    userId: string,
    replyToken: string,
    client: Client,
  ) {
    const user = await this.usersService.findByLineUserId(userId);

    if (!user) {
      const message: TextMessage = {
        type: 'text',
        text: 'กรุณาลงทะเบียนผ่านเว็บไซต์ก่อนใช้งาน',
      };
      await client.replyMessage(replyToken, message);
      return;
    }

    const transactions = (await this.transactionsService.findByUser(
      user._id.toString(),
      'seller',
    )) as Transaction[];

    if (transactions.length === 0) {
      const message: TextMessage = {
        type: 'text',
        text: 'คุณยังไม่มีรายการขาย',
      };
      await client.replyMessage(replyToken, message);
      return;
    }

    const limitedTransactions = transactions.slice(0, 5);
    const text = limitedTransactions
      .map(
        (tx, index) =>
          `${index + 1}. ${tx.product.name}\n` +
          `   เลขที่: ${tx.transactionNumber}\n` +
          `   สถานะ: ${this.getStatusText(tx.status)}\n` +
          `   ราคา: ฿${tx.payment.totalAmount.toLocaleString()}`,
      )
      .join('\n\n');

    const message: TextMessage = {
      type: 'text',
      text: `💰 รายการขายของคุณ:\n\n${text}`,
    };

    await client.replyMessage(replyToken, message);
  }

  private async sendTransactionStatus(
    transactionNumber: string,
    replyToken: string,
    client: Client,
  ) {
    try {
      const transaction =
        await this.transactionsService.findByTransactionNumber(
          transactionNumber,
        );

      const message: TextMessage = {
        type: 'text',
        text:
          `📋 รายการ: ${transaction.transactionNumber}\n\n` +
          `สินค้า: ${transaction.product.name}\n` +
          `สถานะ: ${this.getStatusText(transaction.status)}\n` +
          `ราคา: ฿${transaction.payment.totalAmount.toLocaleString()}\n\n` +
          `ผู้ขาย: ${transaction.seller?.displayName || '-'}\n` +
          `ผู้ซื้อ: ${transaction.buyer?.displayName || '-'}`,
      };

      await client.replyMessage(replyToken, message);
    } catch (error) {
      const message: TextMessage = {
        type: 'text',
        text: 'ไม่พบรายการที่ค้นหา',
      };
      await client.replyMessage(replyToken, message);
    }
  }

  private getStatusText(status: string): string {
    const statusMap = {
      initiated: '🟡 เริ่มต้นแล้ว',
      pending_payment: '⏳ รอชำระเงิน',
      payment_verification: '🔍 รอตรวจสอบ',
      awaiting_shipment: '📦 รอจัดส่ง',
      shipped: '🚚 จัดส่งแล้ว',
      delivered: '✅ ได้รับแล้ว',
      completed: '✅ สำเร็จ',
      disputed: '⚠️ มีข้อพิพาท',
      cancelled: '❌ ยกเลิก',
    };
    return statusMap[status] || status;
  }
}
