import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrirent_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('agrirent_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const data = response.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      city: data.city,
    };
    localStorage.setItem('agrirent_token', data.token);
    localStorage.setItem('agrirent_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (registerData) => {
    const response = await api.post('/api/auth/register', registerData);
    const data = response.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      city: data.city,
    };
    localStorage.setItem('agrirent_token', data.token);
    localStorage.setItem('agrirent_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('agrirent_token');
    localStorage.removeItem('agrirent_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('agrirent_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const isAuthenticated = !!user && !!token;
  const isFarmer = user?.role === 'ROLE_FARMER';
  const isOwner = user?.role === 'ROLE_OWNER' || user?.role === 'ROLE_ADMIN';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        isFarmer,
        isOwner,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
