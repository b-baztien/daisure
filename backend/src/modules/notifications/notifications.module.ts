import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LineNotificationService } from './line-notification.service';
import { NotificationsService } from './notifications.service';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationsService, LineNotificationService],
  exports: [NotificationsService, LineNotificationService],
})
export class NotificationsModule {}
