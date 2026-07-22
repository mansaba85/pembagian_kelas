import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Student, ClassData } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  FileSpreadsheet, 
  Trash2, 
  Edit3, 
  Download, 
  X, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { confirmDelete, confirmAction, showSuccessToast, showErrorAlert } from '../../lib/swal';

interface DataSiswaProps {
  students: Student[];
  classes: ClassData[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBulkDeleteStudents: (ids: string[]) => void;
  onOpenImportExcel: () => void;
}

export const DataSiswa: React.FC<DataSiswaProps> = ({
  students,
  classes,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkDeleteStudents,
  onOpenImportExcel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State for Manual Student Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Inputs
  const [nomorDU, setNomorDU] = useState('');
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('2010-01-01');
  const [kelas, setKelas] = useState('');
  const [catatan, setCatatan] = useState('');

  // Filtering logic
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorDU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = classFilter === 'ALL' || s.kelas.toLowerCase() === classFilter.toLowerCase();
    const matchesGender = genderFilter === 'ALL' || s.jenisKelamin === genderFilter;

    return matchesSearch && matchesClass && matchesGender;
  });

  // Select / Deselect All
  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Open Modal Add
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setNomorDU(`DU-2026-${String(students.length + 1).padStart(3, '0')}`);
    setNik('320102' + Math.floor(1000000000 + Math.random() * 9000000000));
    setNama('');
    setJenisKelamin('L');
    setTempatLahir('Kota');
    setTanggalLahir('2010-05-15');
    const defaultClass = classes[0] ? classes[0].namaKelas : 'X-IPA 1';
    setKelas(defaultClass);
    setCatatan('Siswa Baru Manual');
    setIsModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setNomorDU(student.nomorDU);
    setNik(student.nik);
    setNama(student.nama);
    setJenisKelamin(student.jenisKelamin);
    setTempatLahir(student.tempatLahir);
    setTanggalLahir(student.tanggalLahir);
    setKelas(student.kelas);
    setCatatan(student.catatan || '');
    setIsModalOpen(true);
  };

  // When class changes in form
  const handleClassSelectChange = (newKelas: string) => {
    setKelas(newKelas);
  };

  // Delete Single Student with SweetAlert confirm
  const handleDeleteSingle = async (student: Student) => {
    const confirmed = await confirmDelete(`Siswa ${student.nama} (${student.nomorDU})`);
    if (confirmed) {
      onDeleteStudent(student.id);
      setSelectedIds(selectedIds.filter(i => i !== student.id));
      showSuccessToast(`Data siswa ${student.nama} berhasil dihapus.`);
    }
  };

  // Bulk Delete with SweetAlert confirm
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirmAction({
      title: 'Hapus Terpilih?',
      text: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data siswa yang dipilih? Data yang dihapus tidak dapat dikembalikan!`,
      icon: 'error',
      confirmButtonText: `Ya, Hapus ${selectedIds.length} Siswa`,
      confirmButtonColor: '#dc2626'
    });

    if (confirmed) {
      onBulkDeleteStudents(selectedIds);
      setSelectedIds([]);
      showSuccessToast(`${selectedIds.length} data siswa berhasil dihapus.`);
    }
  };

  // Export Filtered Data to Excel file
  const handleExportExcel = () => {
    const exportData = filteredStudents.map((s, idx) => ({
      'No': idx + 1,
      'Nomor DU': s.nomorDU,
      'NIK': s.nik,
      'Nama Lengkap': s.nama,
      'Jenis Kelamin': s.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
      'Tempat Lahir': s.tempatLahir,
      'Tanggal Lahir': s.tanggalLahir,
      'Kelas': s.kelas,
      'Catatan': s.catatan || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

    XLSX.writeFile(workbook, `Data_Siswa_Pembagian_Kelas_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showSuccessToast('Data siswa berhasil diekspor ke Excel!');
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !nomorDU.trim() || !kelas.trim()) {
      showErrorAlert('Form Tidak Lengkap', 'Nama Siswa, Nomor DU, dan Kelas wajib diisi.');
      return;
    }

    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        nomorDU: nomorDU.trim(),
        nik: nik.trim(),
        nama: nama.trim(),
        jenisKelamin,
        tempatLahir: tempatLahir.trim(),
        tanggalLahir,
        kelas,
        catatan: catatan.trim()
      };
      onUpdateStudent(updated);
      showSuccessToast(`Data siswa ${updated.nama} berhasil diperbarui.`);
    } else {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        nomorDU: nomorDU.trim(),
        nik: nik.trim(),
        nama: nama.trim(),
        jenisKelamin,
        tempatLahir: tempatLahir.trim(),
        tanggalLahir,
        kelas,
        catatan: catatan.trim()
      };
      onAddStudent(newStudent);
      showSuccessToast(`Siswa baru ${newStudent.nama} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Filters & Actions Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 sm:space-y-4">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Search & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative sm:col-span-1 lg:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, DU, NIK, kelas..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-800 outline-hidden"
              />
            </div>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.namaKelas}>{c.namaKelas}</option>
              ))}
            </select>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden"
            >
              <option value="ALL">Semua L/P</option>
              <option value="L">Laki-Laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>

          </div>

          {/* Right: Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            
            {/* Bulk Delete Button if selected */}
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="col-span-2 sm:col-span-1 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-200"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export</span>
            </button>

            <button
              onClick={onOpenImportExcel}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="col-span-2 sm:col-span-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </button>

          </div>

        </div>

      </div>

      {/* Student Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 text-center w-10">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">No</th>
                <th className="p-3.5">Nomor DU</th>
                <th className="p-3.5">NIK</th>
                <th className="p-3.5">Nama Siswa</th>
                <th className="p-3.5">L/P</th>
                <th className="p-3.5">Tempat & Tgl Lahir</th>
                <th className="p-3.5">Hasil Kelas</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    Tidak ada data siswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, index) => {
                  const isSelected = selectedIds.includes(s.id);
                  return (
                    <tr key={s.id} className={`hover:bg-emerald-50/40 transition-colors ${isSelected ? 'bg-emerald-50/70' : ''}`}>
                      <td className="p-3.5 text-center">
                        <button onClick={() => handleToggleSelect(s.id)} className="text-slate-400 hover:text-emerald-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-500 font-medium">{index + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">{s.nomorDU}</td>
                      <td className="p-3.5 font-mono text-slate-600">{s.nik}</td>
                      <td className="p-3.5 font-bold uppercase text-slate-900">{s.nama}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {s.jenisKelamin}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{s.tempatLahir}, {s.tanggalLahir}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-lg text-xs">
                          {s.kelas}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            title="Edit Data Siswa"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(s)}
                            title="Hapus Siswa"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
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
      </div>

      {/* Modal Manual Add / Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru Manual'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Nomor DU (Daftar Ulang) *</label>
                  <input
                    type="text"
                    required
                    value={nomorDU}
                    onChange={(e) => setNomorDU(e.target.value)}
                    placeholder="DU-2026-001"
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-hidden uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">NIK (16 Digit)</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="320102..."
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Lengkap Siswa"
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Jenis Kelamin</label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Tempat Lahir</label>
                  <input
                    type="text"
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value)}
                    placeholder="Kota Lahir"
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Tanggal Lahir</label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Kelas Dituju *</label>
                  <select
                    value={kelas}
                    onChange={(e) => handleClassSelectChange(e.target.value)}
                    className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 outline-hidden"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.namaKelas}>{c.namaKelas}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Catatan / Jalur PPDB</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Jalur Zonasi / Prestasi"
                  className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                  {editingStudent ? 'Simpan Perubahan' : 'Simpan Siswa Baru'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
