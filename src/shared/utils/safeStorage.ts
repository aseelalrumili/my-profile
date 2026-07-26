export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      console.warn(`localStorage.getItem("${key}") failed`);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      console.warn(`localStorage.setItem("${key}") failed`);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      console.warn(`localStorage.removeItem("${key}") failed`);
      return false;
    }
  },
};
