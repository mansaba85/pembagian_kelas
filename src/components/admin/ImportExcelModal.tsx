import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Student, ClassData } from '../../types';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { confirmAction, showSuccessToast, showErrorAlert } from '../../lib/swal';

interface ImportExcelModalProps {
  classes: ClassData[];
  onImportSuccess: (importedStudents: Student[]) => void;
  onClose: () => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  classes,
  onImportSuccess,
  onClose
}) => {
  const [parsedData, setParsedData] = useState<Partial<Student>[]>([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate and download a clean Sample Excel Template (.xlsx)
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Nomor DU': 'DU-A/001',
        'Nama Lengkap': 'Rizky Ramadhan',
        'Jenis Kelamin': 'L',
        'Tempat Lahir': 'Jakarta',
        'Tanggal Lahir': '2010-06-15',
        'NIK': '3201021506100099',
        'Kelas Dituju': 'X-IPA 1',
        'Catatan': 'Siswa Baru Jalur Prestasi'
      },
      {
        'Nomor DU': 'DU-B/002',
        'Nama Lengkap': 'Nabila Salsabila',
        'Jenis Kelamin': 'P',
        'Tempat Lahir': 'Bandung',
        'Tanggal Lahir': '2010-08-20',
        'NIK': '3201026008100100',
        'Kelas Dituju': 'X-IPS 1',
        'Catatan': 'Siswa Baru Jalur Zonasi'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Auto-width columns
    const wscols = [
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 }
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Format Data Siswa');

    XLSX.writeFile(workbook, 'Template_Import_Siswa_Baru_SMAN1.xlsx');
    showSuccessToast('Template Excel berhasil diunduh!');
  };

  // Handle File Upload and Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

        if (!rawJson || rawJson.length === 0) {
          showErrorAlert('File Kosong', 'File Excel yang Anda unggah tidak memiliki baris data.');
          setIsLoading(false);
          return;
        }

        // Standardize column keys mapping flexible Excel headers
        const mappedStudents: Partial<Student>[] = rawJson.map((row, index) => {
          const getVal = (keys: string[]) => {
            for (const key of keys) {
              for (const rowKey of Object.keys(row)) {
                if (rowKey.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, '')) {
                  return String(row[rowKey] || '').trim();
                }
              }
            }
            return '';
          };

          const nama = getVal(['nama', 'namalengkap', 'namasiswa']);
          const nomorDU = getVal(['nomordu', 'du', 'nodu', 'nomordaftarulang']) || `DU-A/${String(100 + index).padStart(3, '0')}`;
          const nik = getVal(['nik', 'nonik', 'nomornik']) || '3201000000000000';
          const jenisKelaminRaw = getVal(['jeniskelamin', 'jk', 'lp', 'gender']);
          const jenisKelamin: 'L' | 'P' = jenisKelaminRaw.toUpperCase().startsWith('P') ? 'P' : 'L';
          const tempatLahir = getVal(['tempatlahir', 'tempat', 'kotalahir']) || 'Kota';
          const tanggalLahir = getVal(['tanggallahir', 'tgl lahir', 'tgllahir']) || '2010-01-01';
          const kelas = getVal(['kelas', 'kelasdituju', 'kelasalokasi']) || 'X-IPA 1';
          const catatan = getVal(['catatan', 'keterangan', 'jalur']) || 'Siswa Import Excel';

          return {
            id: `std-imp-${Date.now()}-${index}`,
            nomorDU,
            nik,
            nama,
            jenisKelamin,
            tempatLahir,
            tanggalLahir,
            kelas,
            catatan
          };
        });

        setParsedData(mappedStudents);
        showSuccessToast(`Berhasil membaca ${mappedStudents.length} baris data dari Excel!`);
      } catch (err) {
        console.error(err);
        showErrorAlert('Gagal Membaca File', 'Pastikan format file sesuai .xlsx atau .csv');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleProcessImport = async () => {
    if (parsedData.length === 0) return;

    const validStudents = parsedData.filter(s => s.nama && s.nomorDU) as Student[];

    if (validStudents.length === 0) {
      showErrorAlert('Data Tidak Valid', 'Tidak ada data siswa yang valid dengan Nama dan Nomor DU.');
      return;
    }

    const confirmed = await confirmAction({
      title: 'Konfirmasi Sync Import Excel',
      text: `Apakah Anda yakin ingin mengimpor ${validStudents.length} data siswa baru ke dalam sistem?`,
      icon: 'question',
      confirmButtonText: 'Ya, Sync Data Siswa',
      confirmButtonColor: '#059669'
    });

    if (confirmed) {
      onImportSuccess(validStudents);
      showSuccessToast(`${validStudents.length} data siswa berhasil diimpor!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Import Data Siswa Massal via Excel</h3>
              <p className="text-xs text-slate-400">Unggah file Excel (.xlsx / .csv) berisi data pembagian kelas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
          
          {/* Step 1: Download Template */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Unduh Format Template Excel Official</span>
              </p>
              <p className="text-[11px] text-emerald-800">
                Gunakan template standar dengan kolom: Nama, Jenis Kelamin, Tempat, Tanggal Lahir, Nomor DU, NIK, Kelas, dan Wali Kelas.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs shrink-0 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Template (.xlsx)</span>
            </button>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50 transition-all">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-file-input"
            />
            <label htmlFor="excel-file-input" className="cursor-pointer block space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {fileName ? `File Terpilih: ${fileName}` : 'Klik untuk Pilih File Excel (.xlsx / .csv)'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mendukung format Microsoft Excel & CSV</p>
              </div>
            </label>
          </div>

          {/* Preview Table if data parsed */}
          {isLoading && (
            <div className="p-8 text-center text-slate-500 font-medium">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Membaca dan memproses lembar kerja Excel...
            </div>
          )}

          {parsedData.length > 0 && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pratinjau Data Impor ({parsedData.length} Siswa)</span>
                </h4>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Siap Disinkronkan
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-60">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">No</th>
                      <th className="p-2.5">Nomor DU</th>
                      <th className="p-2.5">Nama Siswa</th>
                      <th className="p-2.5">L/P</th>
                      <th className="p-2.5">Tempat, Tgl Lahir</th>
                      <th className="p-2.5">Kelas Dituju</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {parsedData.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 font-medium">
                        <td className="p-2.5 text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-700">{s.nomorDU}</td>
                        <td className="p-2.5 font-bold text-slate-900 uppercase">{s.nama || <span className="text-rose-500">Kosong</span>}</td>
                        <td className="p-2.5">{s.jenisKelamin}</td>
                        <td className="p-2.5">{s.tempatLahir}, {s.tanggalLahir}</td>
                        <td className="p-2.5 font-bold text-slate-800">{s.kelas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl"
          >
            Batal
          </button>
          
          <button
            onClick={handleProcessImport}
            disabled={parsedData.length === 0}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <span>Proses Sync {parsedData.length} Siswa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
