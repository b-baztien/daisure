export interface PaymentVerificationResult {
  isValid: boolean;
  expectedAmount: number;
  difference?: number;
  message: string;
}
