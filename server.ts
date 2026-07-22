import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initMySQLDatabase, getDbPool } from './src/db/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5003;

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

  app.get("/api/students", async (req, res) => {
    try {
      const db = getDbPool();
      const [rows] = await db.query("SELECT * FROM `siswa`");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const db = getDbPool();
      const student = req.body;
      await db.query("INSERT INTO `siswa` SET ?", student);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add student" });
    }
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
