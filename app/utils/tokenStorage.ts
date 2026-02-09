const TOKEN_KEY = 'rainlogger_session';

export const tokenStorage = {
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  hasToken: (): boolean => {
    return localStorage.getItem(TOKEN_KEY) !== null;
  }
};
