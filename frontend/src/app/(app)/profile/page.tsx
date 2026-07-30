'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  getProfile,
  removeProfileAvatar,
  uploadProfileAvatar,
} from '@/lib/api/profile';
import type { UserProfile } from '@/lib/types/user';
import AvatarManager from '@/src/components/profile/avatar-manager';
import ProfileForm from '@/src/components/profile/profile-form';
import ProfileSkeleton from '@/src/components/profile/profile-skeleton';
import { Button } from '@/src/components/ui/button';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  function syncProfile(profile: UserProfile) {
    queryClient.setQueryData(['profile'], profile);
    queryClient.setQueryData(['current-user'], profile);
  }

  const uploadMutation = useMutation({
    mutationFn: uploadProfileAvatar,
    onSuccess: (profile) => {
      syncProfile(profile);
      setAvatarError(null);
      toast.success('Profile photo updated');
    },
    onError: (error) => {
      setAvatarError(
        error instanceof Error
          ? error.message
          : 'The image could not be uploaded. Please try again.'
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeProfileAvatar,
    onSuccess: (profile) => {
      syncProfile(profile);
      setAvatarError(null);
      toast.success('Profile photo removed');
    },
    onError: (error) => {
      setAvatarError(
        error instanceof Error
          ? error.message
          : 'The profile photo could not be removed. Please try again.'
      );
    },
  });

  if (profileQuery.isLoading) return <ProfileSkeleton />;

  if (profileQuery.error || !profileQuery.data) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-[#DC2626]">
          <AlertCircle className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-[#111827]">Could not load your profile</h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          Check your connection and try again.
        </p>
        <Button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="mt-5 rounded-xl bg-[#4F46E5] px-4 hover:bg-[#4338CA]"
        >
          <RefreshCw />
          Try again
        </Button>
      </div>
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#111827]">Profile</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Manage your personal and professional information.
        </p>
      </div>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
        <AvatarManager
          profile={profile}
          uploading={uploadMutation.isPending}
          removing={removeMutation.isPending}
          error={avatarError}
          onError={setAvatarError}
          onUpload={async (file) => {
            await uploadMutation.mutateAsync(file);
          }}
          onRemove={async () => {
            await removeMutation.mutateAsync();
          }}
        />
      </section>

      <ProfileForm profile={profile} onUpdated={syncProfile} />
    </div>
  );
}
