'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, RotateCcw, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types/user';
import { Button } from '@/src/components/ui/button';
import UserAvatar from './user-avatar';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type AvatarManagerProps = {
  profile: UserProfile;
  uploading: boolean;
  removing: boolean;
  error: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  onError: (message: string | null) => void;
};

export default function AvatarManager({
  profile,
  uploading,
  removing,
  error,
  onUpload,
  onRemove,
  onError,
}: AvatarManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const busy = uploading || removing;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function clearPreview() {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function upload(file: File) {
    try {
      await onUpload(file);
      clearPreview();
    } catch {
      // The parent exposes a safe, user-facing error and the local preview is
      // intentionally kept so the same file can be retried.
    }
  }

  async function handleFile(file?: File) {
    onError(null);
    if (!file || busy) return;

    if (file.size > MAX_AVATAR_SIZE) {
      onError('The image must be 5 MB or smaller.');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      onError('Only JPEG, PNG, and WebP images are supported.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setPendingFile(file);
    await upload(file);
  }

  async function handleRemove() {
    onError(null);
    clearPreview();
    try {
      await onRemove();
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <UserAvatar
          user={profile}
          previewUrl={previewUrl}
          className="h-24 w-24 ring-4 ring-indigo-50 sm:h-28 sm:w-28"
          textClassName="text-2xl"
          priority
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold text-[#111827]">{profile.fullName}</h2>
          <p className="mt-1 text-sm text-[#374151]">
            {profile.headline || 'Add a professional headline'}
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">
            {profile.location || 'Add your location'}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <input
              ref={inputRef}
              type="file"
              name="avatar"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={busy}
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="h-10 rounded-xl bg-[#4F46E5] px-4 hover:bg-[#4338CA]"
            >
              {uploading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ImagePlus />
              )}
              {uploading ? 'Uploading…' : 'Change photo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleRemove()}
              disabled={busy || (!profile.avatarUrl && !previewUrl)}
              className="h-10 rounded-xl border-[#E5E7EB] px-4 text-[#374151]"
            >
              {removing ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
              {removing ? 'Removing…' : 'Remove photo'}
            </Button>
            {error && pendingFile && !uploading && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => void upload(pendingFile)}
                className="h-10 rounded-xl px-3 text-[#4F46E5]"
              >
                <RotateCcw />
                Retry
              </Button>
            )}
          </div>
          <p className="mt-3 text-xs text-[#6B7280]">JPEG, PNG, or WebP. Maximum 5 MB.</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </p>
      )}
    </div>
  );
}
