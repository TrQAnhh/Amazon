import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { AuthService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, middleName: string, lastName: string) => Promise<void>;
  signout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = AuthService.getInstance();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          clearAuthData();
        }
      } else if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);
          handleAuthSuccess(response);
        } catch (error) {
          console.error('Token refresh failed:', error);
          clearAuthData();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);
          localStorage.setItem('accessToken', response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
        } catch (error) {
          console.error('Auto token refresh failed:', error);
          await signout();
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleAuthSuccess = (response: AuthResponse) => {
    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const signin = async (email: string, password: string) => {
    const response = await authService.signin(email, password);

    if (!response.success) {
      throw new Error(response.message);
    }

    handleAuthSuccess(response);
  };

  const signup = async (email: string, password: string, firstName: string, middleName: string, lastName: string) => {
    const response = await authService.signup(email, password, firstName, middleName, lastName);

    if (!response.success) {
      throw new Error(response.message);
    }

    handleAuthSuccess(response);
  };

  const signout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      await authService.signout(accessToken);
    }
    clearAuthData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signin,
        signup,
        signout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};