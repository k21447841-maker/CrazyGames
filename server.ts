import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { connectDB } from './backend/db';
import gamesRouter from './backend/routes/games';
import adminRouter from './backend/routes/admin';
import adsRouter from './backend/routes/ads';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Connect to DB (or use fallback)
  await connectDB();

  // API Routes
  app.use('/api/games', gamesRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/ads', adsRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for frontend development / static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
