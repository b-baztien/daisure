import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(
      createTransactionDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Query('status') status?: TransactionStatus, @Request() req?) {
    return this.transactionsService.findAll({ status });
  }

  @Get('my-purchases')
  getMyPurchases(@Request() req) {
    return this.transactionsService.findByUser(req.user.userId, 'buyer');
  }

  @Get('my-sales')
  getMySales(@Request() req) {
    return this.transactionsService.findByUser(req.user.userId, 'seller');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id/confirm-delivery')
  confirmDelivery(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.transactionsService.confirmDelivery(
      id,
      req.user.userId,
      body.note,
    );
  }

  @Patch(':id/dispute')
  createDispute(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { reason: string; description: string; evidence: string[] },
  ) {
    return this.transactionsService.createDispute(
      id,
      req.user.userId,
      body.reason,
      body.description,
      body.evidence,
    );
  }
}
