import mysql from 'mysql2/promise';
import { initialStudents, initialClasses, initialUsers, initialAppSettings } from '../data/initialData.js';

let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (pool) return pool;

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'db_pengumuman';
  const port = Number(process.env.DB_PORT) || 3306;

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function initMySQLDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'db_pengumuman';
  const port = Number(process.env.DB_PORT) || 3306;

  console.log(`🔍 Trying to connect to MySQL database '${database}' on ${host}:${port} as user '${user}'...`);

  // Step 1: Try creating database if user has permission
  try {
    const rootConnection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConnection.end();
  } catch (err: any) {
    console.warn(`⚠️ Warning during CREATE DATABASE check: ${err.message}`);
  }

  // Step 2: Connect directly to the database & create tables
  try {
    const db = getDbPool();
    if (!db) {
      console.error('❌ Could not create MySQL connection pool.');
      return false;
    }

    // Table: kelas
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`kelas\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`namaKelas\` VARCHAR(100) NOT NULL,
        \`ruang\` VARCHAR(100),
        \`waliKelas\` VARCHAR(150),
        \`nipWaliKelas\` VARCHAR(100),
        \`kuota\` INT DEFAULT 36,
        \`keterangan\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: siswa
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`siswa\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`nomorDU\` VARCHAR(100) NOT NULL,
        \`nik\` VARCHAR(50) NOT NULL,
        \`nama\` VARCHAR(150) NOT NULL,
        \`jenisKelamin\` VARCHAR(10) NOT NULL,
        \`tempatLahir\` VARCHAR(100),
        \`tanggalLahir\` VARCHAR(50),
        \`kelas\` VARCHAR(100),
        \`catatan\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: pengguna
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`pengguna\` (
        \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,
        \`nama\` VARCHAR(150) NOT NULL,
        \`username\` VARCHAR(100) NOT NULL UNIQUE,
        \`password\` VARCHAR(255),
        \`email\` VARCHAR(150),
        \`role\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(20) DEFAULT 'Aktif',
        \`terakhirLogin\` VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: pengaturan
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`pengaturan\` (
        \`id\` INT PRIMARY KEY DEFAULT 1,
        \`namaSekolah\` VARCHAR(200),
        \`npsn\` VARCHAR(50),
        \`alamatSekolah\` TEXT,
        \`telepon\` VARCHAR(100),
        \`emailSekolah\` VARCHAR(100),
        \`website\` VARCHAR(150),
        \`tahunAjaran\` VARCHAR(50),
        \`statusPengumuman\` TINYINT(1) DEFAULT 1,
        \`pesanPengumumanTutup\` TEXT,
        \`pesanSambutan\` TEXT,
        \`namaKepalaSekolah\` VARCHAR(150),
        \`nipKepalaSekolah\` VARCHAR(100),
        \`tanggalPengumuman\` VARCHAR(100),
        \`kotaSekolah\` VARCHAR(100),
        \`logoSekolah\` LONGTEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed classes if empty
    const [clsRows]: any = await db.query(`SELECT COUNT(*) as count FROM \`kelas\`;`);
    if (clsRows[0]?.count === 0) {
      for (const cls of initialClasses) {
        await db.query(
          `INSERT INTO \`kelas\` (\`id\`, \`namaKelas\`, \`ruang\`, \`waliKelas\`, \`nipWaliKelas\`, \`kuota\`, \`keterangan\`)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [cls.id, cls.namaKelas, cls.ruang, cls.waliKelas, cls.nipWaliKelas, cls.kuota, cls.keterangan || '']
        );
      }
      console.log('✅ Initial classes seeded in MySQL.');
    }

    // Seed students if empty
    const [stdRows]: any = await db.query(`SELECT COUNT(*) as count FROM \`siswa\`;`);
    if (stdRows[0]?.count === 0) {
      for (const std of initialStudents) {
        await db.query(
          `INSERT INTO \`siswa\` (\`id\`, \`nomorDU\`, \`nik\`, \`nama\`, \`jenisKelamin\`, \`tempatLahir\`, \`tanggalLahir\`, \`kelas\`, \`catatan\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [std.id, std.nomorDU, std.nik, std.nama, std.jenisKelamin, std.tempatLahir, std.tanggalLahir, std.kelas, std.catatan || '']
        );
      }
      console.log('✅ Initial students seeded in MySQL.');
    }

    // Seed users if empty
    const [usrRows]: any = await db.query(`SELECT COUNT(*) as count FROM \`pengguna\`;`);
    if (usrRows[0]?.count === 0) {
      for (const usr of initialUsers) {
        await db.query(
          `INSERT INTO \`pengguna\` (\`id\`, \`nama\`, \`username\`, \`password\`, \`email\`, \`role\`, \`status\`, \`terakhirLogin\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [usr.id, usr.nama, usr.username, 'admin123', usr.email || '', usr.role, usr.status, usr.terakhirLogin]
        );
      }
      console.log('✅ Initial users seeded in MySQL.');
    }

    // Seed settings if empty
    const [stgRows]: any = await db.query(`SELECT COUNT(*) as count FROM \`pengaturan\`;`);
    if (stgRows[0]?.count === 0) {
      const s = initialAppSettings;
      await db.query(
        `INSERT INTO \`pengaturan\`
         (\`id\`, \`namaSekolah\`, \`npsn\`, \`alamatSekolah\`, \`telepon\`, \`emailSekolah\`, \`website\`, \`tahunAjaran\`, \`statusPengumuman\`, \`pesanPengumumanTutup\`, \`pesanSambutan\`, \`namaKepalaSekolah\`, \`nipKepalaSekolah\`, \`tanggalPengumuman\`, \`kotaSekolah\`, \`logoSekolah\`)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.namaSekolah, s.npsn, s.alamatSekolah, s.telepon, s.emailSekolah, s.website, s.tahunAjaran, s.statusPengumuman ? 1 : 0, s.pesanPengumumanTutup, s.pesanSambutan, s.namaKepalaSekolah, s.nipKepalaSekolah, s.tanggalPengumuman, s.kotaSekolah, s.logoSekolah || '']
      );
      console.log('✅ Initial settings seeded in MySQL.');
    }

    console.log('🚀 MySQL tables initialized & synced successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize MySQL database:', error);
    return false;
  }
}

