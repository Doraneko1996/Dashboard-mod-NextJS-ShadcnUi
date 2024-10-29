'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

// Schema validation cho form đăng nhập
const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Tên tài khoản không được để trống' })
    .min(4, { message: 'Tên tài khoản phải có ít nhất 4 ký tự' })
    .max(20, { message: 'Tên tài khoản không được quá 20 ký tự' }),
  password: z
    .string()
    .min(1, { message: 'Mật khẩu không được để trống' })
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
});

// Type cho form values
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  // Khởi tạo form với react-hook-form và zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Xử lý submit form
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      // Gọi server action đăng nhập
      const result = await loginAction({
        username: values.username,
        password: values.password
      });

      if (result.error) {
        toast.error('Đăng nhập thất bại', {
          description: result.error
        });
        form.reset();
        return;
      }

      if (result.success) {
        // Lưu user vào context
        setUser(result.user);
        
        router.push('/dashboard');
        toast.success('Đăng nhập thành công', {
          description: `Chào mừng ${result.user.first_name} ${result.user.last_name}`
        });
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại', {
        description: 'Đã xảy ra lỗi không mong muốn'
      });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-[320px] md:max-w-[400px] w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          Đăng nhập
        </CardTitle>
        <span className="flex items-center justify-center text-sm text-muted-foreground">
          Đăng nhập bằng tài khoản GEMS của bạn
        </span>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {/* Field tài khoản */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tài khoản</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tên tài khoản của bạn"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field mật khẩu */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mật khẩu đăng nhập"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <div className="w-full">
              {/* Nút đăng nhập */}
              <Button
                className="w-full dark:text-white bg-red-900 hover:bg-red-950"
                type="submit"
                disabled={isLoading}
              >
                Đăng nhập
              </Button>

              <Separator className="my-4" />

              {/* Link quên mật khẩu */}
              <div className="w-full text-center">
                <Link href="/reset-pw" className="hover:underline">
                  Bạn quên mật khẩu?
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
