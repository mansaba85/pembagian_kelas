import React, { useRef } from 'react';
import { Student, AppSettings, ClassData } from '../../types';
import { Printer, X } from 'lucide-react';
import { printElement } from '../../lib/printHelper';

interface PrintableClassCardProps {
  student: Student;
  settings: AppSettings;
  classDetail?: ClassData;
  onClose: () => void;
}

export const PrintableClassCard: React.FC<PrintableClassCardProps> = ({
  student,
  settings,
  classDetail,
  onClose
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printableRef.current) {
      printElement(printableRef.current, `Surat Keterangan Pembagian Kelas - ${student.nama}`);
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
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 flex flex-col max-h-[92vh] my-auto overflow-hidden print:shadow-none print:m-0 print:w-full print:max-w-none print:border-none print:max-h-none"
      >
        
        {/* Modal Top Bar (Always Visible & Sticky, Hidden on print) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-2 shrink-0 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-xs sm:text-sm">Surat Keterangan Pembagian Kelas</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              title="Tutup (Tekan ESC)"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Area */}
        <div ref={printableRef} className="printable-area overflow-y-auto flex-1 p-5 sm:p-10 font-serif text-slate-900 bg-white leading-relaxed">
          
          {/* Header Kop Surat */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            {settings.logoSekolah && (
              <img 
                src={settings.logoSekolah} 
                alt="Logo Sekolah" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
            )}
            <div className="flex-1 text-center">
              <h2 className="text-lg sm:text-2xl font-extrabold uppercase tracking-wide text-slate-900">
                {settings.namaSekolah}
              </h2>
              <p className="text-[11px] sm:text-sm font-sans text-slate-700 font-medium mt-0.5">
                NPSN: {settings.npsn} | Telepon: {settings.telepon}
              </p>
              <p className="text-[11px] sm:text-xs font-sans text-slate-600">
                {settings.alamatSekolah}
              </p>
              <p className="text-[11px] sm:text-xs font-sans text-blue-800 font-semibold mt-0.5">
                Website: {settings.website} | Email: {settings.emailSekolah}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h1 className="text-lg font-bold uppercase underline tracking-wider font-sans text-slate-900">
              SURAT KETERANGAN PEMBAGIAN KELAS
            </h1>
            <p className="text-xs font-sans text-slate-600 mt-1">
              TAHUN AJARAN {settings.tahunAjaran}
            </p>
            <p className="text-xs font-sans text-slate-500">
              Nomor: 421.3/PAN-PPDB/{student.nomorDU.replace(/[^0-9]/g, '') || '001'}/{settings.tahunAjaran.split('/')[0]}
            </p>
          </div>

          <p className="text-xs font-sans text-slate-800 mb-4 text-justify">
            Panitia Penerimaan Peserta Didik Baru (PPDB) {settings.namaSekolah} menerangkan bahwa siswa baru di bawah ini:
          </p>

          {/* Student Info Table */}
          <div className="bg-slate-50/80 border border-slate-300 rounded-lg p-4 font-sans text-xs space-y-2.5 mb-6">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-600 font-medium">Nomor Daftar Ulang (DU)</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 font-bold text-slate-900 tracking-wide">{student.nomorDU}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-600 font-medium">Nama Lengkap</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 font-bold text-slate-900 uppercase">{student.nama}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-600 font-medium">NIK</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 text-slate-800">{student.nik}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-600 font-medium">Jenis Kelamin</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 text-slate-800">
                {student.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-600 font-medium">Tempat, Tanggal Lahir</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 text-slate-800">
                {student.tempatLahir}, {student.tanggalLahir}
              </span>
            </div>
          </div>

          {/* Allocation Result Highlight Box */}
          <div className="border-2 border-emerald-600 bg-emerald-50/60 rounded-xl p-5 mb-6 text-center font-sans">
            <p className="text-xs uppercase font-bold text-emerald-800 tracking-wider mb-1">
              DIBAGIKAN / DIALOKASIKAN PADA:
            </p>
            <div className="text-2xl font-black text-emerald-900 tracking-wide my-1">
              KELAS {student.kelas}
            </div>
            <div className="text-xs text-slate-700 font-medium space-y-0.5 mt-2 pt-2 border-t border-emerald-200">
              <p>Wali Kelas: <span className="font-bold text-slate-900">{classDetail?.waliKelas || 'Belum Ditentukan'}</span></p>
              <p>Ruang Belajar: <span className="font-semibold text-slate-800">{classDetail?.ruang || 'Belum Ditentukan'}</span></p>
            </div>
          </div>

          <p className="text-xs font-sans text-slate-800 mb-8 leading-relaxed text-justify">
            Demikian Surat Keterangan Pembagian Kelas ini diterbitkan untuk dipergunakan sebagai bukti resmi orientasi dan Kegiatan Belajar Mengajar (KBM) siswa baru di {settings.namaSekolah}.
          </p>

          {/* Signature Block */}
          <div className="flex justify-between items-end font-sans text-xs pt-4">
            <div className="text-center w-40">
              <p className="text-[11px] text-slate-500 mb-12">Cap & Pengesahan Panitia</p>
              <p className="font-bold underline text-slate-900">PANITIA PPDB</p>
              <p className="text-[10px] text-slate-600">Tim Pengolah Data</p>
            </div>

            <div className="text-center w-56">
              <p className="text-slate-700">{settings.kotaSekolah || 'Kota'}, {formattedDate}</p>
              <p className="text-slate-800 font-medium mb-14">Kepala Sekolah,</p>
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
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
