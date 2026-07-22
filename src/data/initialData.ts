import { Student, ClassData, UserAdmin, AppSettings } from '../types';

export const initialAppSettings: AppSettings = {
  namaSekolah: 'MA NU 01 Banyuputih',
  npsn: '20363291',
  alamatSekolah: 'Jl. Lapangan Srikandi Banyuputih, Kec. Banyuputih, Kab. Batang, Jawa Tengah',
  telepon: '(0285) 4483-201',
  emailSekolah: 'info@manu01banyuputih.sch.id',
  website: 'www.manu01banyuputih.sch.id',
  tahunAjaran: '2026/2027',
  statusPengumuman: true,
  pesanPengumumanTutup: 'Pengumuman Hasil Pembagian Kelas Siswa Baru Tahun Ajaran 2026/2027 MA NU 01 Banyuputih saat ini sedang dalam proses sinkronisasi panitia PPDB. Silakan cek kembali sesuai jadwal yang telah ditentukan.',
  pesanSambutan: 'Selamat Datang di Portal Pengumuman Hasil Pembagian Kelas Peserta Didik Baru MA NU 01 Banyuputih.',
  namaKepalaSekolah: 'H. Ahmad Mufid, S.Ag., M.Pd.I.',
  nipKepalaSekolah: '19720512 199903 1 002',
  tanggalPengumuman: '2026-07-20',
  kotaSekolah: 'Batang',
  logoSekolah: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80'
};

