import React, { useState } from 'react';
import { Student, AppSettings, ClassData } from '../../types';
import { 
  Search, 
  School, 
  UserCheck, 
  Calendar, 
  MapPin, 
  User, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  ShieldAlert, 
  ArrowRight,
  Info,
  Phone,
  HelpCircle,
  Lock
} from 'lucide-react';
import { PrintableClassCard } from './PrintableClassCard';
import { showErrorAlert, showSuccessToast, showInfoToast } from '../../lib/swal';

interface StudentAnnouncementProps {
  students: Student[];
  classes: ClassData[];
  settings: AppSettings;
  onOpenAdminLogin: () => void;
}

export const StudentAnnouncement: React.FC<StudentAnnouncementProps> = ({
  students,
  classes,
  settings,
  onOpenAdminLogin
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Quick sample DU chips for rapid testing
  const sampleDUs = students.slice(0, 5).map(s => s.nomorDU);

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchInput).trim();

    if (!query) {
      showErrorAlert('Nomor DU Kosong', 'Silakan masukkan Nomor Daftar Ulang (DU) atau NIK Anda.');
      return;
    }

    setIsSearching(true);
    setFoundStudent(null);

    // Simulate search delay for smooth loading feel
    setTimeout(() => {
      setIsSearching(false);
      const cleanedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');

      const result = students.find(s => {
        const duClean = s.nomorDU.toLowerCase().replace(/[^a-z0-9]/g, '');
        const nikClean = s.nik.toLowerCase().replace(/[^a-z0-9]/g, '');
        return duClean === cleanedQuery || nikClean === cleanedQuery || s.nomorDU.toLowerCase() === query.toLowerCase();
      });

      if (result) {
        setFoundStudent(result);
        showSuccessToast(`Data ditemukan! Selamat kepada ${result.nama}`);
      } else {
        showErrorAlert(
          'Data Tidak Ditemukan',
          `Nomor DU / NIK "${query}" tidak ditemukan dalam sistem. Pastikan nomor yang Anda masukkan sudah benar.`
        );
      }
    }, 400);
  };

  const handleQuickChipClick = (duNumber: string) => {
    setSearchInput(duNumber);
    handleSearch(undefined, duNumber);
  };

  const foundClassDetail = foundStudent
    ? classes.find(c => c.namaKelas.toLowerCase() === foundStudent.kelas.toLowerCase())
    : undefined;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 p-1 overflow-hidden shrink-0">
            {settings.logoSekolah ? (
              <img src={settings.logoSekolah} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <School className="w-6 h-6" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight text-white tracking-wide">
              {settings.namaSekolah}
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium">
              Pengumuman Pembagian Kelas TA {settings.tahunAjaran}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAdminLogin}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Portal Admin</span>
          <span className="sm:hidden">Admin</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center my-4">
        
        {/* Banner Hero Title */}
        <div className="text-center max-w-2xl mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Sistem Pengumuman Hasil Pembagian Kelas</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Cek Pembagian Kelas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Siswa Baru</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {settings.pesanSambutan}
          </p>
        </div>

        {/* If Announcement Status is CLOSED by Admin */}
        {!settings.statusPengumuman ? (
          <div className="w-full max-w-xl bg-slate-800/90 border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/40 rounded-full flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Pengumuman Belum Dibuka</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {settings.pesanPengumumanTutup}
            </p>
            <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Panitia PPDB: {settings.telepon}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{settings.namaSekolah}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search Box Form */}
            {!foundStudent ? (
              <div className="w-full max-w-xl bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md mb-6">
                <form onSubmit={(e) => handleSearch(e)} className="space-y-4">
                  <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
                    Masukkan Nomor Daftar Ulang (DU) atau NIK
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Contoh: DU-2026-001 atau 320102150..."
                      className="w-full bg-slate-900 border-2 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 pr-28 font-mono text-sm sm:text-base uppercase tracking-wider outline-hidden transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="absolute right-2 top-2 bottom-2 px-4 sm:px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Cek Kelas</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Interactive Sample DU Chips */}
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>Klik contoh Nomor DU di bawah untuk pencarian cepat:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleDUs.map((du) => (
                        <button
                          key={du}
                          type="button"
                          onClick={() => handleQuickChipClick(du)}
                          className="px-2.5 py-1.5 bg-slate-700/60 hover:bg-blue-600/30 hover:border-blue-500/50 border border-slate-600 rounded-lg text-xs font-mono text-slate-300 hover:text-blue-300 transition-all active:scale-95"
                        >
                          {du}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              /* DEDICATED FULL-PAGE RESULT VIEW */
              <div className="w-full max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                
                {/* Back to Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-xl">
                  <button
                    onClick={() => {
                      setFoundStudent(null);
                      setSearchInput('');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-600"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 text-blue-400" />
                    <span>Kembali ke Halaman Pencarian</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Nomor DU: <strong className="font-mono text-blue-400">{foundStudent.nomorDU}</strong></span>
                  </div>
                </div>

                {/* Main Result Card */}
                <div className="bg-slate-800/90 border-2 border-blue-500/50 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                  
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                          STATUS VERIFIKASI PPDB
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                          DITERIMA & DIALOKASIKAN
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold rounded-lg self-start sm:self-auto">
                      {settings.tahunAjaran}
                    </span>
                  </div>

                  {/* Complete Student Data Grid - Displayed First for Verification */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span>Identitas Siswa Terdaftar (Konfirmasi Data Diri)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80">
                      <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <p className="text-slate-400 text-[11px] font-medium">Nama Lengkap</p>
                        <p className="text-white font-bold text-sm uppercase">{foundStudent.nama}</p>
                      </div>

                      <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <p className="text-slate-400 text-[11px] font-medium">Nomor Daftar Ulang (DU)</p>
                        <p className="text-blue-400 font-mono font-bold text-sm">{foundStudent.nomorDU}</p>
                      </div>

                      <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <p className="text-slate-400 text-[11px] font-medium">NIK Siswa</p>
                        <p className="text-slate-200 font-mono font-semibold">{foundStudent.nik}</p>
                      </div>

                      <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <p className="text-slate-400 text-[11px] font-medium">Jenis Kelamin</p>
                        <p className="text-slate-200 font-semibold">
                          {foundStudent.jenisKelamin === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}
                        </p>
                      </div>

                      <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800 sm:col-span-2 lg:col-span-2">
                        <p className="text-slate-400 text-[11px] font-medium">Tempat, Tanggal Lahir</p>
                        <p className="text-slate-200 font-semibold">{foundStudent.tempatLahir}, {foundStudent.tanggalLahir}</p>
                      </div>

                      {foundStudent.catatan && (
                        <div className="sm:col-span-2 lg:col-span-3 bg-blue-950/30 p-3 rounded-xl border border-blue-900/50">
                          <p className="text-blue-400 text-[11px] font-medium">Catatan / Jalur PPDB</p>
                          <p className="text-slate-200 italic font-medium">{foundStudent.catatan}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Big Highlight Allocation Box - Displayed below Student Identity */}
                  <div className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/80 border-2 border-blue-500/40 rounded-2xl p-5 sm:p-8 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
                    
                    <p className="text-xs uppercase font-bold text-blue-400 tracking-widest mb-1">
                      HASIL PEMBAGIAN KELAS
                    </p>
                    <div className="text-3xl sm:text-5xl font-black text-white tracking-wider my-2">
                      {foundStudent.kelas}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-300 text-left sm:text-center">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Wali Kelas</span>
                        <strong className="text-white text-sm">{foundStudent.waliKelas}</strong>
                      </div>
                      {foundClassDetail && (
                        <>
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Lokasi Ruangan</span>
                            <strong className="text-blue-300 text-sm">{foundClassDetail.ruang}</strong>
                          </div>
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 col-span-1 sm:col-span-2 md:col-span-1">
                            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Kapasitas Kelas</span>
                            <strong className="text-emerald-400 text-sm">{foundClassDetail.jumlahSiswa} / {foundClassDetail.kuota} Siswa</strong>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Notice & Instructions Box */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Petunjuk Penting Untuk Siswa Baru:</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1 leading-relaxed">
                      <li>Silakan cetak atau simpan <strong>Surat Keterangan Pembagian Kelas</strong> sebagai bukti saat orientasi sekolah/MPLS.</li>
                      <li>Hadir tepat waktu sesuai jadwal pengarahan wali kelas masing-masing.</li>
                      <li>Jika terdapat kekeliruan data, hubungi sekretariat PPDB di {settings.telepon}.</li>
                    </ul>
                  </div>

                  {/* Mobile-Responsive Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950 transition-all active:scale-95"
                    >
                      <Printer className="w-4 h-4 text-blue-200" />
                      <span>Cetak Surat Pembagian Kelas (PDF)</span>
                    </button>

                    <button
                      onClick={() => {
                        setFoundStudent(null);
                        setSearchInput('');
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition-all text-center border border-slate-600 active:scale-95"
                    >
                      Cari Nomor DU Lain
                    </button>
                  </div>

                </div>

              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
        <p className="font-semibold text-slate-400">{settings.namaSekolah}</p>
        <p className="mt-1">{settings.alamatSekolah} | Telp: {settings.telepon}</p>
        <p className="mt-2 text-[10px] text-slate-600">
          © {new Date().getFullYear()} Sistem Pengumuman Pembagian Kelas Siswa Baru. Hak Cipta Dilindungi.
        </p>
      </footer>

      {/* Printable Card Modal */}
      {showPrintModal && foundStudent && (
        <PrintableClassCard
          student={foundStudent}
          settings={settings}
          classDetail={foundClassDetail}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
