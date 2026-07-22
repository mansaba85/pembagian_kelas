-- File Schema MySQL untuk Sistem Pengumuman Pembagian Kelas MA NU 01 BANYUPUTIH
-- Dapat di-import langsung di phpMyAdmin aaPanel jika dibutuhkan

CREATE DATABASE IF NOT EXISTS `kelasku_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kelasku_db`;

-- Tabel: kelas
CREATE TABLE IF NOT EXISTS `kelas` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `namaKelas` VARCHAR(100) NOT NULL,
  `ruang` VARCHAR(100),
  `waliKelas` VARCHAR(150),
  `nipWaliKelas` VARCHAR(100),
  `kuota` INT DEFAULT 36,
  `keterangan` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: siswa
CREATE TABLE IF NOT EXISTS `siswa` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `nomorDU` VARCHAR(100) NOT NULL,
  `nik` VARCHAR(50) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `jenisKelamin` VARCHAR(10) NOT NULL,
  `tempatLahir` VARCHAR(100),
  `tanggalLahir` VARCHAR(50),
  `kelas` VARCHAR(100),
  `catatan` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: pengguna
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `email` VARCHAR(150),
  `role` VARCHAR(50) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Aktif',
  `terakhirLogin` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: pengaturan
CREATE TABLE IF NOT EXISTS `pengaturan` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `namaSekolah` VARCHAR(200),
  `npsn` VARCHAR(50),
  `alamatSekolah` TEXT,
  `telepon` VARCHAR(100),
  `emailSekolah` VARCHAR(100),
  `website` VARCHAR(150),
  `tahunAjaran` VARCHAR(50),
  `statusPengumuman` TINYINT(1) DEFAULT 1,
  `pesanPengumumanTutup` TEXT,
  `pesanSambutan` TEXT,
  `namaKepalaSekolah` VARCHAR(150),
  `nipKepalaSekolah` VARCHAR(100),
  `tanggalPengumuman` VARCHAR(100),
  `kotaSekolah` VARCHAR(100),
  `logoSekolah` LONGTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
