'use server'

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAction(credentials: {
  username: string;
  password: string;
}) {
  try {
    // Gọi API đăng nhập từ server
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: credentials.username,
        password: credentials.password
      })
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return { error: loginData.message };
    }

    // Nếu đăng nhập thành công, lấy thông tin user
    if (loginData.id) {
      const userResponse = await fetch(`${API_URL}/users/${loginData.id}`);
      const userData = await userResponse.json();

      // Set cookies
      const cookieStore = cookies();
      
      // Set auth cookies
      cookieStore.set('accessToken', loginData.access_token, {
        httpOnly: true,
        secure: true
      });
      cookieStore.set('refreshToken', loginData.refresh_token, {
        httpOnly: true,
        secure: true
      });
      
      // Set user data cookie
      cookieStore.set('userData', JSON.stringify(userData), {
        httpOnly: false,
        secure: true,
        sameSite: 'strict'
      });

      return {
        success: true,
        user: userData,
        message: loginData.message
      };
    }

    return { error: 'Không thể lấy thông tin người dùng.' };
  } catch (error) {
    return { 
      error: 'Đã xảy ra lỗi server trong quá trình đăng nhập.'
    };
  }
}

export async function logoutAction() {
  try {
    // Gọi API logout từ server
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST'
    });

    const data = await response.json();

    // Xóa cookies
    const cookieStore = cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userData');

    return {
      success: true,
      message: data.message || 'Đăng xuất thành công.'
    };
  } catch (error) {
    return {
      error: 'Đã xảy ra lỗi khi đăng xuất.'
    };
  }
}
