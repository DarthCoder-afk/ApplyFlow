import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

type TokenPayload = {
  userId: string;
};

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn as SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwt.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwt.refreshSecret) as TokenPayload;
}
