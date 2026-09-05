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

export interface OrderHeaderProps {
  orderId?: string;
  createdAt?: string;
  status?: string;
  total?: number;
  isDelivered: boolean;
  isUpdating: boolean;
  onUpdateStatus: (status: "DELIVERED" | "IN_PROCESS") => void;
}

export interface OrderCustomerDetailsProps {
  delivery?: {
    contactPerson?: string;
    businessName?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
  userId?: {
    name?: string;
    business?: string;
    email?: string;
    phone?: string;
  };
}

export interface OrderItemsTableProps {
  items: Array<{
    productId?: {
      _id?: string;
      name?: string;
      slug?: string;
      pack?: string;
    };
    quantity: number;
    priceAtOrder: number;
  }>;
  subtotal?: number;
  vat?: number;
  total?: number;
}
