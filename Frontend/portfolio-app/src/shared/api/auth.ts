const VALID_USERNAME = 'asylalrmyly49';
const VALID_PASSWORD = 'Aseel.2006';

export const login = async (username: string, password: string) => {
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    const token = btoa(`${username}:${Date.now()}`);
    const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('tokenExpiry', expiration);
    return { token, username, expiration };
  }
  throw new Error('Invalid credentials');
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
