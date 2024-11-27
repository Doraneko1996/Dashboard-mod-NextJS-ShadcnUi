import { api } from '../api/axios-config';
import { API_ENDPOINTS } from '../api/endpoints';
import { FilterParams, AdminResponse, UpdateStatusResponse } from './users.types';

export class UsersService {
  static async getAdmins(params: FilterParams): Promise<AdminResponse> {
    console.log('API call to getAdmins with params:', params);
    try {
      const response = await api.get(API_ENDPOINTS.ADMINS.BASE, { params });
      return response.data;
    } catch (error) {
      console.error('Get admins error:', error);
      throw error;
    }
  }

  static async updateStatus(userId: number, status: boolean): Promise<UpdateStatusResponse> {
    try {
      const response = await api.patch(API_ENDPOINTS.USERS.STATUS(userId), { status });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Update status error:', error);
      return {
        success: false,
        error: 'Đã xảy ra lỗi khi cập nhật trạng thái'
      };
    }
  }
}