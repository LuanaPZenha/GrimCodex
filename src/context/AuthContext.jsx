import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/resources';
import { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function extractToken(data) {
  return data?.token || data?.accessToken || data?.jwt || null;
}

function extractUser(data) {
  return data?.user || data?.usuario || data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await authService.login({ username, login: username, password });
    const newToken = extractToken(data);
    const newUser = extractUser(data);

    if (!newToken) {
      throw new Error('Token JWT não retornado pela API.');
    }

    persistSession(newToken, newUser);
    return newUser;
  }, [persistSession]);

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    const newToken = extractToken(data);
    const newUser = extractUser(data);

    if (!newToken) {
      throw new Error('Token JWT não retornado pela API.');
    }

    persistSession(newToken, newUser);
    return newUser;
  }, [persistSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.me();
        setUser(extractUser(profile));
      } catch (error) {
        console.warn('Sessão inválida:', getErrorMessage(error));
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token, clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
