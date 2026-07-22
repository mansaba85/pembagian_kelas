import React, { useState } from 'react';
import { AppSettings, Student, ClassData } from '../../types';
import { 
  FileText, 
  Save, 
  Printer, 
  ToggleLeft, 
  ToggleRight, 
  School, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Info,
  ShieldAlert,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { confirmAction, showSuccessToast, showErrorAlert } from '../../lib/swal';
import { PrintableReportModal } from './PrintableReportModal';

interface PengaturanLaporanProps {
  settings: AppSettings;
  students: Student[];
  classes: ClassData[];
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const PengaturanLaporan: React.FC<PengaturanLaporanProps> = ({
  settings,
  students,
  classes,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleChange = (field: keyof AppSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleStatus = async () => {
    const nextStatus = !formData.statusPengumuman;
    const confirmed = await confirmAction({
      title: nextStatus ? 'Buka Pengumuman Siswa?' : 'Tutup Pengumuman Siswa?',
      text: nextStatus 
        ? 'Siswa akan dapat melakukan pencarian hasil pembagian kelas menggunakan Nomor DU mereka.'
        : 'Halaman pencarian akan menampilkan pesan pengumuman ditutup.',
      icon: 'question',
      confirmButtonText: nextStatus ? 'Ya, Buka Akses Public' : 'Ya, Tutup Akses'
    });

    if (confirmed) {
      const updated = { ...formData, statusPengumuman: nextStatus };
      setFormData(updated);
      onSaveSettings(updated);
      showSuccessToast(`Akses pengumuman berhasil ${nextStatus ? 'DIBUKA' : 'DITUTUP'}.`);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showErrorAlert('Format tidak valid', 'Silakan pilih berkas gambar (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showErrorAlert('Ukuran Terlalu Besar', 'Maksimal ukuran gambar logo adalah 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, logoSekolah: base64 }));
      showSuccessToast('Logo sekolah berhasil diunggah!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoSekolah: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    showSuccessToast('Pengaturan laporan & identitas sekolah berhasil disimpan!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Action & Announcement Control Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              formData.statusPengumuman ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {formData.statusPengumuman ? 'PENGUMUMAN DIBUKA' : 'PENGUMUMAN DITUTUP'}
            </span>
            <span className="text-xs text-slate-500">• Publik / Siswa</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Akses Portal Pengumuman Pembagian Kelas</h2>
          <p className="text-xs text-slate-500">Atur ketersediaan pencarian nomor DU di halaman depan siswa.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
              formData.statusPengumuman
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {formData.statusPengumuman ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{formData.statusPengumuman ? 'Tutup Pengumuman' : 'Buka Pengumuman'}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        
        {/* Section 1: School Kop Details & Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <School className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Identitas Sekolah, Logo & Kop Surat</h3>
          </div>

          {/* Logo Upload Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white border border-slate-300 rounded-2xl flex items-center justify-center p-2 shadow-xs shrink-0 relative overflow-hidden">
                {formData.logoSekolah ? (
                  <img 
                    src={formData.logoSekolah} 
                    alt="Logo Sekolah" 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                    <span className="text-[10px]">Tanpa Logo</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900">Logo Resmi Sekolah</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Logo ini akan tampil pada Kop Surat Keterangan Pembagian Kelas, Laporan Rekapitulasi, dan Portal Pengumuman Siswa.
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Format: PNG, JPG, WEBP, SVG (Maks. 2MB)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <label className="cursor-pointer px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 w-full sm:w-auto">
                <Upload className="w-4 h-4" />
                <span>Unggah Logo</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden" 
                />
              </label>

              {formData.logoSekolah && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="block font-semibold text-slate-700">Nama Sekolah Resmi *</label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => handleChange('namaSekolah', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">NPSN Sekolah</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1 sm:col-span-3">
              <label className="block font-semibold text-slate-700">Alamat Sekolah Lengkap</label>
              <input
                type="text"
                value={formData.alamatSekolah}
                onChange={(e) => handleChange('alamatSekolah', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Nomor Telepon</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => handleChange('telepon', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Email Sekolah</label>
              <input
                type="email"
                value={formData.emailSekolah}
                onChange={(e) => handleChange('emailSekolah', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Website Resmi</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Year & Principal Signature Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Pengesahan Surat & Kepala Sekolah</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Tahun Ajaran *</label>
              <input
                type="text"
                required
                value={formData.tahunAjaran}
                onChange={(e) => handleChange('tahunAjaran', e.target.value)}
                placeholder="2026/2027"
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Kota Lokasi Sekolah</label>
              <input
                type="text"
                value={formData.kotaSekolah}
                onChange={(e) => handleChange('kotaSekolah', e.target.value)}
                placeholder="Kota Pendidikan"
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Nama Kepala Sekolah *</label>
              <input
                type="text"
                required
                value={formData.namaKepalaSekolah}
                onChange={(e) => handleChange('namaKepalaSekolah', e.target.value)}
                placeholder="Drs. H. Mulyadi Pratama, M.Pd."
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block font-semibold text-slate-700">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                placeholder="19680315 199203 1 005"
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Messages Notice for Public */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Pesan Pengumuman & Teks Portal Public</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Pesan Sambutan Halaman Utama</label>
              <input
                type="text"
                value={formData.pesanSambutan}
                onChange={(e) => handleChange('pesanSambutan', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Pesan Pemberitahuan Saat Pengumuman DITUTUP</label>
              <textarea
                rows={3}
                value={formData.pesanPengumumanTutup}
                onChange={(e) => handleChange('pesanPengumumanTutup', e.target.value)}
                className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>

      </form>

      {/* Report Modal */}
      {showReportModal && (
        <PrintableReportModal
          students={students}
          classes={classes}
          settings={formData}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
};
