import { getFromStorage } from '../utils/helpers';
import { productService } from './productService';
import { API_BASE_URL } from '../utils/constants';
import { authService } from './authService';

function getUserId() {
  try {
    const user = getFromStorage('nexus_user');
    return user ? user.id : null;
  } catch {
    return null;
  }
}

async function mapBackendOrder(o) {
  const items = [];
  for (const item of o.items) {
    const product = await productService.getProductById(item.productId);
    items.push({
      id: item.productId,
      name: item.name || (product ? product.name : 'Product'),
      image: (product && product.images?.[0]) || item.imageUrl || 'https://via.placeholder.com/60',
      quantity: item.quantity,
      price: item.unitPrice
    });
  }

  const orderStatus = o.orderStatus ? o.orderStatus.toLowerCase() : 'placed';
  const timeline = [
    { status: 'Order Placed', date: o.orderDate, done: true },
    { status: 'Payment Confirmed', date: o.orderDate, done: o.paymentStatus === 'Paid' || o.paymentStatus === 'paid' },
    { status: 'Packed', date: null, done: ['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(orderStatus) },
    { status: 'Shipped', date: null, done: ['shipped', 'out_for_delivery', 'delivered'].includes(orderStatus) },
    { status: 'Out for Delivery', date: null, done: ['out_for_delivery', 'delivered'].includes(orderStatus) },
    { status: 'Delivered', date: null, done: orderStatus === 'delivered' },
  ];

  return {
    id: o.id,
    date: o.orderDate,
    status: orderStatus,
    paymentStatus: o.paymentStatus ? o.paymentStatus.toLowerCase() : 'pending',
    paymentMethod: 'cod',
    items,
    subtotal: Number(o.totalAmount),
    tax: 0,
    shipping: 0,
    discount: 0,
    total: Number(o.totalAmount),
    address: o.shippingAddress,
    estimatedDelivery: '5 days',
    timeline
  };
}

export const orderService = {
  async getOrders(userId) {
    const uId = userId || getUserId();
    if (!uId) return [];

    try {
      const res = await fetch(`${API_BASE_URL}/orders/user/${uId}`, {
        headers: { ...authService.getAuthHeader() },
        credentials: 'include'
      });
      if (!res.ok) return [];

      const rawOrders = await res.json();
      const mappedOrders = [];
      for (const o of rawOrders) {
        mappedOrders.push(await mapBackendOrder(o));
      }
      return mappedOrders;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async placeOrder(orderData) {
    const uId = getUserId();
    if (!uId) throw new Error('User not logged in');

    let addressStr = orderData.address;
    if (typeof orderData.address === 'object' && orderData.address !== null) {
      const addr = orderData.address;
      addressStr = `${addr.name}, ${addr.phone}, ${addr.line1}, ${addr.line2 ? addr.line2 + ', ' : ''}${addr.city}, ${addr.state} - ${addr.pincode}`;
    }

    const payload = {
      userId: uId,
      shippingAddress: addressStr
    };

    const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order.');
    }

    const data = await res.json();

    const allOrders = await this.getOrders(uId);
    const newOrder = allOrders.find(o => o.id === data.orderId) || {
      id: data.orderId,
      total: data.totalCharged,
      items: orderData.items,
      date: new Date().toISOString(),
      status: 'placed'
    };

    return { success: true, order: newOrder };
  },

  async getOrderById(orderId) {
    const orders = await this.getOrders();
    return orders.find(o => o.id === orderId) || null;
  },

  async getCurrentOrders() {
    const orders = await this.getOrders();
    return orders.filter(o =>
      ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(o.status)
    );
  },

  async getPastOrders() {
    const orders = await this.getOrders();
    return orders.filter(o =>
      ['delivered', 'cancelled', 'returned'].includes(o.status)
    );
  },
};
