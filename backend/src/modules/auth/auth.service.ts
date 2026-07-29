import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../../utils/jwt';
import { presentUser } from '../../utils/user-profile';

const SALT_ROUNDS = 10;

type RegisterInput = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
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
    },
  });

  return user ? presentUser(user) : null;
}

async function createSession(userId: string) {
  const payload = { userId };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      middleName: input.middleName,
      lastName: input.lastName,
      suffix: input.suffix,
    },

    select: {
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
    },
  });
  const session = await createSession(user.id);

  return { ...session, user: presentUser(user) };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isValid = await bcrypt.compare(input.password, user.password);

  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const { accessToken, refreshToken } = await createSession(user.id);

  return {
    accessToken,
    refreshToken,
    user: presentUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      suffix: user.suffix,
      headline: user.headline,
      phone: user.phone,
      location: user.location,
      avatarUrl: user.avatarUrl,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
    }),
  };
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: { userId: string };

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  const accessToken = signAccessToken({ userId: payload.userId });

  return { accessToken };
}

export async function logoutUser(refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  return { message: 'Logged out successfully' };
}
