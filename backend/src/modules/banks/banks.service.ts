import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank, BankDocument } from './schemas/bank.schema';

@Injectable()
export class BanksService {
  constructor(
    @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
  ) {}

  async findAll(): Promise<BankDocument[]> {
    return this.bankModel.find().sort({ name: 1 }).exec();
  }

  async findEnabled(): Promise<BankDocument[]> {
    return this.bankModel.find({ isEnable: true }).sort({ name: 1 }).exec();
  }

  async findByUniqueId(uniqueId: string): Promise<BankDocument | null> {
    return this.bankModel.findOne({ uniqueId }).exec();
  }

  async create(bankData: Partial<Bank>): Promise<BankDocument> {
    const createdBank = new this.bankModel(bankData);
    return createdBank.save();
  }

  async createMany(banksData: Partial<Bank>[]): Promise<BankDocument[]> {
    return this.bankModel.insertMany(banksData) as any;
  }

  async deleteAll(): Promise<void> {
    await this.bankModel.deleteMany({}).exec();
  }
}
