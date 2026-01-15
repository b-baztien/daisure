import { Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { FollowHandler } from './handlers/follow.handler';
import { MessageHandler } from './handlers/message.handler';
import { PostbackHandler } from './handlers/postback.handler';
import { LineController } from './line.controller';
import { LineService } from './line.service';

@Module({
  imports: [
    UsersModule,
    TransactionsModule,
    forwardRef(() => NotificationsModule),
  ],
  controllers: [LineController],
  providers: [LineService, MessageHandler, PostbackHandler, FollowHandler],
  exports: [LineService],
})
export class LineModule {}
