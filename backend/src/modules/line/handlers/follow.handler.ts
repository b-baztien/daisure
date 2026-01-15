import { Client, TextMessage } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FollowHandler {
  constructor(private usersService: UsersService) {}

  async handle(event: any, client: Client) {
    const { replyToken, source } = event;
    const userId = source.userId;

    // Get LINE profile
    const profile = await client.getProfile(userId);

    // Check if user already exists
    let user = await this.usersService.findByLineUserId(userId);

    if (!user) {
      // Create new user
      user = await this.usersService.create({
        lineUserId: userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
      });
    }

    // Send welcome message
    const welcomeMessage: TextMessage = {
      type: 'text',
      text:
        `สวัสดีค่ะคุณ ${profile.displayName}! 👋\n\n` +
        `ยินดีต้อนรับสู่บริการ Escrow Service\n` +
        `บริการรับฝากเงินค้ำประกันการซื้อขาย\n\n` +
        `พิมพ์ "เมนู" เพื่อดูเมนูหลัก\n` +
        `หรือเข้าใช้งานผ่านเว็บไซต์ของเรา`,
    };

    await client.replyMessage(replyToken, welcomeMessage);
  }
}
