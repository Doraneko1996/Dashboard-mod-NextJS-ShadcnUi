import { useAuth } from '@/contexts/auth-context';

export function useAuthentication() {
  const { user } = useAuth();
  return { user };
}