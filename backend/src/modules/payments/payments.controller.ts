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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('submit')
  submitPayment(@Body() submitPaymentDto: SubmitPaymentDto, @Request() req) {
    return this.paymentsService.submitPayment(
      submitPaymentDto,
      req.user.userId,
    );
  }

  @Get('instructions/:transactionId')
  getPaymentInstructions(@Param('transactionId') transactionId: string) {
    return this.paymentsService.getBuyerPaymentInstructions(transactionId);
  }

  @Get('transaction/:transactionId')
  getPaymentDetails(
    @Param('transactionId') transactionId: string,
    @Request() req,
  ) {
    return this.paymentsService.getPaymentDetails(
      transactionId,
      req.user.userId,
    );
  }

  @Post('cancel/:transactionId')
  cancelPayment(
    @Param('transactionId') transactionId: string,
    @Request() req,
    @Body() body: { reason: string },
  ) {
    return this.paymentsService.cancelPayment(
      transactionId,
      req.user.userId,
      body.reason,
    );
  }

  @Post('refund/:transactionId')
  requestRefund(
    @Param('transactionId') transactionId: string,
    @Request() req,
    @Body() body: { reason: string },
  ) {
    return this.paymentsService.requestRefund(
      transactionId,
      req.user.userId,
      body.reason,
    );
  }

  @Get('history')
  getPaymentHistory(@Request() req, @Query() paginationQuery?: PaginationQueryDto) {
    return this.paymentsService.getPaymentHistory(req.user.userId, paginationQuery);
  }

  @Get('payouts')
  getSellerPayouts(@Request() req, @Query() paginationQuery?: PaginationQueryDto) {
    return this.paymentsService.getSellerPayouts(req.user.userId, paginationQuery);
  }
}
