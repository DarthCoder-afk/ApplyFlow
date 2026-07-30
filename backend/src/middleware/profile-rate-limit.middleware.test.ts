import express from 'express';
import request from 'supertest';
import {
  avatarUploadRateLimiters,
  avatarRemovalRateLimiters,
  enforceAvatarUploadCooldown,
  markAvatarUploadSucceeded,
  profileUpdateRateLimiters,
  resetAvatarProtectionForTests,
} from './profile-rate-limit.middleware';

describe('profile upload abuse protection', () => {
  beforeEach(() => resetAvatarProtectionForTests());

  it('limits avatar upload attempts per authenticated user', async () => {
    const app = express();
    app.post(
      '/avatar',
      (req, _res, next) => {
        req.userId = 'rate-limit-user';
        next();
      },
      ...avatarUploadRateLimiters,
      (_req, res) => res.status(200).json({ success: true })
    );

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await request(app).post('/avatar')).status).toBe(200);
    }

    const limited = await request(app).post('/avatar');
    expect(limited.status).toBe(429);
    expect(limited.body).toEqual({
      success: false,
      message: 'You are uploading too frequently. Please wait before trying again.',
    });
  });

  it('enforces the successful-upload cooldown', async () => {
    const app = express();
    app.post(
      '/avatar',
      (req, _res, next) => {
        req.userId = 'cooldown-user';
        next();
      },
      enforceAvatarUploadCooldown,
      (_req, res) => res.status(200).json({ success: true })
    );

    markAvatarUploadSucceeded('cooldown-user');
    const response = await request(app).post('/avatar');

    expect(response.status).toBe(429);
  });

  it('limits avatar removal to 10 requests per hour per user', async () => {
    const app = express();
    app.delete(
      '/avatar',
      (req, _res, next) => {
        req.userId = 'removal-rate-limit-user';
        next();
      },
      ...avatarRemovalRateLimiters,
      (_req, res) => res.status(200).json({ success: true })
    );

    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect((await request(app).delete('/avatar')).status).toBe(200);
    }
    expect((await request(app).delete('/avatar')).status).toBe(429);
  });

  it('limits general profile updates to 20 requests per 15 minutes per user', async () => {
    const app = express();
    app.patch(
      '/profile',
      (req, _res, next) => {
        req.userId = 'profile-rate-limit-user';
        next();
      },
      ...profileUpdateRateLimiters,
      (_req, res) => res.status(200).json({ success: true })
    );

    for (let attempt = 0; attempt < 20; attempt += 1) {
      expect((await request(app).patch('/profile')).status).toBe(200);
    }
    expect((await request(app).patch('/profile')).status).toBe(429);
  });
});
