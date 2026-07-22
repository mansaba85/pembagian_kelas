import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initMySQLDatabase, getDbPool } from './src/db/mysql.js';
import { initialStudents, initialClasses, initialUsers, initialAppSettings } from './src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5004;

  app.use(express.json({ limit: '10mb' }));

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

  // --- STUDENTS API ---
  app.get('/api/students', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows] = await db.query('SELECT * FROM `siswa`');
      res.json(rows);
    } catch (error) {
      console.error('Fetch students error:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  app.post('/api/students', async (req, res) => {
    try {
      const db = getDbPool();
      const s = req.body;
      await db.query(
        `INSERT INTO \`siswa\` (\`id\`, \`nomorDU\`, \`nik\`, \`nama\`, \`jenisKelamin\`, \`tempatLahir\`, \`tanggalLahir\`, \`kelas\`, \`catatan\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         \`nomorDU\`=VALUES(\`nomorDU\`), \`nik\`=VALUES(\`nik\`), \`nama\`=VALUES(\`nama\`), \`jenisKelamin\`=VALUES(\`jenisKelamin\`), \`tempatLahir\`=VALUES(\`tempatLahir\`), \`tanggalLahir\`=VALUES(\`tanggalLahir\`), \`kelas\`=VALUES(\`kelas\`), \`catatan\`=VALUES(\`catatan\`)`,
        [s.id, s.nomorDU, s.nik, s.nama, s.jenisKelamin, s.tempatLahir, s.tanggalLahir, s.kelas, s.catatan || '']
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Add student error:', error);
      res.status(500).json({ error: 'Failed to add student' });
    }
  });

  app.put('/api/students/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const s = req.body;
      const { id } = req.params;
      await db.query(
        `UPDATE \`siswa\` SET \`nomorDU\`=?, \`nik\`=?, \`nama\`=?, \`jenisKelamin\`=?, \`tempatLahir\`=?, \`tanggalLahir\`=?, \`kelas\`=?, \`catatan\`=? WHERE \`id\`=?`,
        [s.nomorDU, s.nik, s.nama, s.jenisKelamin, s.tempatLahir, s.tanggalLahir, s.kelas, s.catatan || '', id]
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Update student error:', error);
      res.status(500).json({ error: 'Failed to update student' });
    }
  });

  app.delete('/api/students/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      await db.query('DELETE FROM `siswa` WHERE `id` = ?', [id]);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  });

  app.post('/api/students/bulk-delete', async (req, res) => {
    try {
      const db = getDbPool();
      const { ids } = req.body;
      if (Array.isArray(ids) && ids.length > 0) {
        await db.query('DELETE FROM `siswa` WHERE `id` IN (?)', [ids]);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Bulk delete students error:', error);
      res.status(500).json({ error: 'Failed to delete students' });
    }
  });

  app.post('/api/students/import', async (req, res) => {
    try {
      const db = getDbPool();
      const { students } = req.body;
      if (Array.isArray(students)) {
        for (const s of students) {
          await db.query(
            `INSERT INTO \`siswa\` (\`id\`, \`nomorDU\`, \`nik\`, \`nama\`, \`jenisKelamin\`, \`tempatLahir\`, \`tanggalLahir\`, \`kelas\`, \`catatan\`)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             \`nomorDU\`=VALUES(\`nomorDU\`), \`nik\`=VALUES(\`nik\`), \`nama\`=VALUES(\`nama\`), \`jenisKelamin\`=VALUES(\`jenisKelamin\`), \`tempatLahir\`=VALUES(\`tempatLahir\`), \`tanggalLahir\`=VALUES(\`tanggalLahir\`), \`kelas\`=VALUES(\`kelas\`), \`catatan\`=VALUES(\`catatan\`)`,
            [s.id, s.nomorDU, s.nik, s.nama, s.jenisKelamin, s.tempatLahir, s.tanggalLahir, s.kelas, s.catatan || '']
          );
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Import students error:', error);
      res.status(500).json({ error: 'Failed to import students' });
    }
  });

  // --- CLASSES API ---
  app.get('/api/classes', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows] = await db.query('SELECT * FROM `kelas`');
      res.json(rows);
    } catch (error) {
      console.error('Fetch classes error:', error);
      res.status(500).json({ error: 'Failed to fetch classes' });
    }
  });

  app.post('/api/classes', async (req, res) => {
    try {
      const db = getDbPool();
      const c = req.body;
      await db.query(
        `INSERT INTO \`kelas\` (\`id\`, \`namaKelas\`, \`ruang\`, \`waliKelas\`, \`nipWaliKelas\`, \`kuota\`, \`keterangan\`)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.namaKelas, c.ruang, c.waliKelas, c.nipWaliKelas, c.kuota, c.keterangan || '']
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Add class error:', error);
      res.status(500).json({ error: 'Failed to add class' });
    }
  });

  app.put('/api/classes/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const c = req.body;
      const { id } = req.params;
      await db.query(
        `UPDATE \`kelas\` SET \`namaKelas\`=?, \`ruang\`=?, \`waliKelas\`=?, \`nipWaliKelas\`=?, \`kuota\`=?, \`keterangan\`=? WHERE \`id\`=?`,
        [c.namaKelas, c.ruang, c.waliKelas, c.nipWaliKelas, c.kuota, c.keterangan || '', id]
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Update class error:', error);
      res.status(500).json({ error: 'Failed to update class' });
    }
  });

  app.delete('/api/classes/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      await db.query('DELETE FROM `kelas` WHERE `id` = ?', [id]);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete class error:', error);
      res.status(500).json({ error: 'Failed to delete class' });
    }
  });

  // --- USERS API ---
  app.get('/api/users', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows] = await db.query('SELECT * FROM `pengguna`');
      res.json(rows);
    } catch (error) {
      console.error('Fetch users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const db = getDbPool();
      const u = req.body;
      await db.query(
        `INSERT INTO \`pengguna\` (\`id\`, \`nama\`, \`username\`, \`password\`, \`email\`, \`role\`, \`status\`, \`terakhirLogin\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.nama, u.username, u.password || 'admin123', u.email || '', u.role, u.status || 'Aktif', u.terakhirLogin || 'Baru Saja']
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Add user error:', error);
      res.status(500).json({ error: 'Failed to add user' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const u = req.body;
      const { id } = req.params;
      if (u.password) {
        await db.query(
          `UPDATE \`pengguna\` SET \`nama\`=?, \`username\`=?, \`password\`=?, \`email\`=?, \`role\`=?, \`status\`=? WHERE \`id\`=?`,
          [u.nama, u.username, u.password, u.email || '', u.role, u.status, id]
        );
      } else {
        await db.query(
          `UPDATE \`pengguna\` SET \`nama\`=?, \`username\`=?, \`email\`=?, \`role\`=?, \`status\`=? WHERE \`id\`=?`,
          [u.nama, u.username, u.email || '', u.role, u.status, id]
        );
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      await db.query('DELETE FROM `pengguna` WHERE `id` = ?', [id]);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // --- SETTINGS API ---
  app.get('/api/settings', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows]: any = await db.query('SELECT * FROM `pengaturan` WHERE id = 1');
      if (rows && rows[0]) {
        const row = rows[0];
        res.json({
          ...row,
          statusPengumuman: Boolean(row.statusPengumuman),
        });
      } else {
        res.json(initialAppSettings);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', async (req, res) => {
    try {
      const db = getDbPool();
      const s = req.body;
      await db.query(
        `UPDATE \`pengaturan\` SET
         \`namaSekolah\`=?, \`npsn\`=?, \`alamatSekolah\`=?, \`telepon\`=?, \`emailSekolah\`=?, \`website\`=?, \`tahunAjaran\`=?, \`statusPengumuman\`=?, \`pesanPengumumanTutup\`=?, \`pesanSambutan\`=?, \`namaKepalaSekolah\`=?, \`nipKepalaSekolah\`=?, \`tanggalPengumuman\`=?, \`kotaSekolah\`=?, \`logoSekolah\`=?
         WHERE \`id\`=1`,
        [s.namaSekolah, s.npsn, s.alamatSekolah, s.telepon, s.emailSekolah, s.website, s.tahunAjaran, s.statusPengumuman ? 1 : 0, s.pesanPengumumanTutup, s.pesanSambutan, s.namaKepalaSekolah, s.nipKepalaSekolah, s.tanggalPengumuman, s.kotaSekolah, s.logoSekolah || '']
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // --- RESET DB API ---
  app.post('/api/reset', async (req, res) => {
    try {
      const db = getDbPool();
      await db.query('DELETE FROM `siswa`');
      await db.query('DELETE FROM `kelas`');
      await db.query('DELETE FROM `pengguna`');
      await db.query('DELETE FROM `pengaturan`');

      for (const cls of initialClasses) {
        await db.query(
          `INSERT INTO \`kelas\` (\`id\`, \`namaKelas\`, \`ruang\`, \`waliKelas\`, \`nipWaliKelas\`, \`kuota\`, \`keterangan\`)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [cls.id, cls.namaKelas, cls.ruang, cls.waliKelas, cls.nipWaliKelas, cls.kuota, cls.keterangan || '']
        );
      }
      for (const std of initialStudents) {
        await db.query(
          `INSERT INTO \`siswa\` (\`id\`, \`nomorDU\`, \`nik\`, \`nama\`, \`jenisKelamin\`, \`tempatLahir\`, \`tanggalLahir\`, \`kelas\`, \`catatan\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [std.id, std.nomorDU, std.nik, std.nama, std.jenisKelamin, std.tempatLahir, std.tanggalLahir, std.kelas, std.catatan || '']
        );
      }
      for (const usr of initialUsers) {
        await db.query(
          `INSERT INTO \`pengguna\` (\`id\`, \`nama\`, \`username\`, \`password\`, \`email\`, \`role\`, \`status\`, \`terakhirLogin\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [usr.id, usr.nama, usr.username, 'admin123', usr.email || '', usr.role, usr.status, usr.terakhirLogin]
        );
      }
      const s = initialAppSettings;
      await db.query(
        `INSERT INTO \`pengaturan\`
         (\`id\`, \`namaSekolah\`, \`npsn\`, \`alamatSekolah\`, \`telepon\`, \`emailSekolah\`, \`website\`, \`tahunAjaran\`, \`statusPengumuman\`, \`pesanPengumumanTutup\`, \`pesanSambutan\`, \`namaKepalaSekolah\`, \`nipKepalaSekolah\`, \`tanggalPengumuman\`, \`kotaSekolah\`, \`logoSekolah\`)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.namaSekolah, s.npsn, s.alamatSekolah, s.telepon, s.emailSekolah, s.website, s.tahunAjaran, s.statusPengumuman ? 1 : 0, s.pesanPengumumanTutup, s.pesanSambutan, s.namaKepalaSekolah, s.nipKepalaSekolah, s.tanggalPengumuman, s.kotaSekolah, s.logoSekolah || '']
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Reset DB error:', error);
      res.status(500).json({ error: 'Failed to reset database' });
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

