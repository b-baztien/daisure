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
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // === Public endpoints (no auth required) ===

  @Get('share/:shareToken')
  findByShareToken(@Param('shareToken') shareToken: string) {
    return this.transactionsService.findByShareToken(shareToken);
  }

  @Post('share/:shareToken/join')
  @UseGuards(JwtAuthGuard)
  joinTransaction(
    @Param('shareToken') shareToken: string,
    @Request() req,
  ) {
    return this.transactionsService.joinTransaction(
      shareToken,
      req.user.userId,
    );
  }

  // === Authenticated endpoints ===

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(
      createTransactionDto,
      req.user.userId, // sellerId - ผู้ขายเป็นคนสร้าง transaction
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('status') status?: TransactionStatus,
    @Query() paginationQuery?: PaginationQueryDto,
    @Request() req?,
  ) {
    const filters = status ? { status } : undefined;
    return this.transactionsService.findAll(filters, paginationQuery);
  }

  @Get('my-purchases')
  @UseGuards(JwtAuthGuard)
  getMyPurchases(@Request() req, @Query() paginationQuery?: PaginationQueryDto) {
    return this.transactionsService.findByUser(
      req.user.userId,
      'buyer',
      paginationQuery,
    );
  }

  @Get('my-sales')
  @UseGuards(JwtAuthGuard)
  getMySales(@Request() req, @Query() paginationQuery?: PaginationQueryDto) {
    return this.transactionsService.findByUser(
      req.user.userId,
      'seller',
      paginationQuery,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id/confirm-delivery')
  @UseGuards(JwtAuthGuard)
  confirmDelivery(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.transactionsService.confirmDelivery(
      id,
      req.user.userId,
      body.note,
    );
  }

  @Patch(':id/dispute')
  @UseGuards(JwtAuthGuard)
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
