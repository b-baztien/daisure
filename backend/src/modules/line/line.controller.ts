import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { LineService } from './line.service';

@Controller('line/webhook')
export class LineController {
  constructor(
    private readonly lineService: LineService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async handleWebhook(
    @Body() body: any,
    @Headers('x-line-signature') signature: string,
  ) {
    // Verify signature
    const channelSecret = this.configService.get('line.channelSecret');
    const hash = crypto
      .createHmac('SHA256', channelSecret)
      .update(JSON.stringify(body))
      .digest('base64');

    if (signature !== hash) {
      throw new BadRequestException('Invalid signature');
    }

    // Process events
    const events = body.events || [];

    for (const event of events) {
      await this.lineService.handleEvent(event);
    }

    return { success: true };
  }
}
