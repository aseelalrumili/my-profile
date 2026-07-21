import type { LoginResponse } from '../types';
import { API } from './client';

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const { data } = await API.post('/auth/login', { username, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const isAuthenticated = (): boolean => !!localStorage.getItem('token');
