'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { LoginCredentials } from '@/services/auth/auth.types';
import { loginAction } from '@/services/auth';
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

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      const credentials: LoginCredentials = {
        user_name: values.username,
        password: values.password
      };

      const result = await loginAction(credentials);
  
      if (result.error) {
        toast.error('Đăng nhập thất bại', {
          description: result.error
        });
        form.reset();
        return;
      }
  
      if (result.success && result.user) {
        sessionStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        router.push('/dashboard/home');
        toast.success('Đăng nhập thành công', {
          description: `Chào mừng ${result.user.first_name} ${result.user.last_name}`
        });
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại', {
        description: 'Đã xảy ra lỗi không mong muốn'
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isLoading}
                      placeholder="Nhập tên tài khoản" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="password"
                      disabled={isLoading}
                      placeholder="Nhập mật khẩu"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              Đăng nhập
            </Button>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <Link href="/forgot-password">
                Quên mật khẩu?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}