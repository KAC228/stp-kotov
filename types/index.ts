export interface ProductStat {
  value: string;
  label: string;
}

export interface ProductSize {
  id: string;
  label: string;
  dimensions: string;
  connectionDiameter: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  description: string;
  fullDescription: string;
  basePrice: number;
  sizes: ProductSize[];
  features: string[];
  stats: ProductStat[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
}

/** Тип плательщика */
export type CustomerType = "individual" | "legal";

/** Выбранный способ оплаты */
export type PaymentMethod = "card" | "sbp" | "mirpay" | "invoice";

export interface IndividualFormData {
  customerType: "individual";
  name: string;
  phone: string;
  email: string;
  address: string;
  comment?: string;
  paymentMethod: PaymentMethod;
}

export interface LegalFormData {
  customerType: "legal";
  orgName: string;
  inn: string;
  legalAddress: string;
  contactName: string;
  email: string;
  phone: string;
  comment?: string;
  paymentMethod: "invoice";
}

export type OrderFormData = IndividualFormData | LegalFormData;

export interface OrderPayload {
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  total: number;
  customer: OrderFormData;
}

export interface ConfiguratorQuotePayload {
  sku: string;
  summary: string;
  details: Record<string, string>;
}
