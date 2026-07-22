export interface Student {
  id: string;
  nomorDU: string;
  nik: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  kelas: string;
  waliKelas: string;
  catatan?: string;
}

export interface ClassData {
  id: string;
  namaKelas: string;
  ruang: string;
  waliKelas: string;
  nipWaliKelas: string;
  kuota: number;
  keterangan?: string;
}

export interface UserAdmin {
  id: string;
  nama: string;
  username: string;
  email?: string;
  role: 'Super Admin' | 'Petugas Admin' | 'Wali Kelas';
  status: 'Aktif' | 'Nonaktif';
  terakhirLogin: string;
}

export interface AppSettings {
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  telepon: string;
  emailSekolah: string;
  website: string;
  tahunAjaran: string;
  statusPengumuman: boolean; // true = Buka, false = Tutup
  pesanPengumumanTutup: string;
  pesanSambutan: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tanggalPengumuman: string;
  kotaSekolah: string;
  logoSekolah?: string;
}

export interface ExcelImportRow {
  nama?: string;
  'Nama Lengkap'?: string;
  jenisKelamin?: string;
  'Jenis Kelamin'?: string;
  tempatLahir?: string;
  'Tempat Lahir'?: string;
  tanggalLahir?: string;
  'Tanggal Lahir'?: string;
  nomorDU?: string;
  'Nomor DU'?: string;
  nik?: string;
  NIK?: string;
  kelas?: string;
  'Kelas'?: string;
  waliKelas?: string;
  'Wali Kelas'?: string;
}
