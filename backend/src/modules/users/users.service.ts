import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AddBankAccountDto } from './dto/add-bank-account.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import {
  PaginationQueryDto,
  PaginatedResponse,
  createPaginatedResponse,
} from '../../common/dto/pagination.dto';

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

  async findAll(
    paginationQuery?: PaginationQueryDto,
  ): Promise<User[] | PaginatedResponse<User>> {
    // If no pagination params provided, return all users (backward compatibility)
    if (!paginationQuery) {
      return this.userModel
        .find()
        .select('-auth.passwordHash -auth.salt')
        .exec();
    }

    const { page = 1, pageSize = 20, sortBy, sortOrder = 'desc' } = paginationQuery;
    const skip = (page - 1) * pageSize;

    // Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      this.userModel
        .find()
        .select('-auth.passwordHash -auth.salt')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return createPaginatedResponse(data, total, page, pageSize);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-auth.passwordHash -auth.salt')
      .populate('bankAccounts.bank')
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
      .populate('bankAccounts.bank')
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
    const user = await this.userModel
      .findById(userId)
      .select('-auth.passwordHash -auth.salt')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If this is set as default, unset others
    if (addBankAccountDto.isDefault) {
      user.bankAccounts.forEach((account) => {
        account.isDefault = false;
      });
    }

    // Create bank account object with bank reference
    const bankAccount = {
      bank: addBankAccountDto.bank._id,
      accountNumber: addBankAccountDto.accountNumber,
      accountName: addBankAccountDto.accountName,
      branch: addBankAccountDto.branch,
      isDefault: addBankAccountDto.isDefault || false,
      isVerified: false,
    };

    user.bankAccounts.push(bankAccount as any);
    await user.save();

    // Populate bank data before returning
    const updatedUser = await this.userModel
      .findById(userId)
      .select('-auth.passwordHash -auth.salt')
      .populate('bankAccounts.bank')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
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
