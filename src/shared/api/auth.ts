import axios from 'axios';

export const login = async (email: string, password: string) => {
  const { data } = await axios.post('/api/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  localStorage.setItem('tokenExpiry', data.expiration);
  return data;
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('tokenExpiry');
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('tokenExpiry');
  if (!token) return false;
  if (expiry && new Date(expiry) < new Date()) {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('tokenExpiry');
    return false;
  }
  return true;
};
