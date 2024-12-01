'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { handleLogout } from '@/app/(auth)/actions';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Vui lòng nhập mật khẩu hiện tại')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    newPassword: z.string()
        .min(1, 'Vui lòng nhập mật khẩu mới')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string()
        .min(1, 'Vui lòng xác nhận mật khẩu mới')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
    path: ["newPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountChangePw() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (values: FormValues) => {
        try {
            setIsLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.access_token}`
                },
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đổi mật khẩu thất bại');
            }

            // Hiển thị toast thành công trước khi logout
            toast.success('Đổi mật khẩu thành công', {
                description: 'Đang đăng xuất...'
            });

            handleLogout('password_changed');
        } catch (error: any) {
            toast.error('Đổi mật khẩu thất bại', {
                description: error.message
            });
            form.reset();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu hiện tại</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Nhập mật khẩu hiện tại"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Nhập mật khẩu mới"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Nhập lại mật khẩu mới"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
            </form>
        </Form>
    );
}