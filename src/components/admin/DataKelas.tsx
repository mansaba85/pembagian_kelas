import React, { useState } from 'react';
import { ClassData, Student } from '../../types';
import { 
  School, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  UserCheck, 
  MapPin, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { confirmDelete, showSuccessToast, showErrorAlert } from '../../lib/swal';

interface DataKelasProps {
  classes: ClassData[];
  students: Student[];
  onAddClass: (cls: ClassData) => void;
  onUpdateClass: (cls: ClassData) => void;
  onDeleteClass: (id: string) => void;
}

export const DataKelas: React.FC<DataKelasProps> = ({
  classes,
  students,
  onAddClass,
  onUpdateClass,
  onDeleteClass
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);

  // Form State
  const [namaKelas, setNamaKelas] = useState('');
  const [ruang, setRuang] = useState('');
  const [waliKelas, setWaliKelas] = useState('');
  const [nipWaliKelas, setNipWaliKelas] = useState('');
  const [kuota, setKuota] = useState(36);
  const [keterangan, setKeterangan] = useState('');

  const filteredClasses = classes.filter(c => 
    c.namaKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.waliKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ruang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingClass(null);
    setNamaKelas('');
    setRuang('');
    setWaliKelas('');
    setNipWaliKelas('');
    setKuota(36);
    setKeterangan('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassData) => {
    setEditingClass(cls);
    setNamaKelas(cls.namaKelas);
    setRuang(cls.ruang);
    setWaliKelas(cls.waliKelas);
    setNipWaliKelas(cls.nipWaliKelas);
    setKuota(cls.kuota);
    setKeterangan(cls.keterangan || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (cls: ClassData) => {
    const studentCount = students.filter(s => s.kelas.toLowerCase() === cls.namaKelas.toLowerCase()).length;
    if (studentCount > 0) {
      showErrorAlert(
        'Kelas Tidak Dapat Dihapus',
        `Masih terdapat ${studentCount} siswa teralokasi pada kelas ${cls.namaKelas}. Silakan ubah atau hapus data siswa terlebih dahulu.`
      );
      return;
    }

    const confirmed = await confirmDelete(`Kelas ${cls.namaKelas}`);
    if (confirmed) {
      onDeleteClass(cls.id);
      showSuccessToast(`Kelas ${cls.namaKelas} berhasil dihapus.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaKelas.trim() || !waliKelas.trim()) {
      showErrorAlert('Form Tidak Lengkap', 'Nama Kelas dan Nama Wali Kelas wajib diisi.');
      return;
    }

    if (editingClass) {
      const updated: ClassData = {
        ...editingClass,
        namaKelas: namaKelas.trim(),
        ruang: ruang.trim(),
        waliKelas: waliKelas.trim(),
        nipWaliKelas: nipWaliKelas.trim(),
        kuota: Number(kuota) || 36,
        keterangan: keterangan.trim()
      };
      onUpdateClass(updated);
      showSuccessToast(`Data Kelas ${updated.namaKelas} berhasil diperbarui.`);
    } else {
      const newCls: ClassData = {
        id: `cls-${Date.now()}`,
        namaKelas: namaKelas.trim(),
        ruang: ruang.trim(),
        waliKelas: waliKelas.trim(),
        nipWaliKelas: nipWaliKelas.trim(),
        kuota: Number(kuota) || 36,
        keterangan: keterangan.trim()
      };
      onAddClass(newCls);
      showSuccessToast(`Kelas ${newCls.namaKelas} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kelas, ruang, atau wali kelas..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-800 outline-hidden transition-all"
          />
        </div>

        {/* Add Class Button */}
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Table of Class Data */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Kelas</th>
                <th className="py-3.5 px-4">Ruangan</th>
                <th className="py-3.5 px-4">Wali Kelas</th>
                <th className="py-3.5 px-4 text-center">Kapasitas & Jumlah Siswa</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada data kelas yang cocok dengan pencarian "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls, idx) => {
                  const countInClass = students.filter(s => s.kelas.toLowerCase() === cls.namaKelas.toLowerCase()).length;
                  const percentage = Math.min(Math.round((countInClass / (cls.kuota || 36)) * 100), 100);

                  return (
                    <tr 
                      key={cls.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center text-slate-400 font-semibold">
                        {idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                            <School className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{cls.namaKelas}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {cls.ruang ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {cls.ruang}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{cls.waliKelas}</div>
                        {cls.nipWaliKelas ? (
                          <div className="text-[10px] text-slate-500">NIP. {cls.nipWaliKelas}</div>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-normal">Non-NIP</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="max-w-[180px] mx-auto space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">{countInClass} / {cls.kuota} Siswa</span>
                            <span className={`font-semibold ${percentage >= 100 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                percentage >= 100 ? 'bg-rose-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {cls.keterangan ? (
                          <span className="line-clamp-2">{cls.keterangan}</span>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(cls)}
                            title="Edit Data Kelas"
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cls)}
                            title="Hapus Kelas"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Menampilkan <strong>{filteredClasses.length}</strong> dari <strong>{classes.length}</strong> rombongan belajar.</span>
          <span>Sistem Pembagian Kelas MA NU 01 Banyuputih</span>
        </div>
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingClass ? `Edit Kelas ${editingClass.namaKelas}` : 'Tambah Kelas Baru'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={namaKelas}
                  onChange={(e) => setNamaKelas(e.target.value)}
                  placeholder="Contoh: X-IPA 1, X-1, X-IPS 2"
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Ruangan Belajar</label>
                <input
                  type="text"
                  value={ruang}
                  onChange={(e) => setRuang(e.target.value)}
                  placeholder="Contoh: Gedung A Lt. 2 R. 201"
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Nama Wali Kelas *</label>
                  <input
                    type="text"
                    required
                    value={waliKelas}
                    onChange={(e) => setWaliKelas(e.target.value)}
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">NIP Wali Kelas</label>
                  <input
                    type="text"
                    value={nipWaliKelas}
                    onChange={(e) => setNipWaliKelas(e.target.value)}
                    placeholder="NIP Pegawai"
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Kuota / Kapasitas Siswa</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={kuota}
                  onChange={(e) => setKuota(Number(e.target.value))}
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Keterangan / Peminatan</label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Catatan peminatan atau pemfokusan kelas"
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  {editingClass ? 'Simpan Perubahan' : 'Tambah Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
