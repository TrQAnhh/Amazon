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
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
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
  id: string;
  userId: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
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