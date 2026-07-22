import React, { useRef } from 'react';
import { Student, ClassData, AppSettings } from '../../types';
import { Printer, X } from 'lucide-react';
import { printElement } from '../../lib/printHelper';

interface PrintableReportModalProps {
  students: Student[];
  classes: ClassData[];
  settings: AppSettings;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  students,
  classes,
  settings,
  onClose
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printableRef.current) {
      printElement(printableRef.current, `Laporan Rekapitulasi Pembagian Kelas - ${settings.namaSekolah}`);
    } else {
      window.print();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 flex flex-col max-h-[92vh] my-auto overflow-hidden print:shadow-none print:m-0 print:w-full print:max-w-none print:border-none print:max-h-none"
      >
        
        {/* Top bar (Always Visible & Sticky, Hidden when printing) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs sm:text-sm">Laporan Rekapitulasi Pembagian Kelas</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              title="Tutup (Tekan ESC)"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div ref={printableRef} className="printable-area overflow-y-auto flex-1 p-5 sm:p-12 font-serif text-slate-900 bg-white leading-relaxed">
          
          {/* Header Kop Surat */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            {settings.logoSekolah && (
              <img 
                src={settings.logoSekolah} 
                alt="Logo Sekolah" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
            )}
            <div className="flex-1 text-center">
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-slate-900">
                {settings.namaSekolah}
              </h2>
              <p className="text-xs font-sans text-slate-700 font-medium">
                NPSN: {settings.npsn} | Alamat: {settings.alamatSekolah}
              </p>
              <p className="text-xs font-sans text-slate-600">
                Telepon: {settings.telepon} | Email: {settings.emailSekolah} | Web: {settings.website}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-4">
            <h1 className="text-base sm:text-lg font-bold uppercase underline tracking-wider font-sans text-slate-900">
              REKAPITULASI HASIL PEMBAGIAN KELAS PESERTA DIDIK BARU
            </h1>
            <p className="text-xs font-sans text-slate-600">
              TAHUN AJARAN {settings.tahunAjaran}
            </p>
          </div>

          {/* Render table per class */}
          <div className="space-y-6 my-6 font-sans text-xs">
            {classes.map((cls) => {
              const classStudents = students.filter(s => s.kelas.toLowerCase() === cls.namaKelas.toLowerCase());
              const countL = classStudents.filter(s => s.jenisKelamin === 'L').length;
              const countP = classStudents.filter(s => s.jenisKelamin === 'P').length;

              return (
                <div key={cls.id} className="space-y-2 break-inside-avoid">
                  <div className="flex items-center justify-between font-bold text-slate-900 bg-slate-100 p-2 border border-slate-300 rounded-t-md">
                    <span>KELAS: {cls.namaKelas} (Wali Kelas: {cls.waliKelas})</span>
                    <span className="text-[11px] font-normal text-slate-700">
                      Jumlah: {classStudents.length} Siswa (L: {countL}, P: {countP})
                    </span>
                  </div>

                  <table className="w-full text-left text-[11px] border border-slate-300 border-collapse">
                    <thead className="bg-slate-50 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300 w-8 text-center">No</th>
                        <th className="p-2 border-r border-slate-300">Nomor DU</th>
                        <th className="p-2 border-r border-slate-300">NIK</th>
                        <th className="p-2 border-r border-slate-300">Nama Lengkap</th>
                        <th className="p-2 border-r border-slate-300 w-12 text-center">L/P</th>
                        <th className="p-2">Tempat, Tanggal Lahir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {classStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-2 text-center text-slate-400 italic">
                            Belum ada siswa di kelas ini.
                          </td>
                        </tr>
                      ) : (
                        classStudents.map((std, idx) => (
                          <tr key={std.id}>
                            <td className="p-1.5 border-r border-slate-300 text-center">{idx + 1}</td>
                            <td className="p-1.5 border-r border-slate-300 font-mono font-bold text-slate-900">{std.nomorDU}</td>
                            <td className="p-1.5 border-r border-slate-300 font-mono">{std.nik}</td>
                            <td className="p-1.5 border-r border-slate-300 font-bold uppercase">{std.nama}</td>
                            <td className="p-1.5 border-r border-slate-300 text-center font-bold">{std.jenisKelamin}</td>
                            <td className="p-1.5">{std.tempatLahir}, {std.tanggalLahir}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Signature Footer */}
          <div className="flex justify-between items-end font-sans text-xs pt-8 break-inside-avoid">
            <div className="text-center w-48">
              <p className="text-slate-700 font-medium mb-16">Mengetahui,<br/>Panitia PPDB</p>
              <p className="font-bold underline text-slate-900">TIM DATA DAN REGISTRASI</p>
            </div>

            <div className="text-center w-60">
              <p className="text-slate-700">{settings.kotaSekolah || 'Kota'}, {formattedDate}</p>
              <p className="text-slate-800 font-medium mb-16">Kepala Sekolah,</p>
              <p className="font-bold underline uppercase text-slate-900">{settings.namaKepalaSekolah}</p>
              <p className="text-[10px] text-slate-600">NIP. {settings.nipKepalaSekolah}</p>
            </div>
          </div>

          {/* Bottom Action Footer (Hidden on print) */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between font-sans print:hidden">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Tutup Dokumen</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan / PDF</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
