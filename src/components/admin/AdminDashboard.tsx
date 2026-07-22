import React from 'react';
import { Student, ClassData, AppSettings } from '../../types';
import { 
  Users, 
  School, 
  UserCheck, 
  BarChart3, 
  FileSpreadsheet, 
  Plus, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  classes: ClassData[];
  settings: AppSettings;
  onNavigate: (tab: string) => void;
  onOpenImportModal: () => void;
  onOpenAddStudentModal: () => void;
  onOpenPrintReportModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  classes,
  settings,
  onNavigate,
  onOpenImportModal,
  onOpenAddStudentModal,
  onOpenPrintReportModal
}) => {
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const maleCount = students.filter(s => s.jenisKelamin === 'L').length;
  const femaleCount = students.filter(s => s.jenisKelamin === 'P').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tahun Ajaran {settings.tahunAjaran}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
            Sistem Informasi Pembagian Kelas Siswa Baru
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Gunakan panel ini untuk mengelola data alokasi kelas, impor data massal dari Excel, pengelolaan wali kelas, serta mencetak bukti pengumuman.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenAddStudentModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Tambah Siswa</span>
          </button>
          <button
            onClick={onOpenImportModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl border border-emerald-500/50 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Siswa */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Siswa Baru</span>
            <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500 ml-2">Siswa terdaftar</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>L: <strong className="text-slate-800">{maleCount}</strong> | P: <strong className="text-slate-800">{femaleCount}</strong></span>
            <span className="text-emerald-600 font-semibold">100% Terinput</span>
          </div>
        </div>

        {/* Card 2: Total Kelas */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Rombongan Belajar</span>
            <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <School className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-500 ml-2">Kelas/Rombel</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Rata-rata: <strong className="text-slate-800">{totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0} siswa</strong></span>
            <button onClick={() => onNavigate('kelas')} className="text-blue-600 font-semibold hover:underline">Kelola →</button>
          </div>
        </div>

        {/* Card 3: Wali Kelas Assigned */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Wali Kelas</span>
            <div className="p-2 sm:p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-500 ml-2">Guru Terplot</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-purple-600 font-semibold">100% Wali Terisi</span>
            <button onClick={() => onNavigate('kelas')} className="text-purple-600 font-semibold hover:underline">Detail →</button>
          </div>
        </div>

        {/* Card 4: Status Pengumuman */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Akses Pengumuman</span>
            <div className={`p-2 sm:p-2.5 rounded-xl ${settings.statusPengumuman ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className={`text-base sm:text-lg font-bold ${settings.statusPengumuman ? 'text-emerald-700' : 'text-rose-700'}`}>
              {settings.statusPengumuman ? 'DIBUKA PUBLIC' : 'DITUTUP ADMIN'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Akses Siswa</span>
            <button onClick={() => onNavigate('laporan')} className="text-slate-700 font-semibold hover:underline">Pengaturan →</button>
          </div>
        </div>

      </div>

      {/* Main Grid Section: Distribution per Class & Quick Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3): Class Capacity & Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800">Distribusi Siswa Per Kelas</h3>
              <p className="text-xs text-slate-500">Jumlah siswa terdaftar dibanding kuota kelas</p>
            </div>
            <button
              onClick={() => onNavigate('siswa')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Lihat Semua Siswa</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {classes.map((cls) => {
              const countInClass = students.filter(s => s.kelas.toLowerCase() === cls.namaKelas.toLowerCase()).length;
              const malesInClass = students.filter(s => s.kelas.toLowerCase() === cls.namaKelas.toLowerCase() && s.jenisKelamin === 'L').length;
              const femalesInClass = students.filter(s => s.kelas.toLowerCase() === cls.namaKelas.toLowerCase() && s.jenisKelamin === 'P').length;
              const percent = Math.min(Math.round((countInClass / (cls.kuota || 36)) * 100), 100);

              return (
                <div key={cls.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{cls.namaKelas}</span>
                      <span className="text-slate-500 ml-2">• Wali: {cls.waliKelas}</span>
                    </div>
                    <div className="font-bold text-slate-700">
                      {countInClass} / {cls.kuota} <span className="text-slate-400 font-normal">Siswa</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Laki-Laki: <strong className="text-slate-700">{malesInClass}</strong> | Perempuan: <strong className="text-slate-700">{femalesInClass}</strong></span>
                    <span className="text-slate-400 font-mono">Ruangan: {cls.ruang}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1/3): Quick Actions & School Info */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">
              Tindakan Cepat Admin
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={onOpenImportModal}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 flex items-center justify-between text-xs font-bold transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Import Data Excel Massal</p>
                    <p className="text-[10px] text-slate-500 font-normal">Unggah file .xlsx / .csv siswa baru</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={onOpenAddStudentModal}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 flex items-center justify-between text-xs font-bold transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Input Siswa Manual</p>
                    <p className="text-[10px] text-slate-500 font-normal">Tambah data siswa satu per satu</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </button>

              <button
                onClick={onOpenPrintReportModal}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-between text-xs font-bold transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Cetak Rekapitulasi Laporan</p>
                    <p className="text-[10px] text-slate-500 font-normal">Cetak daftar pembagian kelas resmi</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800" />
              </button>
            </div>
          </div>

          {/* School Details Info Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Kop & Identitas Sekolah</span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p className="font-bold text-white text-sm">{settings.namaSekolah}</p>
              <p className="text-[11px] text-slate-400">{settings.alamatSekolah}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Kepala Sekolah: {settings.namaKepalaSekolah}</p>
            </div>
            <button
              onClick={() => onNavigate('laporan')}
              className="w-full text-center py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-emerald-300 transition-colors"
            >
              Ubah Identitas Sekolah
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
