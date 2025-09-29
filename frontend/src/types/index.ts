export interface User {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  role: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  availableStock: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export type PaymentMethod = "STRIPE" | "COD";

export interface Order {
    id: number;
    createdAt: string;
    totalAmount: string;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
    paymentMethod: PaymentMethod;
    paymentStatus: string;
    orderInfo: OrderInfo;
    items: OrderItem[];
    checkoutUrl: string;
}

export interface OrderInfo {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    address: string;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: string;
    total: string;
    product: {
        name: string;
        imageUrl: string;
    };
}

export interface CreateOrderRequest {
    paymentMethod: PaymentMethod;
    items: {
        productId: number;
        quantity: number;
    }[];
}

export interface UpdateOrderRequest {
    paymentMethod: PaymentMethod;
}

export interface CartItem {
    id: number;
    sku: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    availableStock: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
}