'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Đọc user data từ cookie khi component mount
    const cookies = document.cookie.split(';');
    const userDataCookie = cookies.find(cookie => cookie.trim().startsWith('userData='));
    
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1].trim()));
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
      }
    }
  }, []);

  // Hàm clear user data
  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook để sử dụng auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