export const initialClasses: ClassData[] = [
  {
    id: 'cls-1',
    namaKelas: 'X-IPA 1',
    ruang: 'Gedung Utama Lt. 2 - R. 201',
    waliKelas: 'Dra. Endang Sri Wahyuni, M.Si.',
    nipWaliKelas: '19750812 200112 2 001',
    kuota: 36,
    keterangan: 'Kelas Unggulan IPA Sains & Teknologi'
  },
  {
    id: 'cls-2',
    namaKelas: 'X-IPA 2',
    ruang: 'Gedung Utama Lt. 2 - R. 202',
    waliKelas: 'Bambang Sukoco, S.Pd., M.T.',
    nipWaliKelas: '19800405 200501 1 004',
    kuota: 36,
    keterangan: 'Kelas IPA Riset & Eksperimen'
  },
  {
    id: 'cls-3',
    namaKelas: 'X-IPS 1',
    ruang: 'Gedung Timur Lt. 1 - R. 104',
    waliKelas: 'Siti Nurhaliza, S.E., M.Pd.',
    nipWaliKelas: '19831119 200804 2 003',
    kuota: 36,
    keterangan: 'Kelas IPS Ekonomi & Bisnis Digital'
  },
  {
    id: 'cls-4',
    namaKelas: 'X-IPS 2',
    ruang: 'Gedung Timur Lt. 1 - R. 105',
    waliKelas: 'Ahmad Fauzi, S.Sos., M.Si.',
    nipWaliKelas: '19790228 200312 1 002',
    kuota: 36,
    keterangan: 'Kelas IPS Sosial & Humaniora'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-001',
    nomorDU: 'DU-2026-001',
    nik: '3201021504100001',
    nama: 'Aditya Pratama Putra',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2010-04-15',
    kelas: 'X-IPA 1',
    waliKelas: 'Dra. Endang Sri Wahyuni, M.Si.',
    catatan: 'Siswa Berprestasi Jalur Zonasi Utama'
  },
  {
    id: 'std-002',
    nomorDU: 'DU-2026-002',
    nik: '3201025208100003',
    nama: 'Anindya Putri Lestari',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2010-08-12',
    kelas: 'X-IPA 1',
    waliKelas: 'Dra. Endang Sri Wahyuni, M.Si.',
    catatan: 'Peserta OSN Matematika SMP'
  },
  {
    id: 'std-003',
    nomorDU: 'DU-2026-003',
    nik: '3201021901100002',
    nama: 'Bagus Setyo Nugroho',
    jenisKelamin: 'L',
    tempatLahir: 'Surakarta',
    tanggalLahir: '2010-01-19',
    kelas: 'X-IPA 2',
    waliKelas: 'Bambang Sukoco, S.Pd., M.T.',
    catatan: 'Ketua OSIS SMP Negeri 1'
  },
  {
    id: 'std-004',
    nomorDU: 'DU-2026-004',
    nik: '3201026511100004',
    nama: 'Citra Kirana Dewi',
    jenisKelamin: 'P',
    tempatLahir: 'Bogor',
    tanggalLahir: '2010-11-25',
    kelas: 'X-IPA 2',
    waliKelas: 'Bambang Sukoco, S.Pd., M.T.',
    catatan: 'Anggota Paskibra Sekolah'
  },
  {
    id: 'std-005',
    nomorDU: 'DU-2026-005',
    nik: '3201020303100005',
    nama: 'Daffa Rizky Maulana',
    jenisKelamin: 'L',
    tempatLahir: 'Depok',
    tanggalLahir: '2010-03-03',
    kelas: 'X-IPS 1',
    waliKelas: 'Siti Nurhaliza, S.E., M.Pd.',
    catatan: 'Jalur Prestasi Olahraga Basket'
  },
  {
    id: 'std-006',
    nomorDU: 'DU-2026-006',
    nik: '3201024707100006',
    nama: 'Eka Nur Wahyuni',
    jenisKelamin: 'P',
    tempatLahir: 'Bekasi',
    tanggalLahir: '2010-07-07',
    kelas: 'X-IPS 1',
    waliKelas: 'Siti Nurhaliza, S.E., M.Pd.',
    catatan: 'Peraih Juara Debat Bahasa Inggris'
  },
  {
    id: 'std-007',
    nomorDU: 'DU-2026-007',
    nik: '3201021409100007',
    nama: 'Farel Ardiansyah',
    jenisKelamin: 'L',
    tempatLahir: 'Semarang',
    tanggalLahir: '2010-09-14',
    kelas: 'X-IPS 2',
    waliKelas: 'Ahmad Fauzi, S.Sos., M.Si.',
    catatan: 'Jalur Zonasi Terdekat'
  },
  {
    id: 'std-008',
    nomorDU: 'DU-2026-008',
    nik: '3201025010100008',
    nama: 'Gita Gutawa Rahayu',
    jenisKelamin: 'P',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '2010-10-10',
    kelas: 'X-IPS 2',
    waliKelas: 'Ahmad Fauzi, S.Sos., M.Si.',
    catatan: 'Juara Paduan Suara'
  },
  {
    id: 'std-009',
    nomorDU: 'DU-2026-009',
    nik: '3201022202100009',
    nama: 'Hafiz Muhammad Akbar',
    jenisKelamin: 'L',
    tempatLahir: 'Malang',
    tanggalLahir: '2010-02-22',
    kelas: 'X-IPA 1',
    waliKelas: 'Dra. Endang Sri Wahyuni, M.Si.',
    catatan: 'Penerima Beasiswa Prestasi'
  },
  {
    id: 'std-010',
    nomorDU: 'DU-2026-010',
    nik: '3201026112100010',
    nama: 'Indah Permata Sari',
    jenisKelamin: 'P',
    tempatLahir: 'Tangerang',
    tanggalLahir: '2010-12-21',
    kelas: 'X-IPA 2',
    waliKelas: 'Bambang Sukoco, S.Pd., M.T.',
    catatan: 'Anggota Pramuka Bantara'
  },
  {
    id: 'std-011',
    nomorDU: 'DU-2026-011',
    nik: '3201020506100011',
    nama: 'Julian Arifin',
    jenisKelamin: 'L',
    tempatLahir: 'Cirebon',
    tanggalLahir: '2010-06-05',
    kelas: 'X-IPS 1',
    waliKelas: 'Siti Nurhaliza, S.E., M.Pd.',
    catatan: 'Jalur Reguler'
  },
  {
    id: 'std-012',
    nomorDU: 'DU-2026-012',
    nik: '3201024305100012',
    nama: 'Kayla Az-Zahra',
    jenisKelamin: 'P',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2010-05-03',
    kelas: 'X-IPS 2',
    waliKelas: 'Ahmad Fauzi, S.Sos., M.Si.',
    catatan: 'Hafizah Al-Qur\'an 5 Juz'
  }
];

export const initialUsers: UserAdmin[] = [
  {
    id: 'usr-001',
    nama: 'Drs. Hendra Gunawan',
    username: 'admin',
    email: 'hendra.admin@sman1garuda.sch.id',
    role: 'Super Admin',
    status: 'Aktif',
    terakhirLogin: '2026-07-21 18:45'
  },
  {
    id: 'usr-002',
    nama: 'Rina Kusuma, S.Kom.',
    username: 'panitia',
    email: 'rina.panitia@sman1garuda.sch.id',
    role: 'Petugas Admin',
    status: 'Aktif',
    terakhirLogin: '2026-07-21 14:20'
  },
  {
    id: 'usr-003',
    nama: 'Dra. Endang Sri Wahyuni',
    username: 'walikelas1',
    email: 'endang.sw@sman1garuda.sch.id',
    role: 'Wali Kelas',
    status: 'Aktif',
    terakhirLogin: '2026-07-20 09:15'
  }
];
