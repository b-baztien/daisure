export interface PaymentDeadline {
  deadline: Date;
  hoursRemaining: number;
  isExpired: boolean;
}
