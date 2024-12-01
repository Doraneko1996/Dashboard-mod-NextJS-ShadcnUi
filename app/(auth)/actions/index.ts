'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { z } from 'zod';

const loginSchema = z.object({
    username: z
        .string()
        .min(1, 'Tên tài khoản không được để trống')
        .min(4, 'Tên tài khoản phải có ít nhất 4 ký tự')
        .max(20, 'Tên tài khoản không được quá 20 ký tự'),
    password: z
        .string()
        .min(1, 'Mật khẩu không được để trống')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

type AuthState = {
    status: 'error' | 'success';
    message: string;
} | undefined;

export async function authenticate(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    try {
        // Validate form data
        const validatedFields = loginSchema.safeParse({
            username: formData.get('username'),
            password: formData.get('password')
        });

        if (!validatedFields.success) {
            return {
                status: 'error',
                message: validatedFields.error.errors[0].message
            };
        }

        // Attempt to sign in
        await signIn('credentials', {
            username: validatedFields.data.username,
            password: validatedFields.data.password,
            redirect: false
        });

        return {
            status: 'success',
            message: 'Đăng nhập thành công!'
        };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        status: 'error',
                        message: 'Tên tài khoản hoặc mật khẩu không đúng!'
                    };
                case 'AccessDenied':
                    return {
                        status: 'error',
                        message: 'Tài khoản đang bị khóa!'
                    };
                default:
                    return {
                        status: 'error',
                        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.'
                    };
            }
        }
        throw error;
    }
}

export async function handleLogout(reason: 'success' | 'password_changed' = 'success') {
    return signOut({
        redirect: true,
        redirectTo: `/?logout=${reason}`
    });
}