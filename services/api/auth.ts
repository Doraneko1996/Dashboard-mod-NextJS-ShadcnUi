import { LoginCredentials, AuthResponse, User } from '@/types/auth';
import { api } from './axios';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', {
        user_name: credentials.user_name,
        password: credentials.password
      });

      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập'
      };
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Đã xảy ra lỗi khi đăng xuất'
      };
    }
  },

  updateProfile: async (userId: number, data: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await api.put(`/users/${userId}`, data);
      return {
        success: true,
        user: response.data,
        message: 'Cập nhật thông tin thành công'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Đã xảy ra lỗi khi cập nhật thông tin'
      };
    }
  }
};