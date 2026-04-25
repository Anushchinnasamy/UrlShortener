import React from 'react';
import { clearToken, getToken, setToken } from '../services/storage.js';
import * as authService from '../services/authService.js';

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = React.useState(() => getToken());
  const isAuthed = Boolean(token);

  const logout = React.useCallback(() => {
    clearToken();
    setTokenState('');
  }, []);

  const login = React.useCallback(async ({ usernameOrEmail, password }) => {
    const data = await authService.login({ usernameOrEmail, password });
    setToken(data?.token || '');
    setTokenState(data?.token || '');
    return data;
  }, []);

  const register = React.useCallback(async ({ username, email, password }) => {
    const data = await authService.register({ username, email, password });
    return data;
  }, []);

  const value = React.useMemo(
    () => ({ token, isAuthed, login, register, logout }),
    [token, isAuthed, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

