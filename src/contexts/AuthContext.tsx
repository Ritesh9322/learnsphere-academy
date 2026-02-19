import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  'admin@lmsacademy.com': {
    id: 'admin1', name: 'Arjun Mehta', email: 'admin@lmsacademy.com', role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    phone: '+91 98765 43210', isVerified: true, createdAt: '2023-06-01'
  },
  'teacher@lmsacademy.com': {
    id: 'teacher1', name: 'Dr. Priya Sharma', email: 'teacher@lmsacademy.com', role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    phone: '+91 98765 12345', isVerified: true, createdAt: '2023-07-15'
  },
  'student@lmsacademy.com': {
    id: 'student1', name: 'Rahul Verma', email: 'student@lmsacademy.com', role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    phone: '+91 98765 67890', isVerified: true, createdAt: '2024-01-10'
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('lms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string) => {
    const foundUser = mockUsers[email.toLowerCase()];
    if (!foundUser) throw new Error('Invalid email or password');
    setUser(foundUser);
    localStorage.setItem('lms_user', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const register = async (name: string, email: string, _password: string) => {
    const newUser: User = {
      id: `student_${Date.now()}`, name, email, role: 'student',
      isVerified: false, createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('lms_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
