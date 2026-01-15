import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AddBankAccountDto } from './dto/add-bank-account.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password if provided
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(createUserDto.password, salt);

      const user = new this.userModel({
        auth: {
          email: createUserDto.email,
          passwordHash,
          salt,
          lineUserId: createUserDto.lineUserId,
        },
        profile: {
          displayName: createUserDto.displayName,
          phone: createUserDto.phone,
          email: createUserDto.email,
          pictureUrl: createUserDto.pictureUrl,
        },
        role: createUserDto.role || 'buyer',
      });

      return user.save();
    }

    // LINE user without password
    const user = new this.userModel({
      auth: {
        lineUserId: createUserDto.lineUserId,
      },
      profile: {
        displayName: createUserDto.displayName,
        pictureUrl: createUserDto.pictureUrl,
      },
      role: 'buyer',
    });

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-auth.passwordHash -auth.salt').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-auth.passwordHash -auth.salt')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByLineUserId(lineUserId: string): Promise<User | null> {
    return this.userModel.findOne({ 'auth.lineUserId': lineUserId }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ 'auth.email': email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { profile: updateUserDto } },
        { new: true },
      )
      .select('-auth.passwordHash -auth.salt')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async addBankAccount(
    userId: string,
    addBankAccountDto: AddBankAccountDto,
  ): Promise<User> {
    const user = await this.findOne(userId);

    // If this is set as default, unset others
    if (addBankAccountDto.isDefault) {
      user.bankAccounts.forEach((account) => {
        account.isDefault = false;
      });
    }

    user.bankAccounts.push(addBankAccountDto as any);
    return user.save();
  }

  async getBankAccounts(userId: string) {
    const user = await this.findOne(userId);
    return user.bankAccounts;
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ 'auth.email': email }).exec();

    if (!user || !user.auth.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.auth.passwordHash);
    return isValid ? user : null;
  }

  async updateLastLogin(id: string, platform: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, {
        lastLoginAt: new Date(),
        lastLoginPlatform: platform,
      })
      .exec();
  }

  async updateRefreshToken(
    userId: string,
    refreshToken?: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        'auth.refreshToken': refreshToken,
      })
      .exec();
  }
}
