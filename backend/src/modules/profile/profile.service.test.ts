jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../cloudinary/cloudinary.service', () => ({
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
}));

import { prisma } from '../../config/database';
import { deleteAvatar, uploadAvatar } from '../cloudinary/cloudinary.service';
import {
  getProfile,
  removeProfileAvatar,
  replaceProfileAvatar,
  updateProfile,
} from './profile.service';

const mockedUser = prisma.user as unknown as {
  findUnique: jest.Mock;
  update: jest.Mock;
};
const mockedUploadAvatar = uploadAvatar as jest.Mock;
const mockedDeleteAvatar = deleteAvatar as jest.Mock;

const profileRecord = {
  id: 'user-1',
  email: 'sean@example.com',
  firstName: 'Sean',
  middleName: null,
  lastName: 'Borje',
  suffix: null,
  headline: null,
  phone: null,
  location: null,
  avatarUrl: null,
  linkedinUrl: null,
  githubUrl: null,
  portfolioUrl: null,
  createdAt: new Date('2026-07-29T00:00:00.000Z'),
  updatedAt: new Date('2026-07-29T00:00:00.000Z'),
};

describe('profile service', () => {
  it('retrieves an authenticated user profile', async () => {
    mockedUser.findUnique.mockResolvedValue(profileRecord);

    await expect(getProfile('user-1')).resolves.toEqual(
      expect.objectContaining({ id: 'user-1', fullName: 'Sean Borje' })
    );
  });

  it('constructs an explicit update without protected fields', async () => {
    mockedUser.update.mockResolvedValue({
      ...profileRecord,
      firstName: 'Jane',
      headline: 'Engineer',
    });

    await updateProfile('user-1', {
      firstName: 'Jane',
      headline: 'Engineer',
    });

    const update = mockedUser.update.mock.calls[0][0];
    expect(update.data).toEqual(
      expect.objectContaining({ firstName: 'Jane', headline: 'Engineer' })
    );
    expect(update.data).not.toHaveProperty('email');
    expect(update.data).not.toHaveProperty('avatarPublicId');
    expect(update.data).not.toHaveProperty('password');
  });

  it('stores a new avatar before deleting the old stored public ID', async () => {
    mockedUser.findUnique.mockResolvedValue({ avatarPublicId: 'old/avatar' });
    mockedUploadAvatar.mockResolvedValue({
      avatarUrl: 'https://res.cloudinary.com/demo/new.webp',
      avatarPublicId: 'applyflow/avatars/user-1/new',
    });
    mockedUser.update.mockResolvedValue({
      ...profileRecord,
      avatarUrl: 'https://res.cloudinary.com/demo/new.webp',
    });

    await replaceProfileAvatar('user-1', Buffer.from('image'));

    expect(mockedUser.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          avatarUrl: 'https://res.cloudinary.com/demo/new.webp',
          avatarPublicId: 'applyflow/avatars/user-1/new',
        },
      })
    );
    expect(mockedDeleteAvatar).toHaveBeenCalledWith('old/avatar');
    expect(mockedUser.update.mock.invocationCallOrder[0]).toBeLessThan(
      mockedDeleteAvatar.mock.invocationCallOrder[0]
    );
  });

  it('deletes a newly uploaded avatar when the database update fails', async () => {
    mockedUser.findUnique.mockResolvedValue({ avatarPublicId: 'old/avatar' });
    mockedUploadAvatar.mockResolvedValue({
      avatarUrl: 'https://res.cloudinary.com/demo/new.webp',
      avatarPublicId: 'applyflow/avatars/user-1/new',
    });
    mockedUser.update.mockRejectedValue(new Error('database unavailable'));

    await expect(replaceProfileAvatar('user-1', Buffer.from('image'))).rejects.toThrow(
      'database unavailable'
    );
    expect(mockedDeleteAvatar).toHaveBeenCalledWith('applyflow/avatars/user-1/new');
    expect(mockedDeleteAvatar).not.toHaveBeenCalledWith('old/avatar');
  });

  it('clears avatar fields and deletes only the stored public ID', async () => {
    mockedUser.findUnique.mockResolvedValue({ avatarPublicId: 'stored/avatar' });
    mockedUser.update.mockResolvedValue(profileRecord);

    await removeProfileAvatar('user-1');

    expect(mockedUser.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { avatarUrl: null, avatarPublicId: null },
      })
    );
    expect(mockedDeleteAvatar).toHaveBeenCalledWith('stored/avatar');
  });
});
