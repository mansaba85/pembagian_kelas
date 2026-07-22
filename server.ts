import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initMySQLDatabase } from './src/db/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Automatically initialize MySQL database and tables on startup if DB credentials provided
  await initMySQLDatabase();

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Sistem Pengumuman Pembagian Kelas',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for dev mode vs static serve for production mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================`);
    console.log(`🚀 Aplikasi Berjalan di Port http://0.0.0.0:${PORT}`);
    console.log(`================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
