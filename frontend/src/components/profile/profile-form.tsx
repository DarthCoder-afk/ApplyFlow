'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldError, type UseFormRegister } from 'react-hook-form';
import { BriefcaseBusiness, LoaderCircle, Save, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '@/lib/types/user';
import {
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validation/profile';
import { updateProfile } from '@/lib/api/profile';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

type ProfileFormProps = {
  profile: UserProfile;
  onUpdated: (profile: UserProfile) => void;
};

type FieldProps = {
  id: keyof ProfileFormValues;
  label: string;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  error?: FieldError;
  register: UseFormRegister<ProfileFormValues>;
  disabled: boolean;
};

function ProfileField({
  id,
  label,
  optional = false,
  placeholder,
  autoComplete,
  type,
  error,
  register,
  disabled,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#374151]">
        {label}
        {optional && <span className="font-normal text-[#6B7280]">(optional)</span>}
      </Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="h-11 rounded-xl border-[#E5E7EB] bg-white px-3.5 shadow-none focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
        {...register(id)}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-[#DC2626]">
          {error.message}
        </p>
      )}
    </div>
  );
}

function valuesFromProfile(profile: UserProfile): ProfileFormValues {
  return {
    firstName: profile.firstName,
    middleName: profile.middleName ?? '',
    lastName: profile.lastName,
    suffix: profile.suffix ?? '',
    headline: profile.headline ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    linkedinUrl: profile.linkedinUrl ?? '',
    githubUrl: profile.githubUrl ?? '',
    portfolioUrl: profile.portfolioUrl ?? '',
  };
}

export default function ProfileForm({ profile, onUpdated }: ProfileFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: valuesFromProfile(profile),
  });

  useEffect(() => {
    if (!isDirty) reset(valuesFromProfile(profile));
  }, [isDirty, profile, reset]);

  async function onSubmit(values: ProfileFormValues) {
    setSubmitError(null);
    setSaved(false);
    try {
      const updated = await updateProfile(values);
      reset(valuesFromProfile(updated));
      onUpdated(updated);
      setSaved(true);
      toast.success('Profile updated');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Your profile could not be updated. Please try again.';
      setSubmitError(message);
    }
  }

  const fieldProps = { register, disabled: isSubmitting };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-[#111827]">Personal Information</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Keep your contact details current.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <ProfileField
              id="firstName"
              label="First name"
              autoComplete="given-name"
              error={errors.firstName}
              {...fieldProps}
            />
            <ProfileField
              id="middleName"
              label="Middle name"
              optional
              autoComplete="additional-name"
              error={errors.middleName}
              {...fieldProps}
            />
            <ProfileField
              id="lastName"
              label="Last name"
              autoComplete="family-name"
              error={errors.lastName}
              {...fieldProps}
            />
            <ProfileField
              id="suffix"
              label="Suffix"
              optional
              placeholder="Jr., Sr., III"
              autoComplete="honorific-suffix"
              error={errors.suffix}
              {...fieldProps}
            />
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="profile-email" className="text-[#374151]">
              Email
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={profile.email}
              readOnly
              aria-describedby="profile-email-note"
              className="h-11 rounded-xl border-[#E5E7EB] bg-slate-50 px-3.5 text-[#6B7280] shadow-none"
            />
            <p id="profile-email-note" className="text-xs text-[#6B7280]">
              Email changes require verification and are not available here.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ProfileField
              id="phone"
              label="Phone"
              optional
              type="tel"
              autoComplete="tel"
              placeholder="+63 900 000 0000"
              error={errors.phone}
              {...fieldProps}
            />
            <ProfileField
              id="location"
              label="Location"
              optional
              autoComplete="address-level2"
              placeholder="City, Country"
              error={errors.location}
              {...fieldProps}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-[#111827]">Professional Information</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Add the links and context you share professionally.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <ProfileField
              id="headline"
              label="Professional headline"
              optional
              placeholder="Product designer focused on B2B SaaS"
              error={errors.headline}
              {...fieldProps}
            />
            <ProfileField
              id="linkedinUrl"
              label="LinkedIn URL"
              optional
              type="url"
              placeholder="https://linkedin.com/in/your-name"
              error={errors.linkedinUrl}
              {...fieldProps}
            />
            <ProfileField
              id="githubUrl"
              label="GitHub URL"
              optional
              type="url"
              placeholder="https://github.com/your-name"
              error={errors.githubUrl}
              {...fieldProps}
            />
            <ProfileField
              id="portfolioUrl"
              label="Portfolio URL"
              optional
              type="url"
              placeholder="https://yourportfolio.com"
              error={errors.portfolioUrl}
              {...fieldProps}
            />
          </div>
        </section>
      </div>

      {(submitError || saved) && (
        <p
          role={submitError ? 'alert' : 'status'}
          className={
            submitError
              ? 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]'
              : 'rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#16A34A]'
          }
        >
          {submitError ?? 'Your profile changes have been saved.'}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 flex border-t border-[#E5E7EB] bg-[#F8FAFC]/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="h-11 w-full rounded-xl bg-[#4F46E5] px-5 hover:bg-[#4338CA] sm:w-auto"
        >
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Save />}
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
