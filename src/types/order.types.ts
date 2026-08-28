export interface DeliveryDetails {
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderConfirmation {
  orderId: string;
  placedAt: string;
  itemCount: number;
  total: number;
  delivery: DeliveryDetails;
}
