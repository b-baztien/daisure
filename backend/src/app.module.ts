import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

// Config
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

// Modules
import lineConfig from './config/line.config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BanksModule } from './modules/banks/banks.module';
import { KycModule } from './modules/kyc/kyc.module';
import { LineModule } from './modules/line/line.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, lineConfig, jwtConfig],
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    // Schedule (for auto-complete transactions)
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    UsersModule,
    TransactionsModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    LineModule,
    AdminModule,
    SettingsModule,
    BanksModule,
    KycModule,
  ],
})
export class AppModule {}
