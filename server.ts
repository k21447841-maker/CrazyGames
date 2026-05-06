import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { connectDB } from './backend/db';
import gamesRouter from './backend/routes/games';
import adminRouter from './backend/routes/admin';
import adsRouter from './backend/routes/ads';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

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
    
    // Explicit SPA fallback for development just in case
    app.use('*', async (req, res, next) => {
      if (req.method === 'GET' && !req.originalUrl.startsWith('/api/') && !req.originalUrl.includes('.')) {
        try {
          const template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          const html = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e: any) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      } else {
        next();
      }
    });
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res, next) => {
      if (req.method === 'GET' && !req.originalUrl.startsWith('/api/') && !req.originalUrl.includes('.')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
         next();
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
