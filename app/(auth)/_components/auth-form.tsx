'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

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
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();
  const { data: session, update } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true)
  
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Đăng nhập thất bại', {
          description: result.error
        });
        form.reset();
        return;
      }

      if (result?.ok) {
        await update();

        toast.success('Đăng nhập thành công');
        // router.push('/dashboard/home');
        window.location.href = '/dashboard/home';
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại', {
        description: 'Đã xảy ra lỗi không mong muốn'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-[400px] w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          Đăng nhập
        </CardTitle>
        <CardDescription className="flex items-center justify-center text-sm text-muted-foreground">
          Đăng nhập bằng tài khoản GEMS của bạn
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập, vui lòng chờ...
                  </>
                ) : (
                  'Đăng nhập'
                )}
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