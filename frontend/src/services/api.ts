import { CreateProductRequest, UpdateProductRequest, CreateOrderRequest } from '../types';
import { authorizedFetch } from "./authFetch.ts";

const API_BASE = import.meta.env.VITE_API_BASE;

export class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getProducts() {
    const response = await fetch(`${API_BASE}/product`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  async getProductDetails(sku: string) {
      const response = await fetch(`${API_BASE}/product/${sku}`, {
          headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
          throw new Error('Failed to fetch products');
      }

      return response.json();
  }

  async createProduct(product: CreateProductRequest) {
    const response = await authorizedFetch(`${API_BASE}/product/create`, {
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
    const response = await authorizedFetch(`${API_BASE}/product/${product.id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }

  async getOrders() {
    const response = await authorizedFetch(`${API_BASE}/order/my-orders`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  async getOrderDetails(orderId: number) {
      const response = await authorizedFetch(`${API_BASE}/order/my-orders/${orderId}`, {
          headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
          throw new Error('Failed to fetch order details');
      }

      return response.json();
  }

  async createOrder(order: CreateOrderRequest) {
    const response = await authorizedFetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  }

  async cancelOrder(orderId: number) {
      const response = await authorizedFetch(`${API_BASE}/order/my-orders/${orderId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
          throw new Error('Failed to cancel order');
      }

      return response.json();
  }

  async checkout(orderId: number) {
      const response = await authorizedFetch(`${API_BASE}/order/my-orders/${orderId}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
          throw new Error('Failed to checkout order');
      }

      return response.json();
  }
}