import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';
import { ITransactionDocument } from '../../common/interfaces/transaction.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { PaymentDeadline } from './interfaces/payment-deadline.interface';
import { PaymentDetails } from './interfaces/payment-details.interface';
import { PaymentHistoryItem } from './interfaces/payment-history.interface';
import { PaymentInstructions } from './interfaces/payment-instructions.interface';
import { PaymentSummary } from './interfaces/payment-summary.interface';
import { PaymentVerificationResult } from './interfaces/payment-verification.interface';
import { PendingPayment } from './interfaces/pending-payment.interface';
import { SellerPayoutItem } from './interfaces/seller-payout.interface';

@Injectable()
export class PaymentsService {
  constructor(
    private transactionsService: TransactionsService,
    private notificationsService: NotificationsService,
  ) {}

  async submitPayment(
    submitPaymentDto: SubmitPaymentDto,
    userId: string,
  ): Promise<any> {
    const transaction = await this.transactionsService.findOne(
      submitPaymentDto.transactionId,
    );

    // Verify user is the buyer
    if (transaction.buyer.userId.toString() !== userId) {
      throw new BadRequestException('Only buyer can submit payment');
    }

    // Check status
    if (transaction.status !== TransactionStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        'Transaction is not in pending payment status',
      );
    }

    // Verify amount
    if (submitPaymentDto.paidAmount !== transaction.payment.totalAmount) {
      throw new BadRequestException(
        `Payment amount mismatch. Expected: ${transaction.payment.totalAmount}, Got: ${submitPaymentDto.paidAmount}`,
      );
    }

    // Update payment info
    transaction.payment.buyerPayment = {
      method: submitPaymentDto.method,
      slipImages: submitPaymentDto.slipImages,
      paidAmount: submitPaymentDto.paidAmount,
      paidAt: new Date(),
      submittedFrom: 'web',
    } as any;

    // Update status
    transaction.status = TransactionStatus.PAYMENT_VERIFICATION;

    transaction.timeline.push({
      status: TransactionStatus.PAYMENT_VERIFICATION,
      action: 'payment_submitted',
      description: submitPaymentDto.note || 'Buyer submitted payment proof',
      actorId: userId as any,
      platform: 'web',
      timestamp: new Date(),
    } as any);

    const saved = await transaction.save();

    // Send notifications
    await this.notificationsService.sendStatusUpdate(
      saved as unknown as ITransactionDocument,
      TransactionStatus.PAYMENT_VERIFICATION,
    );

