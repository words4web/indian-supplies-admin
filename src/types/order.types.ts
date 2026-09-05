export type OrderStatus = "IN_PROCESS" | "DELIVERED";

export interface DeliveryDetails {
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  productId:
    | {
        _id: string;
        name: string;
        pack?: string;
        price?: number;
      }
    | string;
  quantity: number;
  priceAtOrder: number;
}

export interface OrderRow {
  _id: string;
  orderId: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    business?: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  delivery: DeliveryDetails;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderConfirmation {
  orderId: string;
  placedAt: string;
  itemCount: number;
  total: number;
  delivery: DeliveryDetails;
}
