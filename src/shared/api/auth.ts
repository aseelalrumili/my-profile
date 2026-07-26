import axios from 'axios';
import { safeStorage } from '../utils/safeStorage';

export const login = async (email: string, password: string) => {
  const { data } = await axios.post('/api/auth/login', { email, password });
  safeStorage.setItem('token', data.token);
  safeStorage.setItem('email', data.email);
  safeStorage.setItem('tokenExpiry', data.expiration);
  return data;
};

export const logout = async () => {
  safeStorage.removeItem('token');
  safeStorage.removeItem('email');
  safeStorage.removeItem('tokenExpiry');
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = safeStorage.getItem('token');
  const expiry = safeStorage.getItem('tokenExpiry');
  if (!token) return false;
  if (expiry && new Date(expiry) < new Date()) {
    safeStorage.removeItem('token');
    safeStorage.removeItem('email');
    safeStorage.removeItem('tokenExpiry');
    return false;
  }
  return true;
};
