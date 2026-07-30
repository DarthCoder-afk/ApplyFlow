import type { UserProfile } from '@/lib/types/user';

export type UserName = {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  suffix?: string | null;
};

export function formatFullName(user: UserName): string {
  const name = [user.firstName, user.middleName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
  const suffix = user.suffix?.trim();

  return suffix ? `${name}, ${suffix}` : name;
}

export function getUserInitials(
  user: Pick<UserName, 'firstName' | 'lastName'> & {
    fullName?: string | null;
    email?: string | null;
  }
): string {
  const firstName = user.firstName?.trim() ?? '';
  const lastName = user.lastName?.trim() ?? '';

  if (firstName || lastName) {
    return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  }

  const fullNameParts = (user.fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (fullNameParts.length > 0) {
    return `${fullNameParts[0]?.[0] ?? ''}${
      fullNameParts.length > 1 ? (fullNameParts.at(-1)?.[0] ?? '') : ''
    }`.toUpperCase();
  }

  return user.email?.trim()[0]?.toUpperCase() ?? 'U';
}

export type UserProfilePayload = Partial<UserProfile> & {
  id?: string;
  email?: string;
  name?: string | null;
};

function optionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function normalizeUserProfile(user: UserProfilePayload): UserProfile {
  const legacyName = optionalString(user.name);
  const legacyParts = legacyName?.split(/\s+/).filter(Boolean) ?? [];
  const legacyFirstName = legacyParts[0] ?? '';
  const legacyLastName = legacyParts.length > 1 ? (legacyParts.at(-1) ?? '') : '';
  const legacyMiddleName =
    legacyParts.length > 2 ? legacyParts.slice(1, -1).join(' ') : null;

  const firstName = optionalString(user.firstName) ?? legacyFirstName;
  const middleName = optionalString(user.middleName) ?? legacyMiddleName;
  const lastName = optionalString(user.lastName) ?? legacyLastName;
  const suffix = optionalString(user.suffix);
  const email = optionalString(user.email) ?? '';
  const formattedName = formatFullName({ firstName, middleName, lastName, suffix });
  const fullName =
    optionalString(user.fullName) ?? (formattedName || legacyName || email);

  return {
    id: optionalString(user.id) ?? '',
    email,
    firstName,
    middleName,
    lastName,
    suffix,
    fullName,
    headline: optionalString(user.headline),
    phone: optionalString(user.phone),
    location: optionalString(user.location),
    avatarUrl: optionalString(user.avatarUrl),
    linkedinUrl: optionalString(user.linkedinUrl),
    githubUrl: optionalString(user.githubUrl),
    portfolioUrl: optionalString(user.portfolioUrl),
    ...(optionalString(user.createdAt) ? { createdAt: user.createdAt } : {}),
    ...(optionalString(user.updatedAt) ? { updatedAt: user.updatedAt } : {}),
  };
}
