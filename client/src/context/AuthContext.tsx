import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('humancheck_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    // Default logged-in demo user for immediate rich UX
    return {
      id: 'demo-user-123',
      name: 'Dr. Alex Morgan',
      email: 'alex.morgan@humancheck.ai',
      role: 'pro',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T10:00:00.000Z'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('humancheck_token') || 'demo-jwt-token-active';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('humancheck_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('humancheck_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('humancheck_token', token);
    } else {
      localStorage.removeItem('humancheck_token');
    }
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try backend API first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      // Backend not running, proceed with local demo fallback
    }

    // Local fallback
    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'User',
      email,
      role: 'pro',
      createdAt: new Date().toISOString()
    };
    setUser(fallbackUser);
    setToken('local-session-token');
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      // Fallback
    }

    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    setUser(fallbackUser);
    setToken('local-session-token');
    setIsLoading(false);
    return true;
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: 'demo-user-123',
      name: 'Dr. Alex Morgan',
      email: 'alex.morgan@humancheck.ai',
      role: 'pro',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T10:00:00.000Z'
    };
    setUser(demoUser);
    setToken('demo-jwt-token-active');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('humancheck_user');
    localStorage.removeItem('humancheck_token');
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
