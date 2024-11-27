import { Admin } from '@/types/admin';
import { User } from '../auth/auth.types';

export interface FilterParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
  status?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateStatusResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AdminResponse {
  data: Admin[];
  total: number;
  page: number;
  limit: number;
}
