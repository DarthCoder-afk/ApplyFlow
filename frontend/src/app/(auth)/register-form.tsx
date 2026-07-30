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
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';

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
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div data-auth="field" className="space-y-2">
          <Label htmlFor="firstName" className="font-medium text-slate-800">
            First name
          </Label>
          <Input
            id="firstName"
            required
            autoComplete="given-name"
            placeholder="First name"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'first-name-error' : undefined}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('firstName')}
          />
          {errors.firstName && <p id="first-name-error" role="alert" className="text-sm text-red-700">{errors.firstName.message}</p>}
        </div>

        <div data-auth="field" className="space-y-2">
          <Label htmlFor="middleName" className="font-medium text-slate-800">
            Middle name <span className="font-normal text-slate-400">(optional)</span>
          </Label>
          <Input
            id="middleName"
            autoComplete="additional-name"
            placeholder="Middle name"
            aria-invalid={!!errors.middleName}
            aria-describedby={errors.middleName ? 'middle-name-error' : undefined}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('middleName')}
          />
          {errors.middleName && <p id="middle-name-error" role="alert" className="text-sm text-red-700">{errors.middleName.message}</p>}
        </div>

        <div data-auth="field" className="space-y-2">
          <Label htmlFor="lastName" className="font-medium text-slate-800">
            Last name
          </Label>
          <Input
            id="lastName"
            required
            autoComplete="family-name"
            placeholder="Last name"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'last-name-error' : undefined}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('lastName')}
          />
          {errors.lastName && <p id="last-name-error" role="alert" className="text-sm text-red-700">{errors.lastName.message}</p>}
        </div>

        <div data-auth="field" className="space-y-2">
          <Label htmlFor="suffix" className="font-medium text-slate-800">
            Suffix <span className="font-normal text-slate-400">(optional)</span>
          </Label>
          <Input
            id="suffix"
            autoComplete="honorific-suffix"
            placeholder="Jr., Sr., III"
            aria-invalid={!!errors.suffix}
            aria-describedby={errors.suffix ? 'suffix-error' : undefined}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('suffix')}
          />
          {errors.suffix && <p id="suffix-error" role="alert" className="text-sm text-red-700">{errors.suffix.message}</p>}
        </div>
      </div>

      <div data-auth="field" className="space-y-2">
        <Label htmlFor="email" className="font-medium text-slate-800">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          required
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
            required
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : 'password-guidance'}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 pr-12 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('password')}
          />
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
          {errors.password ? <p id="password-error" role="alert" className="mt-2 text-sm text-red-700">{errors.password.message}</p> : <p id="password-guidance" className="mt-2 text-xs text-slate-500">Use at least 8 characters.</p>}
        </div>
      </div>

      <div data-auth="field" className="space-y-2">
        <div className="relative">
          <Label htmlFor="confirmPassword" className="mb-2 font-medium text-slate-800">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            className="h-12 rounded-xl border-slate-200 bg-[#fbfbfa] px-3.5 pr-12 shadow-none placeholder:text-slate-400 focus-visible:border-[#6657d9] focus-visible:bg-white focus-visible:ring-[#6657d9]/20"
            {...register('confirmPassword')}
          />
          <Button
            type="button"
            variant='ghost'
            onClick={() => setShowConfirmPassword((previous) => !previous)}
            className="absolute right-1 top-7 h-10 w-10 rounded-lg text-slate-500 hover:bg-transparent hover:text-[#6657d9]"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          {errors.confirmPassword && (
            <p id="confirm-password-error" role="alert" className="mt-2 text-sm text-red-700">{errors.confirmPassword.message}</p>
          )}
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
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
