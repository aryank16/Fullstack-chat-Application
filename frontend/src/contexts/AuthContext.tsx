import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, SignupData, User } from '../types/index.ts';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user storage (persistent in localStorage)
const getMockUsers = (): Array<User & { password: string }> => {
  try {
    const stored = localStorage.getItem('mock_users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading mock users:', error);
    return [];
  }
};

const saveMockUsers = (users: Array<User & { password: string }>) => {
  try {
    localStorage.setItem('mock_users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving mock users:', error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const mockUsers = getMockUsers();
      
      // Check if user already exists
      const existingUser = mockUsers.find(user => user.email === data.email);
      if (existingUser) {
        setIsLoading(false);
        return false; // User already exists
      }
      
      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      
      // Add to persistent storage
      const updatedUsers = [...mockUsers, newUser];
      saveMockUsers(updatedUsers);
      
      // Auto-login after signup
      const { password, ...userWithoutPassword } = newUser;
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setAuthState({
        isAuthenticated: true,
        user: userWithoutPassword,
        token: mockToken,
      });
      
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const mockUsers = getMockUsers();
      
      // Find user in persistent storage
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        setAuthState({
          isAuthenticated: true,
          user: userWithoutPassword,
          token: mockToken,
        });
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
        
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
