/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => authService.getAuthState());
  const [user, setUser] = useState(() => authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On mount, perform a silent validation of user session with backend
  useEffect(() => {
    const validateSession = async () => {
      const initialAuth = authService.getAuthState();
      if (initialAuth.isAuthenticated) {
        try {
          const profile = await authService.checkSession();
          setUser(profile);
        } catch (err) {
          console.warn('Backend session invalid, logging out:', err);
          authService.logout();
          setAuthState({ isAuthenticated: false });
          setUser(null);
        }
      }
    };
    validateSession();
  }, []);

  const sendOTP = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.sendOTP(phone);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.verifyOTP(phone, otp);
      setAuthState({ isAuthenticated: true, phone });
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({ isAuthenticated: false });
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updatedData) => {
    setLoading(true);
    try {
      const updated = await authService.updateUser(updatedData);
      setUser(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (address) => {
    setLoading(true);
    try {
      const updated = await authService.addAddress(address);
      setUser(updated);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    setLoading(true);
    try {
      const updated = await authService.deleteAddress(addressId);
      setUser(updated);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated: authState.isAuthenticated,
    user,
    loading,
    error,
    sendOTP,
    verifyOTP,
    logout,
    updateUser,
    addAddress,
    deleteAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
