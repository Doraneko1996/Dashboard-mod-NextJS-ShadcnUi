'use server'

import { cookies } from 'next/headers';
import { LoginCredentials, AuthResponse } from './auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAction(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        user_name: credentials.user_name,
        password: credentials.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message };
    }

    cookies().set('accessToken', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    cookies().set('refreshToken', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return {
      success: true,
      user: data.user,
      message: data.message
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: 'Đã xảy ra lỗi server trong quá trình đăng nhập.'
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
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