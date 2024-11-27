import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api/axios-config';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export function useAuthentication() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Kiểm tra session storage trước
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser && isMounted) {
          setUser(JSON.parse(sessionUser));
          setIsLoading(false);
          return;
        }

        // Gọi API kiểm tra
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        
        if (response.data.success && isMounted) {
          const userData = response.data.user;
          sessionStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (err) {
        if (isMounted) {
          sessionStorage.removeItem('user');
          setUser(null);
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  // Hàm logout
  const logout = useCallback(async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      sessionStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [setUser]);

  return { user, isLoading, error, logout };
}