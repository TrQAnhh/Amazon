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

export interface Order {
    id: number;
    createdAt: string;
    totalAmount: string;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';
    paymentMethod: string;
    paymentStatus: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  products: OrderItem[];
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
}