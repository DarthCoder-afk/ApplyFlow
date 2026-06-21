import { Request, Response } from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from './auth.service';

export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'USER_ALREADY_EXISTS') {
      return res.status(400).json({ message: 'user already exists' });
    }

    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const { accessToken } = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      message: 'Token refreshed',
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_REFRESH_TOKEN') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    console.error('Refresh error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
