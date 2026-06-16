import { CART_KEY, API_BASE_URL } from '../utils/constants';
import { getFromStorage, saveToStorage } from '../utils/helpers';
import { productService } from './productService';
import { authService } from './authService';

function getUserId() {
  try {
    const user = getFromStorage('nexus_user');
    return user ? user.id : null;
  } catch {
    return null;
  }
}

export const cartService = {
  getLocalCart() {
    return getFromStorage(CART_KEY, []);
  },

  async getCart(userId) {
    const uId = userId || getUserId();
    if (!uId) {
      return this.getLocalCart();
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/${uId}`, {
        headers: { ...authService.getAuthHeader() },
        credentials: 'include'
      });
      if (!res.ok) return this.getLocalCart();

      const data = await res.json();
      const items = [];
      for (const item of data.items) {
        const product = await productService.getProductById(item.productId);
        if (product) {
          items.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images?.[0] || item.imageUrl || '',
            category: product.category,
            quantity: item.quantity,
            stock: product.stock,
            discount: product.discount,
          });
        } else {
          items.push({
            id: item.productId,
            name: item.name,
            brand: '',
            price: item.price,
            originalPrice: item.price,
            image: item.imageUrl || '',
            category: '',
            quantity: item.quantity,
            stock: 99,
            discount: 0,
          });
        }
      }
      saveToStorage(CART_KEY, items);
      return items;
    } catch (e) {
      console.error(e);
      return this.getLocalCart();
    }
  },

  async addToCart(product, quantity = 1, userId) {
    const uId = userId || getUserId();
    if (!uId) {
      const cart = this.getLocalCart();
      const existingIndex = cart.findIndex(item => item.id.toString() === product.id.toString());
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || '',
          category: product.category,
          quantity,
          stock: product.stock,
          discount: product.discount,
        });
      }
      saveToStorage(CART_KEY, cart);
      return cart;
    }

    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      },
      body: JSON.stringify({ userId: uId, productId: product.id, quantity }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to add item to database cart.');

    return this.getCart(uId);
  },

  async removeFromCart(productId, userId) {
    const uId = userId || getUserId();
    if (!uId) {
      const cart = this.getLocalCart().filter(item => item.id.toString() !== productId.toString());
      saveToStorage(CART_KEY, cart);
      return cart;
    }

    const res = await fetch(`${API_BASE_URL}/cart/remove?userId=${uId}&productId=${productId}`, {
      method: 'DELETE',
      headers: { ...authService.getAuthHeader() },
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to remove item from database cart.');

    return this.getCart(uId);
  },

  async updateQuantity(productId, quantity, userId) {
    const uId = userId || getUserId();
    if (!uId) {
      const cart = this.getLocalCart().map(item =>
        item.id.toString() === productId.toString() ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      saveToStorage(CART_KEY, cart);
      return cart;
    }

    const res = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      },
      body: JSON.stringify({ userId: uId, productId, quantity }),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to update quantity in database cart.');

    return this.getCart(uId);
  },

  async clearCart(userId) {
    const uId = userId || getUserId();
    if (!uId) {
      saveToStorage(CART_KEY, []);
      return [];
    }

    const res = await fetch(`${API_BASE_URL}/cart/clear/${uId}`, {
      method: 'DELETE',
      headers: { ...authService.getAuthHeader() },
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to clear database cart.');

    saveToStorage(CART_KEY, []);
    return [];
  },

  getItemCount() {
    const cart = getFromStorage(CART_KEY, []);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
};
