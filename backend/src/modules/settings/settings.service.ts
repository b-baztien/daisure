import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) {}

  async getEscrowFee() {
    let setting = await this.settingModel.findOne({ type: 'escrow_fee' });

    if (!setting) {
      // Create default settings
      setting = await this.settingModel.create({
        type: 'escrow_fee',
        escrowFee: {
          type: 'percentage',
          percentage: 3,
          minimumFee: 10,
          maximumFee: 500,
        },
      });
    }

    return setting.escrowFee;
  }

  async updateEscrowFee(feeData: any, updatedBy: string) {
    return this.settingModel.findOneAndUpdate(
      { type: 'escrow_fee' },
      {
        escrowFee: feeData,
        updatedBy,
      },
      { new: true, upsert: true },
    );
  }

  async getAutoCompleteSettings() {
    let setting = await this.settingModel.findOne({ type: 'auto_complete' });

    if (!setting) {
      setting = await this.settingModel.create({
        type: 'auto_complete',
        autoComplete: {
          enabled: true,
          days: 7,
          notifyBeforeDays: 2,
        },
      });
    }

    return setting.autoComplete;
  }

  async getRules() {
    let setting = await this.settingModel.findOne({ type: 'rules' });

    if (!setting) {
      setting = await this.settingModel.create({
        type: 'rules',
        rules: {
          minimumTransactionAmount: 100,
          maximumTransactionAmount: 1000000,
          requireIdVerification: false,
          requireIdVerificationAbove: 50000,
        },
      });
    }

    return setting.rules;
  }
}
