jest.mock('./cloudinary.config', () => ({
  getCloudinaryClient: jest.fn(),
}));

import { getCloudinaryClient } from './cloudinary.config';
import {
  hasValidAvatarSignature,
  uploadAvatar,
} from './cloudinary.service';
import { AVATAR_TRANSFORMATION } from './cloudinary.constants';

const mockedGetCloudinaryClient = getCloudinaryClient as jest.Mock;

describe('cloudinary avatar service', () => {
  it('uploads under a backend-controlled user folder with avatar transformations', async () => {
    const end = jest.fn();
    const uploadStream = jest.fn((options, callback) => {
      callback(undefined, {
        secure_url: 'https://res.cloudinary.com/demo/avatar.webp',
        public_id: options.public_id,
      });
      return { end };
    });
    mockedGetCloudinaryClient.mockReturnValue({
      uploader: { upload_stream: uploadStream },
    });

    const result = await uploadAvatar('user-1', Buffer.from('image'));

    expect(uploadStream).toHaveBeenCalledWith(
      expect.objectContaining({
        public_id: expect.stringMatching(/^applyflow\/avatars\/user-1\/[a-f0-9-]+$/),
        overwrite: false,
        resource_type: 'image',
        transformation: [AVATAR_TRANSFORMATION],
      }),
      expect.any(Function)
    );
    expect(end).toHaveBeenCalledWith(Buffer.from('image'));
    expect(result.avatarUrl).toMatch(/^https:/);
  });

  it('validates JPEG, PNG, and WebP signatures and rejects spoofed bytes', () => {
    expect(hasValidAvatarSignature(Buffer.from([0xff, 0xd8, 0xff]), 'image/jpeg')).toBe(true);
    expect(
      hasValidAvatarSignature(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        'image/png'
      )
    ).toBe(true);
    expect(
      hasValidAvatarSignature(Buffer.from('RIFF0000WEBP'), 'image/webp')
    ).toBe(true);
    expect(hasValidAvatarSignature(Buffer.from('<svg>'), 'image/png')).toBe(false);
    expect(hasValidAvatarSignature(Buffer.from('<svg>'), 'image/svg+xml')).toBe(false);
  });
});
