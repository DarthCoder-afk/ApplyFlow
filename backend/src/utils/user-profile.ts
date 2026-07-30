export type UserName = {
  firstName: string;
  middleName?: string | null;
  lastName: string;
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

export function getUserInitials(user: Pick<UserName, 'firstName' | 'lastName'>): string {
  return `${user.firstName.trim()[0] ?? ''}${user.lastName.trim()[0] ?? ''}`.toUpperCase();
}

export function presentUser<
  T extends UserName & {
    id: string;
    email: string;
    headline?: string | null;
    phone?: string | null;
    location?: string | null;
    avatarUrl?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  },
>(user: T) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName ?? null,
    lastName: user.lastName,
    suffix: user.suffix ?? null,
    fullName: formatFullName(user),
    headline: user.headline ?? null,
    phone: user.phone ?? null,
    location: user.location ?? null,
    avatarUrl: user.avatarUrl ?? null,
    linkedinUrl: user.linkedinUrl ?? null,
    githubUrl: user.githubUrl ?? null,
    portfolioUrl: user.portfolioUrl ?? null,
    ...(user.createdAt ? { createdAt: user.createdAt } : {}),
    ...(user.updatedAt ? { updatedAt: user.updatedAt } : {}),
  };
}
