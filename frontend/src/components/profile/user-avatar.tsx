import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatFullName, getUserInitials } from '@/lib/user-profile';
import type { UserProfile } from '@/lib/types/user';

type UserAvatarProps = {
  user: Pick<UserProfile, 'firstName' | 'lastName' | 'fullName' | 'avatarUrl'>;
  previewUrl?: string | null;
  className?: string;
  textClassName?: string;
  priority?: boolean;
};

export default function UserAvatar({
  user,
  previewUrl,
  className,
  textClassName,
  priority = false,
}: UserAvatarProps) {
  const source =
    typeof previewUrl === 'string' && previewUrl
      ? previewUrl
      : typeof user.avatarUrl === 'string'
        ? user.avatarUrl
        : null;
  const displayName =
    (typeof user.fullName === 'string' ? user.fullName.trim() : '') ||
    formatFullName(user) ||
    'User';

  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-600 font-semibold text-white',
        className
      )}
    >
      {source ? (
        <Image
          src={source}
          alt={`${displayName} profile photo`}
          fill
          sizes="128px"
          priority={priority}
          unoptimized={source.startsWith('blob:')}
          className="object-cover"
        />
      ) : (
        <span className={textClassName}>{getUserInitials(user)}</span>
      )}
    </span>
  );
}