    return {
      message: 'Payment submitted successfully',
      transaction: {
        id: saved._id,
        transactionNumber: saved.transactionNumber,
        status: saved.status,
      },
    };
  }

  async getPaymentDetails(
    transactionId: string,
    userId: string,
  ): Promise<PaymentDetails> {
    const transaction = await this.transactionsService.findOne(transactionId);

    // Verify user is part of transaction
    const isBuyer = transaction.buyer.userId.toString() === userId;
    const isSeller = transaction.seller.userId.toString() === userId;

    if (!isBuyer && !isSeller) {
      throw new BadRequestException(
        'You are not authorized to view this payment',
      );
    }

    return {
      transactionNumber: transaction.transactionNumber,
      payment: transaction.payment,
      status: transaction.status,
    };
  }

  async getBuyerPaymentInstructions(
    transactionId: string,
  ): Promise<PaymentInstructions> {
    const transaction = await this.transactionsService.findOne(transactionId);

    return {
      transactionNumber: transaction.transactionNumber,
      totalAmount: transaction.payment.totalAmount,
      breakdown: {
        productPrice: transaction.payment.productPrice,
        escrowFee: transaction.payment.escrowFee,
        shippingFee: transaction.payment.shippingFee,
      },
      bankAccounts: [
        {
          bankName: 'ธนาคารกสิกรไทย',
          bankCode: 'KBANK',
          accountNumber: '123-4-56789-0',
          accountName: 'บริษัท Escrow Service จำกัด',
          promptPayId: '0812345678',
          qrCodeUrl: 'https://example.com/qr-code.png',
        },
        {
          bankName: 'ธนาคารไทยพาณิชย์',
          bankCode: 'SCB',
          accountNumber: '987-6-54321-0',
          accountName: 'บริษัท Escrow Service จำกัด',
          promptPayId: '0812345678',
        },
      ],
      instructions: [
        '1. โอนเงินตามจำนวนที่ระบุ',
        '2. ถ่ายรูปหลักฐานการโอนเงิน (สลิป)',
        '3. อัพโหลดสลิปในระบบ',
        '4. รอแอดมินตรวจสอบภายใน 24 ชั่วโมง',
      ],
      note: 'กรุณาตรวจสอบจำนวนเงินให้ถูกต้องก่อนโอน',
    };
  }

  async cancelPayment(
    transactionId: string,
    userId: string,
    reason: string,
  ): Promise<{ message: string }> {
    const transaction = await this.transactionsService.findOne(transactionId);

    // Verify user is the buyer
    if (transaction.buyer.userId.toString() !== userId) {
      throw new BadRequestException('Only buyer can cancel payment');
    }

    // Check status
    if (
      transaction.status !== TransactionStatus.PENDING_PAYMENT &&
      transaction.status !== TransactionStatus.PAYMENT_VERIFICATION
    ) {
      throw new BadRequestException('Cannot cancel payment at this stage');
    }

    // Update status
    await this.transactionsService.updateStatus(
      transactionId,
      TransactionStatus.CANCELLED,
      userId,
      reason || 'Payment cancelled by buyer',
    );

    return { message: 'Payment cancelled successfully' };
  }

  async requestRefund(
    transactionId: string,
    userId: string,
    reason: string,
  ): Promise<{ message: string }> {
    const transaction = await this.transactionsService.findOne(transactionId);

    // Verify user is the buyer
    if (transaction.buyer.userId.toString() !== userId) {
      throw new BadRequestException('Only buyer can request refund');
    }

    // Check if payment was made
    if (!transaction.payment.buyerPayment) {
      throw new BadRequestException('No payment found for this transaction');
    }

    // Check if transaction is in a state where refund can be requested
    const refundableStatuses = [
      TransactionStatus.PAYMENT_VERIFICATION,
      TransactionStatus.AWAITING_SHIPMENT,
      TransactionStatus.SHIPPED,
      TransactionStatus.DELIVERED,
    ];

    if (!refundableStatuses.includes(transaction.status)) {
      throw new BadRequestException('Refund cannot be requested at this stage');
    }

    // Create dispute for refund request
    await this.transactionsService.createDispute(
      transactionId,
      userId,
      'refund_request',
      reason,
      [],
    );

    return { message: 'Refund request submitted successfully' };
  }

  async getPaymentHistory(userId: string): Promise<PaymentHistoryItem[]> {
    const transactions = await this.transactionsService.findByUser(
      userId,
      'buyer',
    );

    return transactions
      .filter((tx) => tx.payment.buyerPayment)
      .map((tx) => ({
        transactionNumber: tx.transactionNumber,
        productName: tx.product.name,
        amount: tx.payment.totalAmount,
        paidAt: tx.payment.buyerPayment!.paidAt,
        status: tx.status,
        verifiedAt: tx.payment.buyerPayment!.verifiedAt,
      }))
      .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());
  }

  async getSellerPayouts(userId: string): Promise<SellerPayoutItem[]> {
    const transactions = await this.transactionsService.findByUser(
      userId,
      'seller',
    );

    return transactions
      .filter((tx) => tx.payment.sellerPayment)
      .map((tx) => ({
        transactionNumber: tx.transactionNumber,
        productName: tx.product.name,
        amount: tx.payment.productPrice,
        paidAt: tx.payment.sellerPayment!.paidAt,
        status: tx.status,
      }))
      .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());
  }

  async getPendingPayments(userId: string): Promise<PendingPayment[]> {
    const transactions = await this.transactionsService.findByUser(
      userId,
      'buyer',
    );

    return transactions
      .filter((tx) => tx.status === TransactionStatus.PENDING_PAYMENT)
      .map((tx) => ({
        id: tx._id,
        transactionNumber: tx.transactionNumber,
        productName: tx.product.name,
        totalAmount: tx.payment.totalAmount,
        createdAt: tx.createdAt,
        daysRemaining: this.calculateDaysRemaining(tx.createdAt),
      }));
  }

  async getPaymentSummary(userId: string): Promise<PaymentSummary> {
    const [buyerTransactions, sellerTransactions] = await Promise.all([
      this.transactionsService.findByUser(userId, 'buyer'),
      this.transactionsService.findByUser(userId, 'seller'),
    ]);

    const totalPaid = buyerTransactions
      .filter((tx) => tx.payment.buyerPayment)
      .reduce((sum, tx) => sum + tx.payment.totalAmount, 0);

    const totalReceived = sellerTransactions
      .filter((tx) => tx.payment.sellerPayment)
      .reduce((sum, tx) => sum + tx.payment.productPrice, 0);

    const pendingPayments = buyerTransactions.filter(
      (tx) => tx.status === TransactionStatus.PENDING_PAYMENT,
    ).length;

    const completedTransactions = [
      ...buyerTransactions,
      ...sellerTransactions,
    ].filter((tx) => tx.status === TransactionStatus.COMPLETED).length;

    return {
      totalPaid,
      totalReceived,
      pendingPayments,
      completedTransactions,
    };
  }

  async verifyPaymentAmount(
    transactionId: string,
    paidAmount: number,
  ): Promise<PaymentVerificationResult> {
    const transaction = await this.transactionsService.findOne(transactionId);
    const expectedAmount = transaction.payment.totalAmount;
    const isValid = paidAmount === expectedAmount;
    const difference = paidAmount - expectedAmount;

    return {
      isValid,
      expectedAmount,
      difference: isValid ? undefined : difference,
      message: isValid
        ? 'Payment amount is correct'
        : difference > 0
          ? `Overpaid by ฿${difference}`
          : `Underpaid by ฿${Math.abs(difference)}`,
    };
  }

  async getPaymentDeadline(transactionId: string): Promise<PaymentDeadline> {
    const transaction = await this.transactionsService.findOne(transactionId);

    // Payment deadline is 24 hours after transaction creation
    const deadline = new Date(transaction.createdAt);
    deadline.setHours(deadline.getHours() + 24);

    const now = new Date();
    const hoursRemaining = Math.max(
      0,
      Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)),
    );
    const isExpired = now > deadline;

    return {
      deadline,
      hoursRemaining,
      isExpired,
    };
  }

  async resubmitPayment(
    transactionId: string,
    userId: string,
    submitPaymentDto: Omit<SubmitPaymentDto, 'transactionId'>,
  ): Promise<any> {
    const transaction = await this.transactionsService.findOne(transactionId);

    // Verify user is the buyer
    if (transaction.buyer.userId.toString() !== userId) {
      throw new BadRequestException('Only buyer can resubmit payment');
    }

    // Check if transaction is in rejected status
    if (transaction.status !== TransactionStatus.PAYMENT_REJECTED) {
      throw new BadRequestException(
        'Can only resubmit payment for rejected transactions',
      );
    }

    // Update with new payment proof
    transaction.payment.buyerPayment = {
      method: submitPaymentDto.method,
      slipImages: submitPaymentDto.slipImages,
      paidAmount: submitPaymentDto.paidAmount,
      paidAt: new Date(),
      submittedFrom: 'web',
    } as any;

    transaction.status = TransactionStatus.PAYMENT_VERIFICATION;

    transaction.timeline.push({
      status: TransactionStatus.PAYMENT_VERIFICATION,
      action: 'payment_resubmitted',
      description: 'Buyer resubmitted payment proof after rejection',
      actorId: userId as any,
      platform: 'web',
      timestamp: new Date(),
    } as any);

    const saved = await transaction.save();

    // Send notifications
    await this.notificationsService.sendStatusUpdate(
      saved as unknown as ITransactionDocument,
      TransactionStatus.PAYMENT_VERIFICATION,
    );

    return {
      message: 'Payment resubmitted successfully',
      transaction: {
        id: saved._id,
        transactionNumber: saved.transactionNumber,
        status: saved.status,
      },
    };
  }

  private calculateDaysRemaining(createdAt: Date): number {
    const deadline = new Date(createdAt);
    deadline.setHours(deadline.getHours() + 24);

    const now = new Date();
    const hoursRemaining = Math.max(
      0,
      Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)),
    );

    return Math.ceil(hoursRemaining / 24);
  }
}
