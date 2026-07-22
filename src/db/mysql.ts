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

    // Helper for column auto-migration
    const ensureColumnExists = async (table: string, column: string, definition: string) => {
      try {
        const [cols]: any = await db.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
          [table, column]
        );
        if (!cols || cols.length === 0) {
          console.log(`🔧 Auto-migrating table '${table}': adding missing column '${column}'...`);
          await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
        }
      } catch (err: any) {
        console.warn(`⚠️ Warning auto-migrating ${column} in ${table}:`, err.message);
      }
    };

    // Auto-migrate column renames if older schema exists
    try {
      const [oldKelasNameCols]: any = await db.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'kelas' AND COLUMN_NAME = 'nama'`
      );
      if (oldKelasNameCols && oldKelasNameCols.length > 0) {
        await db.query(`ALTER TABLE \`kelas\` CHANGE COLUMN \`nama\` \`namaKelas\` VARCHAR(100) NOT NULL`);
      }
    } catch (e) {}

    try {
      const [oldSiswaDuCols]: any = await db.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'siswa' AND COLUMN_NAME = 'nomorDaftarUlang'`
      );
      if (oldSiswaDuCols && oldSiswaDuCols.length > 0) {
        await db.query(`ALTER TABLE \`siswa\` CHANGE COLUMN \`nomorDaftarUlang\` \`nomorDU\` VARCHAR(100) NOT NULL`);
      }
    } catch (e) {}

    // Ensure all required columns exist in kelas
    await ensureColumnExists('kelas', 'namaKelas', 'VARCHAR(100) NOT NULL DEFAULT \'\'');
    await ensureColumnExists('kelas', 'ruang', 'VARCHAR(100)');
    await ensureColumnExists('kelas', 'waliKelas', 'VARCHAR(150)');
    await ensureColumnExists('kelas', 'nipWaliKelas', 'VARCHAR(100)');
    await ensureColumnExists('kelas', 'kuota', 'INT DEFAULT 36');
    await ensureColumnExists('kelas', 'keterangan', 'TEXT');

    // Helper to relax legacy NOT NULL constraints on non-primary columns without default values
    const relaxLegacyNotNull = async (tableName: string) => {
      try {
        const [notNullCols]: any = await db.query(
          `SELECT COLUMN_NAME
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_SCHEMA = DATABASE()
             AND TABLE_NAME = ?
             AND IS_NULLABLE = 'NO'
             AND COLUMN_KEY != 'PRI'
             AND EXTRA NOT LIKE '%auto_increment%'
             AND COLUMN_DEFAULT IS NULL`,
          [tableName]
        );
        if (Array.isArray(notNullCols)) {
          for (const colRow of notNullCols) {
            const colName = colRow.COLUMN_NAME;
            console.log(`🔧 Relaxing legacy NOT NULL constraint on '${tableName}.${colName}'...`);
            try {
              await db.query(`ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${colName}\` VARCHAR(255) NULL DEFAULT NULL`);
            } catch (err: any) {
              console.warn(`⚠️ Warning relaxing column ${tableName}.${colName}:`, err.message);
            }
          }
        }
      } catch (err: any) {
        console.warn(`⚠️ Warning checking NOT NULL columns for ${tableName}:`, err.message);
      }
    };

    await relaxLegacyNotNull('kelas');

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

    // Ensure all required columns exist in siswa
    await ensureColumnExists('siswa', 'nomorDU', 'VARCHAR(100) NOT NULL DEFAULT \'\'');
    await ensureColumnExists('siswa', 'nik', 'VARCHAR(50) NOT NULL DEFAULT \'\'');
    await ensureColumnExists('siswa', 'nama', 'VARCHAR(150) NOT NULL DEFAULT \'\'');
    await ensureColumnExists('siswa', 'jenisKelamin', 'VARCHAR(10) NOT NULL DEFAULT \'L\'');
    await ensureColumnExists('siswa', 'tempatLahir', 'VARCHAR(100)');
    await ensureColumnExists('siswa', 'tanggalLahir', 'VARCHAR(50)');
    await ensureColumnExists('siswa', 'kelas', 'VARCHAR(100)');
    await ensureColumnExists('siswa', 'catatan', 'TEXT');
    await relaxLegacyNotNull('siswa');

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

    // Ensure all required columns exist in pengguna
    await ensureColumnExists('pengguna', 'nama', 'VARCHAR(150) NOT NULL DEFAULT \'\'');
    await ensureColumnExists('pengguna', 'username', 'VARCHAR(100) NOT NULL DEFAULT \'admin\'');
    await ensureColumnExists('pengguna', 'password', 'VARCHAR(255)');
    await ensureColumnExists('pengguna', 'email', 'VARCHAR(150)');
    await ensureColumnExists('pengguna', 'role', 'VARCHAR(50) NOT NULL DEFAULT \'Super Admin\'');
    await ensureColumnExists('pengguna', 'status', 'VARCHAR(20) DEFAULT \'Aktif\'');
    await ensureColumnExists('pengguna', 'terakhirLogin', 'VARCHAR(100)');
    await relaxLegacyNotNull('pengguna');

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

    // Ensure all required columns exist in pengaturan
    await ensureColumnExists('pengaturan', 'namaSekolah', 'VARCHAR(200)');
    await ensureColumnExists('pengaturan', 'npsn', 'VARCHAR(50)');
    await ensureColumnExists('pengaturan', 'alamatSekolah', 'TEXT');
    await ensureColumnExists('pengaturan', 'telepon', 'VARCHAR(100)');
    await ensureColumnExists('pengaturan', 'emailSekolah', 'VARCHAR(100)');
    await ensureColumnExists('pengaturan', 'website', 'VARCHAR(150)');
    await ensureColumnExists('pengaturan', 'tahunAjaran', 'VARCHAR(50)');
    await ensureColumnExists('pengaturan', 'statusPengumuman', 'TINYINT(1) DEFAULT 1');
    await ensureColumnExists('pengaturan', 'pesanPengumumanTutup', 'TEXT');
    await ensureColumnExists('pengaturan', 'pesanSambutan', 'TEXT');
    await ensureColumnExists('pengaturan', 'namaKepalaSekolah', 'VARCHAR(150)');
    await ensureColumnExists('pengaturan', 'nipKepalaSekolah', 'VARCHAR(100)');
    await ensureColumnExists('pengaturan', 'tanggalPengumuman', 'VARCHAR(100)');
    await ensureColumnExists('pengaturan', 'kotaSekolah', 'VARCHAR(100)');
    await ensureColumnExists('pengaturan', 'logoSekolah', 'LONGTEXT');
    await relaxLegacyNotNull('pengaturan');

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

