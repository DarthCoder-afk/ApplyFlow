jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn(),
  },
}));

jest.mock('../../utils/jwt', () => ({
  verifyRefreshToken: jest.fn(),
  signAccessToken: jest.fn().mockReturnValue('access-token'),
  signRefreshToken: jest.fn().mockReturnValue('refresh-token'),
}));

import { prisma } from '../../config/database';
import { registerUser } from './auth.service';

const mockedUser = prisma.user as unknown as {
  findUnique: jest.Mock;
  create: jest.Mock;
};
const mockedRefreshToken = prisma.refreshToken as unknown as {
  create: jest.Mock;
};

describe('registerUser', () => {
  it('persists separate names, creates a session, and returns a formatted user', async () => {
    mockedUser.findUnique.mockResolvedValue(null);
    mockedUser.create.mockResolvedValue({
      id: 'user-1',
      email: 'sean@example.com',
      firstName: 'Sean',
      middleName: 'Michael',
      lastName: 'Borje',
      suffix: 'Jr.',
      headline: null,
      phone: null,
      location: null,
      avatarUrl: null,
      linkedinUrl: null,
      githubUrl: null,
      portfolioUrl: null,
      createdAt: new Date('2026-07-29T00:00:00.000Z'),
    });

    const result = await registerUser({
      firstName: 'Sean',
      middleName: 'Michael',
      lastName: 'Borje',
      suffix: 'Jr.',
      email: 'sean@example.com',
      password: 'password123',
    });

    expect(mockedUser.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          email: 'sean@example.com',
          password: 'hashed-password',
          firstName: 'Sean',
          middleName: 'Michael',
          lastName: 'Borje',
          suffix: 'Jr.',
        },
      })
    );
    expect(mockedRefreshToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        token: 'refresh-token',
        userId: 'user-1',
      }),
    });
    expect(result).toEqual(
      expect.objectContaining({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: expect.objectContaining({
          fullName: 'Sean Michael Borje, Jr.',
        }),
      })
    );
  });
});
