import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { mockLogin, mockRegister } from '../services/authService';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  const login = async (credentials) => {
    setError('');
    try {
      const result = await mockLogin(credentials);
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('accessToken', result.accessToken);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const register = async (userData) => {
    setError('');
    try {
      await mockRegister(userData);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}