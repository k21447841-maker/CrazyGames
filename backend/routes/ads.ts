import { Router, Request, Response } from 'express';
import { AdSettings } from '../models/AdSettings';
import { isDbConnected } from '../db';
import { mockDb } from '../mockDb';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET ad settings (public)
router.get('/settings', async (req: Request, res: Response) => {
  if (!isDbConnected) {
    return res.json(mockDb.adSettings);
  }
  try {
    let settings = await AdSettings.findOne();
    if (!settings) {
      settings = await AdSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update ad settings
router.put('/settings', authMiddleware, async (req: Request, res: Response) => {
  if (!isDbConnected) {
    mockDb.adSettings = { ...mockDb.adSettings, ...req.body, updatedAt: new Date().toISOString() };
    return res.json(mockDb.adSettings);
  }
  try {
    let settings = await AdSettings.findOne();
    if (!settings) {
      settings = new AdSettings(req.body);
    } else {
      Object.assign(settings, req.body);
      settings.updatedAt = new Date();
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
