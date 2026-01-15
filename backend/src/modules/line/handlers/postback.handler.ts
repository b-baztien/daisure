import { Client } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../../transactions/transactions.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PostbackHandler {
  constructor(
    private transactionsService: TransactionsService,
    private usersService: UsersService,
  ) {}

  async handle(event: any, client: Client) {
    const { replyToken, postback, source } = event;
    const userId = source.userId;
    const data = new URLSearchParams(postback.data);
    const action = data.get('action');

    switch (action) {
      case 'view_transaction': {
        const transactionId = data.get('id');
        await this.handleViewTransaction(
          transactionId as string,
          userId,
          replyToken,
          client,
        );
        break;
      }

      case 'confirm_delivery': {
        const confirmId = data.get('id');
        await this.handleConfirmDelivery(
          confirmId as string,
          userId,
          replyToken,
          client,
        );
        break;
      }

      case 'my_purchases':
        // Redirect to message handler
        await this.handleMyPurchases(userId, replyToken, client);
        break;

      case 'my_sales':
        await this.handleMySales(userId, replyToken, client);
        break;

      default:
        console.log('Unknown postback action:', action);
    }
  }

  private async handleViewTransaction(
    transactionId: string,
    userId: string,
    replyToken: string,
    client: Client,
  ) {
    try {
      const transaction = await this.transactionsService.findOne(transactionId);

      const message = {
        type: 'text',
        text:
          `📋 รายละเอียดรายการ\n\n` +
          `เลขที่: ${transaction.transactionNumber}\n` +
          `สินค้า: ${transaction.product.name}\n` +
          `ราคา: ฿${transaction.payment.productPrice.toLocaleString()}\n` +
          `ค่าธรรมเนียม: ฿${transaction.payment.escrowFee.toLocaleString()}\n` +
          `ค่าจัดส่ง: ฿${transaction.payment.shippingFee.toLocaleString()}\n` +
          `รวม: ฿${transaction.payment.totalAmount.toLocaleString()}\n\n` +
          `สถานะ: ${transaction.status}`,
      };

      await client.replyMessage(replyToken, message as any);
    } catch (error) {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      } as any);
    }
  }

  private async handleConfirmDelivery(
    transactionId: string,
    userId: string,
    replyToken: string,
    client: Client,
  ) {
    try {
      const user = await this.usersService.findByLineUserId(userId);

      await this.transactionsService.confirmDelivery(
        transactionId,
        user?._id?.toString() as string,
        'ยืนยันผ่าน LINE',
      );

      const message = {
        type: 'text',
        text: '✅ ยืนยันการรับสินค้าเรียบร้อยแล้ว\nระบบจะโอนเงินให้ผู้ขายภายใน 24 ชั่วโมง',
      };

      await client.replyMessage(replyToken, message as any);
    } catch (error) {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'ไม่สามารถยืนยันได้ กรุณาติดต่อแอดมิน',
      } as any);
    }
  }

  private async handleMyPurchases(
    userId: string,
    replyToken: string,
    client: Client,
  ) {
    // Similar to message handler
    const message = {
      type: 'text',
      text: 'กำลังดึงรายการซื้อของคุณ...',
    };
    await client.replyMessage(replyToken, message as any);
  }

  private async handleMySales(
    userId: string,
    replyToken: string,
    client: Client,
  ) {
    const message = {
      type: 'text',
      text: 'กำลังดึงรายการขายของคุณ...',
    };
    await client.replyMessage(replyToken, message as any);
  }
}
