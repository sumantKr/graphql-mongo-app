export interface IOrderProduct {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder {
  customerId: string;
  products: IOrderProduct[];
  totalAmount: number;
  status: 'pending' | 'canceled' | 'completed';
  orderDate: Date
}