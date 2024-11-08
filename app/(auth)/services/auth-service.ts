'use server'

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAction(credentials: {
  username: string;
  password: string;
}) {
  try {
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        user_name: credentials.username,
        password: credentials.password
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return { error: loginData.message };
    }

    cookies().set('accessToken', loginData.access_token, {
      httpOnly: true,
      secure: true
    });
    cookies().set('refreshToken', loginData.refresh_token, {
      httpOnly: true,
      secure: true
    });

    return {
      success: true,
      user: loginData.user,
      message: loginData.message
    };

  } catch (error: any) {
    console.error('Error in loginAction:', error);
    return { 
      error: 'Đã xảy ra lỗi server trong quá trình đăng nhập.'
    };
  }
}

export async function logoutAction() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Đăng xuất thất bại');
    }

    cookies().delete('accessToken');
    cookies().delete('refreshToken');

    return { success: true };
  } catch (error) {
    return { error: 'Đã xảy ra lỗi khi đăng xuất.' };
  }
}