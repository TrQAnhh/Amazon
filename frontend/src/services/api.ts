import { CreateProductRequest, UpdateProductRequest, CreateOrderRequest, PaymentRequest } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Product APIs
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  async createProduct(product: CreateProductRequest) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }

  async updateProduct(product: UpdateProductRequest) {
    const response = await fetch(`${API_BASE}/products/${product.id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }

  // Order APIs
  async getOrders() {
    const response = await fetch(`${API_BASE}/orders`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  async createOrder(order: CreateOrderRequest) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  }

  // Payment APIs (Mocked for now)
  async processPayment(payment: PaymentRequest) {
    // Mock Stripe payment - replace with actual Stripe integration
    const response = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      throw new Error('Payment failed');
    }

    return response.json();
  }
}