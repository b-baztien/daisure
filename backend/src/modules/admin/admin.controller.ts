import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Post('transactions/:id/verify-payment')
  verifyPayment(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { isApproved: boolean; note?: string },
  ) {
    return this.adminService.verifyPayment(
      id,
      req.user.userId,
      body.isApproved,
      body.note,
    );
  }

  @Post('transactions/:id/resolve-dispute')
  resolveDispute(
    @Param('id') id: string,
    @Request() req,
    @Body()
    body: {
      decision: 'refund_buyer' | 'release_to_seller' | 'partial_refund';
      explanation: string;
      refundAmount?: number;
    },
  ) {
    return this.adminService.resolveDispute(
      id,
      req.user.userId,
      body.decision,
      body.explanation,
      body.refundAmount,
    );
  }

  @Get('logs')
  getLogs(@Query() paginationQuery?: PaginationQueryDto) {
    return this.adminService.getAdminLogs(undefined, paginationQuery);
  }
}
