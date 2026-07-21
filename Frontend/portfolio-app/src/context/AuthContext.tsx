import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { isAuthenticated as checkAuth, logout as apiLogout } from '../api/api';

interface AuthContextType {
  isAdmin: boolean;
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  token: null,
  username: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(checkAuth());
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const login = useCallback((t: string, u: string) => {
    setToken(t);
    setUsername(u);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUsername(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
