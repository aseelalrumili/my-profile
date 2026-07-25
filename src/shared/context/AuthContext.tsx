import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { logout as apiLogout } from '../../api/api';

interface AuthContextType {
  isAdmin: boolean;
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  token: null,
  email: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
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
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));

  const login = useCallback((t: string, e: string) => {
    setToken(t);
    setEmail(e);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setEmail(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
