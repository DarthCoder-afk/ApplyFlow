import express from 'express';
import request from 'supertest';
import { uploadSingleAvatar } from './avatar-upload.middleware';

function createUploadApp() {
  const app = express();
  app.post('/avatar', uploadSingleAvatar, (req, res) => {
    res.status(200).json({ filename: req.file?.originalname });
  });
  return app;
}

describe('avatar upload middleware', () => {
  it('rejects oversized images', async () => {
    const response = await request(createUploadApp())
      .post('/avatar')
      .attach('avatar', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'large.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(413);
    expect(response.body.message).toBe('The image must be 5 MB or smaller.');
  });

  it('rejects unsupported and SVG MIME types', async () => {
    const response = await request(createUploadApp())
      .post('/avatar')
      .attach('avatar', Buffer.from('<svg></svg>'), {
        filename: 'avatar.svg',
        contentType: 'image/svg+xml',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Only JPEG, PNG, and WebP images are supported.');
  });

  it('rejects multiple avatar files', async () => {
    const response = await request(createUploadApp())
      .post('/avatar')
      .attach('avatar', Buffer.from([0xff, 0xd8, 0xff]), {
        filename: 'one.jpg',
        contentType: 'image/jpeg',
      })
      .attach('avatar', Buffer.from([0xff, 0xd8, 0xff]), {
        filename: 'two.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Upload one profile image using the avatar field.');
  });
});
