import { api } from '../api/axios-config';
import { API_ENDPOINTS } from '../api/endpoints';
import { UpdateProfileData, AuthResponse } from './auth.types';

export class AuthService {
  static async updateProfile(userId: number, data: UpdateProfileData): Promise<AuthResponse> {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.PROFILE(userId), data);
      return {
        success: true,
        user: response.data,
        message: 'Cập nhật thông tin thành công'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Đã xảy ra lỗi khi cập nhật thông tin'
      };
    }
  }

  // Các phương thức client khác...
}