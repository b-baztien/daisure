import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaginationQueryDto,
  PaginatedResponse,
  createPaginatedResponse,
} from '../../common/dto/pagination.dto';
import { KycSetting } from './schemas/kyc-setting.schema';
import {
  KycVerification,
  KycStatus,
} from './schemas/kyc-verification.schema';
import { User } from '../users/schemas/user.schema';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { UpdateKycSettingDto } from './dto/update-kyc-setting.dto';
import { ApproveKycDto, RejectKycDto } from './dto/review-kyc.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(KycSetting.name) private kycSettingModel: Model<KycSetting>,
    @InjectModel(KycVerification.name)
    private kycVerificationModel: Model<KycVerification>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // ดึงการตั้งค่า KYC
  async getKycSettings() {
    let setting = await this.kycSettingModel.findOne({ key: 'default' });

    if (!setting) {
      // สร้างค่าเริ่มต้น
      setting = await this.kycSettingModel.create({
        key: 'default',
        minimumPrice: 50000, // 50,000 บาทขึ้นไปต้อง KYC
        isEnabled: true,
      });
    }

    return setting;
  }

  // อัพเดทการตั้งค่า KYC (admin only)
  async updateKycSettings(
    updateDto: UpdateKycSettingDto,
    adminId: string,
  ): Promise<KycSetting> {
    const setting = await this.kycSettingModel.findOneAndUpdate(
      { key: 'default' },
      {
        ...updateDto,
        updatedBy: adminId,
      },
      { new: true, upsert: true },
    );

    return setting;
  }

  // ผู้ขายส่ง KYC
  async submitKyc(userId: string, submitDto: SubmitKycDto) {
    // ตรวจสอบว่ามี KYC ที่รออนุมัติอยู่หรือไม่
    const existingPending = await this.kycVerificationModel.findOne({
      userId,
      status: KycStatus.PENDING,
    });

    if (existingPending) {
      throw new BadRequestException(
        'คุณมี KYC ที่รออนุมัติอยู่แล้ว กรุณารอผลการตรวจสอบ',
      );
    }

    // สร้าง KYC verification ใหม่
    const verification = await this.kycVerificationModel.create({
      userId: userId as any,
      status: KycStatus.PENDING,
      idCardImages: submitDto.idCardImages,
      idCardInfo: submitDto.idCardInfo,
      submittedAt: new Date(),
    });

    // อัพเดทสถานะ KYC ใน User
    await this.userModel.findByIdAndUpdate(userId, {
      kycStatus: 'pending',
    });

    return verification;
  }

  // ดึงสถานะ KYC ของตัวเอง
  async getMyKycStatus(userId: string) {
    const verification = await this.kycVerificationModel
      .findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('review.reviewedBy', 'profile.displayName');

    return verification;
  }

  // Admin ดึงรายการ KYC ทั้งหมด
  async getAllKycVerifications(
    status?: KycStatus,
    paginationQuery?: PaginationQueryDto,
  ) {
    const query = status ? { status } : {};

    // If no pagination params provided, return all (backward compatibility)
    if (!paginationQuery) {
      const verifications = await this.kycVerificationModel
        .find(query)
        .populate('userId', 'profile auth.email bankAccounts')
        .populate('review.reviewedBy', 'profile.displayName')
        .sort({ submittedAt: -1 });

      return verifications;
    }

    const { page = 1, pageSize = 20, sortBy, sortOrder = 'desc' } = paginationQuery;
    const skip = (page - 1) * pageSize;

    // Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.submittedAt = -1;
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      this.kycVerificationModel
        .find(query)
        .populate('userId', 'profile auth.email bankAccounts')
        .populate('review.reviewedBy', 'profile.displayName')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.kycVerificationModel.countDocuments(query).exec(),
    ]);

    return createPaginatedResponse(data, total, page, pageSize);
  }

  // Admin อนุมัติ KYC
  async approveKyc(
    verificationId: string,
    adminId: string,
    approveDto: ApproveKycDto,
  ) {
    const verification = await this.kycVerificationModel.findById(
      verificationId,
    );

    if (!verification) {
      throw new NotFoundException('ไม่พบข้อมูล KYC นี้');
    }

    if (verification.status !== KycStatus.PENDING) {
      throw new BadRequestException('KYC นี้ได้รับการตรวจสอบแล้ว');
    }

    // อัพเดท verification
    verification.status = KycStatus.APPROVED;
    verification.approvedAt = new Date();
    verification.review = {
      reviewedBy: adminId as any,
      reviewedAt: new Date(),
      notes: approveDto.notes,
    };

    await verification.save();

    // อัพเดทสถานะ KYC ใน User
    await this.userModel.findByIdAndUpdate(verification.userId, {
      kycStatus: 'approved',
    });

    return verification;
  }

  // Admin ปฏิเสธ KYC
  async rejectKyc(
    verificationId: string,
    adminId: string,
    rejectDto: RejectKycDto,
  ) {
    const verification = await this.kycVerificationModel.findById(
      verificationId,
    );

    if (!verification) {
      throw new NotFoundException('ไม่พบข้อมูล KYC นี้');
    }

    if (verification.status !== KycStatus.PENDING) {
      throw new BadRequestException('KYC นี้ได้รับการตรวจสอบแล้ว');
    }

    // อัพเดท verification
    verification.status = KycStatus.REJECTED;
    verification.rejectedAt = new Date();
    verification.review = {
      reviewedBy: adminId as any,
      reviewedAt: new Date(),
      reason: rejectDto.reason,
      notes: rejectDto.notes,
    };

    await verification.save();

    // อัพเดทสถานะ KYC ใน User
    await this.userModel.findByIdAndUpdate(verification.userId, {
      kycStatus: 'rejected',
    });

    return verification;
  }

  // ตรวจสอบว่า seller ต้อง KYC หรือไม่ตามราคาสินค้า
  async checkKycRequired(sellerId: string, productPrice: number) {
    const settings = await this.getKycSettings();

    if (!settings.isEnabled) {
      return { required: false };
    }

    if (productPrice < settings.minimumPrice) {
      return { required: false };
    }

    // ตรวจสอบสถานะ KYC ของ seller
    const seller = await this.userModel.findById(sellerId);

    if (!seller) {
      throw new NotFoundException('ไม่พบข้อมูลผู้ขาย');
    }

    const kycStatus = seller.kycStatus || 'not_submitted';

    if (kycStatus === 'approved') {
      return { required: true, verified: true };
    }

    return {
      required: true,
      verified: false,
      status: kycStatus,
      message: this.getKycMessage(kycStatus),
    };
  }

  private getKycMessage(status: string): string {
    const messages = {
      not_submitted: 'คุณต้องทำการยืนยันตัวตน (KYC) ก่อนขายสินค้าราคานี้',
      pending: 'KYC ของคุณอยู่ระหว่างการตรวจสอบ กรุณารอผลการตรวจสอบ',
      rejected:
        'KYC ของคุณไม่ผ่านการตรวจสอบ กรุณาแก้ไขและส่งใหม่อีกครั้ง',
    };

    return messages[status] || 'กรุณาทำการยืนยันตัวตน';
  }
}
