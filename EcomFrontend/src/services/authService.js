import { AUTH_KEY, USER_KEY, OTP_DEFAULT, API_BASE_URL } from '../utils/constants';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/helpers';

export const authService = {
  sendOTP(phone) {
    // Simulate OTP send
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `OTP sent to ${phone}` });
      }, 500);
    });
  },

  async verifyOTP(phone, otp) {
    const res = await fetch(`${API_BASE_URL}/Auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, otp })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Invalid OTP. Use 0000');
    }

    const data = await res.json();

    // Fetch the full profile from backend
    const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${data.token}`
      },
      credentials: 'include'
    });

    let user = { phone, name: 'New User', email: '', avatar: '', role: 'customer', addresses: [] };
    if (profileRes.ok) {
      user = await profileRes.json();
    }

    saveToStorage('nexus_token', data.token);
    saveToStorage(USER_KEY, user);
    saveToStorage(AUTH_KEY, { isAuthenticated: true, phone });
    return { success: true, user };
  },

  logout() {
    removeFromStorage('nexus_token');
    removeFromStorage(AUTH_KEY);
    removeFromStorage(USER_KEY);
  },

  getAuthState() {
    return getFromStorage(AUTH_KEY, { isAuthenticated: false });
  },

  getUser() {
    return getFromStorage(USER_KEY, null);
  },

  getAuthHeader() {
    const token = getFromStorage('nexus_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async updateUser(updatedUser) {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email || '',
        avatar: updatedUser.avatar || ''
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Failed to update profile.');
    }

    const user = getFromStorage(USER_KEY, {});
    const newUser = { ...user, ...updatedUser };
    saveToStorage(USER_KEY, newUser);
    return newUser;
  },

  async addAddress(address) {
    const res = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({
        label: address.label,
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault || false
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Failed to add address.');
    }

    // Fetch the updated profile to get all addresses with their database IDs
    const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { ...this.getAuthHeader() },
      credentials: 'include'
    });
    if (profileRes.ok) {
      const newUser = await profileRes.json();
      saveToStorage(USER_KEY, newUser);
      return newUser;
    }

    return getFromStorage(USER_KEY, {});
  },

  async deleteAddress(addressId) {
    const res = await fetch(`${API_BASE_URL}/users/addresses/${addressId}`, {
      method: 'DELETE',
      headers: { ...this.getAuthHeader() },
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Failed to delete address.');
    }

    // Fetch updated profile
    const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { ...this.getAuthHeader() },
      credentials: 'include'
    });
    if (profileRes.ok) {
      const newUser = await profileRes.json();
      saveToStorage(USER_KEY, newUser);
      return newUser;
    }

    return getFromStorage(USER_KEY, {});
  },

  async checkSession() {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { ...this.getAuthHeader() },
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Session invalid');
    return await res.json();
  },
};
