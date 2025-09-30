import {
    CreateProductRequest,
    UpdateProductRequest,
    CreateOrderRequest,
    UpdateOrderRequest,
    UpdateProfileDto
} from '../types';

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
    const response = await fetch(`${API_BASE}/product/create`, {
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
    const response = await fetch(`${API_BASE}/product/${product.id}`, {
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
    const response = await fetch(`${API_BASE}/order/my-orders`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  async getOrderDetails(orderId: number) {
      const response = await fetch(`${API_BASE}/order/my-orders/${orderId}`, {
          headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
          throw new Error('Failed to fetch order details');
      }

      return response.json();
  }

  async createOrder(order: CreateOrderRequest) {
    const response = await fetch(`${API_BASE}/order/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  }

  async updateOrder(orderId: number, updateOrderRequest: UpdateOrderRequest) {
    const response = await fetch(`${API_BASE}/order/my-orders/${orderId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateOrderRequest),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return response.json();
  }

  async cancelOrder(orderId: number) {
      const response = await fetch(`${API_BASE}/order/my-orders/${orderId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
          throw new Error('Failed to cancel order');
      }

      return response.json();
  }

  async checkout(orderId: number) {
      const response = await fetch(`${API_BASE}/order/my-orders/${orderId}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
          throw new Error('Failed to checkout order');
      }

      return response.json();
  }

  async getProfileDetails() {
    const response = await fetch(`${API_BASE}/profile/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to checkout order');
    }

    return response.json();
  }

  async updateProfileDetails(data: Partial<UpdateProfileDto>) {
    const response = await fetch(`${API_BASE}/profile/update`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update profile');
    }
    return response.json();
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE}/profile/avatar`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload avatar');
    }
    return response.json();
  }
}