import { apiFetch } from './client';
import type { UserProfile } from '@/lib/types/user';
import type { ProfileFormValues } from '@/lib/validation/profile';
import { normalizeUserProfile, type UserProfilePayload } from '@/lib/user-profile';

type ProfileResponse = {
  success: boolean;
  message?: string;
  profile: UserProfilePayload;
};

function optionalValue(value: string): string | null {
  return value.trim() || null;
}

export async function getProfile(): Promise<UserProfile> {
  const data = await apiFetch<ProfileResponse>('/api/profile');
  return normalizeUserProfile(data.profile);
}

export async function updateProfile(values: ProfileFormValues): Promise<UserProfile> {
  const data = await apiFetch<ProfileResponse>('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify({
      firstName: values.firstName.trim(),
      middleName: optionalValue(values.middleName),
      lastName: values.lastName.trim(),
      suffix: optionalValue(values.suffix),
      headline: optionalValue(values.headline),
      phone: optionalValue(values.phone),
      location: optionalValue(values.location),
      linkedinUrl: optionalValue(values.linkedinUrl),
      githubUrl: optionalValue(values.githubUrl),
      portfolioUrl: optionalValue(values.portfolioUrl),
    }),
  });
  return normalizeUserProfile(data.profile);
}

export async function uploadProfileAvatar(file: File): Promise<UserProfile> {
  const body = new FormData();
  body.append('avatar', file);
  const data = await apiFetch<ProfileResponse>('/api/profile/avatar', {
    method: 'POST',
    body,
  });
  return normalizeUserProfile(data.profile);
}

export async function removeProfileAvatar(): Promise<UserProfile> {
  const data = await apiFetch<ProfileResponse>('/api/profile/avatar', {
    method: 'DELETE',
  });
  return normalizeUserProfile(data.profile);
}
