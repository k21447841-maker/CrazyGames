import { Router, Request, Response } from 'express';
import { Game } from '../models/Game';
import { isDbConnected } from '../db';
import { mockDb } from '../mockDb';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET all games (public)
router.get('/', async (req: Request, res: Response) => {
  if (!isDbConnected) {
    const activeGames = mockDb.games.filter(g => g.active);
    return res.json(activeGames);
  }
  try {
    const games = await Game.find({ active: true }).sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all games for admin (including inactive)
router.get('/admin', authMiddleware, async (req: Request, res: Response) => {
  if (!isDbConnected) {
    return res.json(mockDb.games);
  }
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single game
router.get('/:id', async (req: Request, res: Response) => {
  if (!isDbConnected) {
    const game = mockDb.games.find(g => g._id === req.params.id);
    return game ? res.json(game) : res.status(404).json({ error: 'Not found' });
  }
  try {
    const game = await Game.findById(req.params.id);
    return game ? res.json(game) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new game (admin only)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  if (!isDbConnected) {
    const newGame = {
      _id: Math.random().toString(36).substring(7),
      ...req.body,
      plays: 0,
      rating: 0,
      createdAt: new Date().toISOString()
    };
    mockDb.games.push(newGame);
    return res.json(newGame);
  }
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.json(newGame);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT bulk update games (activate/deactivate)
router.put('/bulk-update', authMiddleware, async (req: Request, res: Response) => {
  const { ids, data } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No game IDs provided' });
  }

  if (!isDbConnected) {
    mockDb.games = mockDb.games.map(g => {
      if (ids.includes(g._id)) {
        return { ...g, ...data };
      }
      return g;
    });
    return res.json({ success: true, count: ids.length });
  }

  try {
    const result = await Game.updateMany(
      { _id: { $in: ids } },
      { $set: data }
    );
    res.json({ success: true, count: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update game
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  if (!isDbConnected) {
    const idx = mockDb.games.findIndex(g => g._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    mockDb.games[idx] = { ...mockDb.games[idx], ...req.body };
    return res.json(mockDb.games[idx]);
  }
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return game ? res.json(game) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE game
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  if (!isDbConnected) {
    mockDb.games = mockDb.games.filter(g => g._id !== req.params.id);
    return res.json({ success: true });
  }
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST rate game
router.post('/:id/rate', async (req: Request, res: Response) => {
  const { rating } = req.body;
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating' });
  }

  if (!isDbConnected) {
    const idx = mockDb.games.findIndex(g => g._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    
    const game = mockDb.games[idx];
    const newRatingCount = (game.ratingCount || 0) + 1;
    const newRating = ((game.rating || 0) * (game.ratingCount || 0) + rating) / newRatingCount;
    
    mockDb.games[idx] = { 
      ...game, 
      rating: newRating, 
      ratingCount: newRatingCount 
    };
    return res.json(mockDb.games[idx]);
  }

  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    
    const newRatingCount = (game.ratingCount || 0) + 1;
    const newRating = ((game.rating || 0) * (game.ratingCount || 0) + rating) / newRatingCount;
    
    game.rating = newRating;
    game.ratingCount = newRatingCount;
    await game.save();
    
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
