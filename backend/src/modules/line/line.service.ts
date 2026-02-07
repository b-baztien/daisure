import { Client, FlexMessage, TextMessage } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';
import { FollowHandler } from './handlers/follow.handler';
import { MessageHandler } from './handlers/message.handler';
import { PostbackHandler } from './handlers/postback.handler';

@Injectable()
export class LineService {
  private client: Client;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private transactionsService: TransactionsService,
    private messageHandler: MessageHandler,
    private postbackHandler: PostbackHandler,
    private followHandler: FollowHandler,
  ) {
    this.client = new Client({
      channelAccessToken: this.configService.get(
        'line.channelAccessToken',
      ) as string,
      channelSecret: this.configService.get('line.channelSecret') as string,
    });
  }

  async handleEvent(event: any) {
    const { type } = event;

    switch (type) {
      case 'message':
        await this.messageHandler.handle(event, this.client);
        break;

      case 'postback':
        await this.postbackHandler.handle(event, this.client);
        break;

      case 'follow':
        await this.followHandler.handle(event, this.client);
        break;

      case 'unfollow':
        console.log(`User ${event.source.userId} unfollowed`);
        break;

      default:
        console.log(`Unknown event type: ${type}`);
    }
  }

  async sendTextMessage(userId: string, text: string) {
    const message: TextMessage = {
      type: 'text',
      text,
    };

    return this.client.pushMessage(userId, message);
  }

  async sendTransactionCreated(transaction: any) {
    const message = this.buildTransactionFlexMessage(transaction);

    // Send to both buyer and seller
    if (transaction.buyer?.lineUserId) {
      await this.client.pushMessage(transaction.buyer.lineUserId, message);
    }
    if (transaction.seller?.lineUserId) {
      await this.client.pushMessage(transaction.seller.lineUserId, message);
    }
  }

  async sendPaymentConfirmation(transaction: any) {
    const sellerMessage: TextMessage = {
      type: 'text',
      text: `💰 ได้รับการชำระเงินแล้ว!\n\nรายการ: ${transaction.transactionNumber}\nสินค้า: ${transaction.product.name}\n\nกรุณาจัดส่งสินค้าให้ผู้ซื้อ`,
    };

    if (transaction.seller?.lineUserId) {
      await this.client.pushMessage(
        transaction.seller.lineUserId,
        sellerMessage,
      );
    }
  }

  private buildTransactionFlexMessage(transaction: any): FlexMessage {
    return {
      type: 'flex',
      altText: `รายการธุรกรรม ${transaction.transactionNumber}`,
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            transaction.product.images[0] || 'https://via.placeholder.com/300',
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'cover',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: transaction.product.name,
              weight: 'bold',
              size: 'xl',
              wrap: true,
            },
            {
              type: 'box',
              layout: 'baseline',
              margin: 'md',
              contents: [
                {
                  type: 'text',
                  text: `฿${transaction.payment.totalAmount.toLocaleString()}`,
                  size: 'xl',
                  color: '#FF6B6B',
                  weight: 'bold',
                },
              ],
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: 'เลขที่',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text: transaction.transactionNumber,
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 5,
                    },
                  ],
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: 'สถานะ',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text: this.getStatusText(transaction.status),
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 5,
                    },
                  ],
                },
              ],
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'ดูรายละเอียด',
                data: `action=view_transaction&id=${transaction._id}`,
              },
            },
          ],
        },
      },
    };
  }

  private getStatusText(status: string): string {
    const statusMap = {
      initiated: 'เริ่มต้นแล้ว',
      pending_payment: 'รอชำระเงิน',
      payment_verification: 'รอตรวจสอบการชำระเงิน',
      awaiting_shipment: 'รอจัดส่งสินค้า',
      shipped: 'จัดส่งแล้ว',
      delivered: 'ได้รับสินค้าแล้ว',
      completed: 'สำเร็จ',
      disputed: 'มีข้อพิพาท',
      cancelled: 'ยกเลิก',
    };
    return statusMap[status] || status;
  }
}
