import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { UpdateKycSettingDto } from './dto/update-kyc-setting.dto';
import { ApproveKycDto, RejectKycDto } from './dto/review-kyc.dto';
import { KycStatus } from './schemas/kyc-verification.schema';

@Controller('kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // ดึงการตั้งค่า KYC (ทุกคนเข้าถึงได้)
  @Get('settings')
  getKycSettings() {
    return this.kycService.getKycSettings();
  }

  // อัพเดทการตั้งค่า KYC (admin only)
  @Put('settings')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateKycSettings(@Body() updateDto: UpdateKycSettingDto, @Request() req) {
    return this.kycService.updateKycSettings(updateDto, req.user.userId);
  }

  // ผู้ขายส่ง KYC
  @Post('submit')
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  submitKyc(@Body() submitDto: SubmitKycDto, @Request() req) {
    return this.kycService.submitKyc(req.user.userId, submitDto);
  }

  // ดูสถานะ KYC ของตัวเอง
  @Get('my-status')
  getMyKycStatus(@Request() req) {
    return this.kycService.getMyKycStatus(req.user.userId);
  }

  // ตรวจสอบว่าต้อง KYC หรือไม่
  @Get('check-required')
  checkKycRequired(@Query('productPrice') productPrice: number, @Request() req) {
    return this.kycService.checkKycRequired(req.user.userId, productPrice);
  }

  // Admin ดูรายการ KYC ทั้งหมด
  @Get('verifications')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAllKycVerifications(
    @Query('status') status?: KycStatus,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    return this.kycService.getAllKycVerifications(status, paginationQuery);
  }

  // Admin อนุมัติ KYC
  @Put('verifications/:id/approve')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  approveKyc(
    @Param('id') id: string,
    @Body() approveDto: ApproveKycDto,
    @Request() req,
  ) {
    return this.kycService.approveKyc(id, req.user.userId, approveDto);
  }

  // Admin ปฏิเสธ KYC
  @Put('verifications/:id/reject')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  rejectKyc(
    @Param('id') id: string,
    @Body() rejectDto: RejectKycDto,
    @Request() req,
  ) {
    return this.kycService.rejectKyc(id, req.user.userId, rejectDto);
  }
}
