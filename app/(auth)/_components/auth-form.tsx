'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authenticate } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const LoginHeader = () => (
  <CardHeader>
    <CardTitle className="text-2xl font-semibold text-center">
      Đăng nhập
    </CardTitle>
    <CardDescription className="text-center text-sm text-muted-foreground">
      Đăng nhập bằng tài khoản GEMS của bạn
    </CardDescription>
  </CardHeader>
);

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full dark:text-white bg-red-900 hover:bg-red-950"
      type="submit"
      disabled={pending}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </Button>
  );
};

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [state, dispatch] = useFormState(authenticate, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === 'success') {
      window.location.href = callbackUrl || '/dashboard/home';
    } else if (state?.status === 'error') {
      toast.error('Đăng nhập thất bại', {
        description: state.message
      });
      formRef.current?.reset();
    }
  }, [state, callbackUrl]);

  return (
    <Card className="max-w-[400px] w-full">
      <LoginHeader />

      <form ref={formRef} action={dispatch} className="space-y-4">
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tên tài khoản</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Tên tài khoản của bạn"
                autoComplete="username"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Mật khẩu đăng nhập"
                required
              />
            </div>
            <SubmitButton />

            <Separator />

            <div className="w-full text-center">
              <Link
                href="/reset-pw"
                className="text-sm hover:underline text-muted-foreground"
              >
                Bạn quên mật khẩu?
              </Link>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default LoginForm;