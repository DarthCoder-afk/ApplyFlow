import { Request, Response } from 'express';
import { getDashboardStats } from './dashboard.service';

export async function getStats(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const stats = await getDashboardStats(req.userId);

    return res.status(200).json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
