import mysql from 'mysql2/promise';

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
    console.warn(`⚠️ Warning during CREATE DATABASE check (database may already exist or user lacks CREATE DATABASE privilege): ${err.message}`);
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
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`nama\` VARCHAR(100) NOT NULL,
        \`tingkat\` VARCHAR(20) NOT NULL,
        \`jurusan\` VARCHAR(50) NOT NULL,
        \`waliKelas\` VARCHAR(100),
        \`kapasitas\` INT DEFAULT 36,
        \`kuotaTerisi\` INT DEFAULT 0,
        \`ruang\` VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: siswa
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`siswa\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`nomorDaftarUlang\` VARCHAR(100) NOT NULL UNIQUE,
        \`nik\` VARCHAR(50) NOT NULL,
        \`nama\` VARCHAR(150) NOT NULL,
        \`jenisKelamin\` VARCHAR(20) NOT NULL,
        \`tempatLahir\` VARCHAR(100),
        \`tanggalLahir\` VARCHAR(50),
        \`asalSekolah\` VARCHAR(150),
        \`namaOrangTua\` VARCHAR(150),
        \`nomorHp\` VARCHAR(50),
        \`kelasId\` VARCHAR(50),
        \`namaKelas\` VARCHAR(100),
        \`statusPengumuman\` VARCHAR(50) DEFAULT 'Sudah Diumumkan'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: pengguna
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`pengguna\` (
        \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
        \`nama\` VARCHAR(150) NOT NULL,
        \`username\` VARCHAR(100) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`role\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(20) DEFAULT 'Aktif',
        \`terakhirLogin\` VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table: pengaturan
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`pengaturan\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`namaSekolah\` VARCHAR(200),
        \`tahunAjaran\` VARCHAR(50),
        \`statusPengumuman\` TINYINT(1) DEFAULT 1,
        \`pesanSistem\` TEXT,
        \`nomorSurat\` VARCHAR(100),
        \`headerKop1\` VARCHAR(200),
        \`headerKop2\` VARCHAR(200),
        \`alamatSekolah\` TEXT,
        \`kontakSekolah\` VARCHAR(100),
        \`emailSekolah\` VARCHAR(100),
        \`websiteSekolah\` VARCHAR(150),
        \`namaKepalaSekolah\` VARCHAR(150),
        \`nipKepalaSekolah\` VARCHAR(100),
        \`namaKetuaPanitia\` VARCHAR(150),
        \`nipKetuaPanitia\` VARCHAR(100),
        \`tanggalPengumuman\` VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default admin user if table empty
    const [users]: any = await db.query(`SELECT COUNT(*) as count FROM \`pengguna\`;`);
    if (users[0]?.count === 0) {
      await db.query(`
        INSERT INTO \`pengguna\` (\`id\`, \`nama\`, \`username\`, \`password\`, \`role\`, \`status\`, \`terakhirLogin\`)
        VALUES ('usr-1', 'Administrator Utama', 'admin', 'admin123', 'Super Admin', 'Aktif', 'Baru Saja');
      `);
      console.log('✅ Default super admin created: username "admin", password "admin123"');
    }

    // Seed default settings if table empty
    const [settings]: any = await db.query(`SELECT COUNT(*) as count FROM \`pengaturan\`;`);
    if (settings[0]?.count === 0) {
      await db.query(`
        INSERT INTO \`pengaturan\` 
        (\`namaSekolah\`, \`tahunAjaran\`, \`statusPengumuman\`, \`pesanSistem\`, \`nomorSurat\`, \`headerKop1\`, \`headerKop2\`, \`alamatSekolah\`, \`kontakSekolah\`, \`emailSekolah\`, \`websiteSekolah\`, \`namaKepalaSekolah\`, \`nipKepalaSekolah\`, \`namaKetuaPanitia\`, \`nipKetuaPanitia\`, \`tanggalPengumuman\`)
        VALUES 
        ('MA NU 01 BANYUPUTIH', '2026/2027', 1, 'Pengumuman pembagian kelas siswa baru telah resmi dibuka.', '421.3/PAN-PPDB/2026005/2026', 'YAYASAN PENDIDIKAN MA NU 01 BANYUPUTIH', 'PENERIMAAN PESERTA DIDIK BARU (PPDB)', 'Jl. Merdeka No. 45, Kecamatan Nusantara, Kota Pendidikan, Jawa Barat', '(021) 7890-1234', 'info@sman1garuda.sch.id', 'www.sman1garuda.sch.id', 'H. Ahmad Syukri, S.Pd., M.Pd.', '19750812 200003 1 002', 'Siti Nurhaliza, S.E., M.Pd.', '19820415 200801 2 005', '22 Juli 2026');
      `);
      console.log('✅ Default settings initialized in MySQL.');
    }

    console.log('🚀 MySQL tables created & synced successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize MySQL database:', error);
    return false;
  }
}
