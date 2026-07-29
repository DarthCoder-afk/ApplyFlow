'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { login, setAccessToken } from '@/lib/api/auth';
import { loginSchema, type LoginFormValues } from '@/lib/validation/auth';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setError(null);

    try {
      const data = await login(values);

      setAccessToken(data.accessToken);

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div data-auth="field" className="space-y-2">
        <Label htmlFor="email" className="font-medium text-slate-800">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
          {...register('email')}
        />
        {errors.email && <p id="email-error" role="alert" className="text-sm text-red-700">{errors.email.message}</p>}
      </div>

      <div data-auth="field" className="space-y-2">
        <div className="relative">
          <Label htmlFor="password" className="mb-2 font-medium text-slate-800">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 pr-12 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('password')}
          />
          {errors.password && <p id="password-error" role="alert" className="mt-2 text-sm text-red-700">{errors.password.message}</p>}

          <Button
            type="button"
            variant='ghost'
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-1 top-7 h-10 w-10 rounded-lg text-slate-500 hover:bg-transparent hover:text-[#6657d9]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
          {error}
        </p>
      )}

      <Button data-auth="action"
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-[#1d1c25] text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#302d41]"
      >
        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
