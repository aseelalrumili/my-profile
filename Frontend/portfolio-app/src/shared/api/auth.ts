import axios from 'axios';

export const login = async (username: string, password: string) => {
  const { data } = await axios.post('/api/auth/login', { username, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  localStorage.setItem('tokenExpiry', data.expiration);
  return data;
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('tokenExpiry');
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('tokenExpiry');
  if (!token) return false;
  if (expiry && new Date(expiry) < new Date()) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tokenExpiry');
    return false;
  }
  return true;
};
