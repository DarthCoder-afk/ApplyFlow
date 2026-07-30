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

export function getUserInitials(
  user: Pick<UserName, 'firstName' | 'lastName'>
): string {
  return `${user.firstName.trim()[0] ?? ''}${user.lastName.trim()[0] ?? ''}`.toUpperCase();
}
