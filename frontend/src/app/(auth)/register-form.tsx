'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { register as registerUser, setAccessToken } from '@/lib/api/auth';
import { registerSchema, type RegisterFormValues } from '@/lib/validation/auth';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);

    try {
      const data = await registerUser(values);

      setAccessToken(data.accessToken);

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-medium text-slate-700">
          Name
        </Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={!!errors.name}
          className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-slate-400"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium text-slate-700">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-slate-400"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className='relative'>
          <Label htmlFor="password" className="font-medium text-slate-700 mb-2">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-slate-400"
            {...register('password')}
          />
          <Button
            type='button'
            variant='ghost'
            onClick={() => setShowPassword((previous) => !previous)}
            className='absolute right-1 bottom-1 text-slate-500 hover:bg-transparent hover:text-slate-900'
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4'/>
            ) : (
              <Eye className='h-4 w-4'/>
            )}
          </Button>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className='relative'>
          <Label htmlFor="confirmPassword" className="font-medium text-slate-700 mb-2">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-slate-400"
            {...register('confirmPassword')}
          />
          <Button
            type='button'
            variant='ghost'
            onClick={() => setShowConfirmPassword((previous) => !previous)}
            className='absolute right-1 bottom-1 text-slate-500 hover:bg-transparent hover:text-slate-900'
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? (
              <EyeOff className='h-4 w-4'/>
            ) : (
              <Eye className='h-4 w-4'/>
            )}
          </Button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
