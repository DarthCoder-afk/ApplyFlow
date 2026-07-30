import { prisma } from '../../config/database';
import { deleteAvatar, uploadAvatar } from '../cloudinary/cloudinary.service';
import { presentUser } from '../../utils/user-profile';
import type { UpdateProfileInput } from './profile.schema';

const publicProfileSelect = {
  id: true,
  email: true,
  firstName: true,
  middleName: true,
  lastName: true,
  suffix: true,
  headline: true,
  phone: true,
  location: true,
  avatarUrl: true,
  linkedinUrl: true,
  githubUrl: true,
  portfolioUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicProfileSelect,
  });

  return user ? presentUser(user) : null;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const data = {
    firstName: input.firstName,
    middleName: input.middleName,
    lastName: input.lastName,
    suffix: input.suffix,
    headline: input.headline,
    phone: input.phone,
    location: input.location,
    linkedinUrl: input.linkedinUrl,
    githubUrl: input.githubUrl,
    portfolioUrl: input.portfolioUrl,
  };

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: publicProfileSelect,
  });

  return presentUser(user);
}

export async function replaceProfileAvatar(userId: string, buffer: Buffer) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPublicId: true },
  });

  if (!currentUser) {
    throw new Error('USER_NOT_FOUND');
  }

  const previousPublicId = currentUser.avatarPublicId;
  const uploadedAvatar = await uploadAvatar(userId, buffer);

  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: uploadedAvatar.avatarUrl,
        avatarPublicId: uploadedAvatar.avatarPublicId,
      },
      select: publicProfileSelect,
    });
  } catch (error) {
    try {
      await deleteAvatar(uploadedAvatar.avatarPublicId);
    } catch (cleanupError) {
      console.error('Failed to remove a newly uploaded orphan avatar:', cleanupError);
    }
    throw error;
  }

  if (previousPublicId && previousPublicId !== uploadedAvatar.avatarPublicId) {
    try {
      await deleteAvatar(previousPublicId);
    } catch (cleanupError) {
      console.error('Failed to remove a replaced avatar:', cleanupError);
    }
  }

  return presentUser(updatedUser);
}

export async function removeProfileAvatar(userId: string) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPublicId: true },
  });

  if (!currentUser) {
    throw new Error('USER_NOT_FOUND');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: null,
      avatarPublicId: null,
    },
    select: publicProfileSelect,
  });

  if (currentUser.avatarPublicId) {
    try {
      await deleteAvatar(currentUser.avatarPublicId);
    } catch (cleanupError) {
      console.error('Failed to remove a deleted profile avatar:', cleanupError);
    }
  }

  return presentUser(updatedUser);
}
