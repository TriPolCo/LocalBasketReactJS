const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const USER_KEY = "admin_user";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setAuthSession: ({ tokens, user }) => {
    if (tokens?.access) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
    if (tokens?.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearAuthSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};