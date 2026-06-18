import { API_BASE_URL } from '../utils/constants';
import { authService } from './authService';

export const adminService = {
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { 
        ...authService.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch users.');
    }
    return await res.json();
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 
        ...authService.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch orders.');
    }
    return await res.json();
  },

  async updateOrderStatus(orderId, orderStatus, paymentStatus) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      },
      body: JSON.stringify({ orderStatus, paymentStatus }),
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update order status.');
    }
    return await res.json();
  }
};
