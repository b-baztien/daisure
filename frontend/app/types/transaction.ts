export interface Transaction {
  id: string;
  transactionNumber: string;
  status: string;
  product: {
    name: string;
    price: number;
    images: string[];
  };
  payment: {
    totalAmount: number;
  };
  createdAt: string;
}
