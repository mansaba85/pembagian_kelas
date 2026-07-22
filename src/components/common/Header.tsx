import React from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import { confirmAction, showSuccessToast } from '../../lib/swal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  statusPengumuman: boolean;
  onToggleStatusPengumuman: () => void;
  onResetData?: () => void;
  namaSekolah: string;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  statusPengumuman,
  onToggleStatusPengumuman,
  onResetData,
  namaSekolah,
  onOpenMobileMenu
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 py-3 sm:py-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Hamburger Toggle */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shrink-0"
            title="Buka Menu Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-0.5">
            <span className="truncate max-w-[180px] sm:max-w-xs">{namaSekolah}</span>
            <span>•</span>
            <span className="shrink-0">Panel Admin</span>
          </div>
          <h1 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2.5 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Status Pengumuman Badge & Quick Switch */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl">
          <span className="text-[11px] text-slate-600 font-medium hidden md:inline">Akses Siswa:</span>
          <button
            onClick={onToggleStatusPengumuman}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
              statusPengumuman
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{statusPengumuman ? 'DIBUKA' : 'DITUTUP'}</span>
          </button>
        </div>

        {/* Reset Data Button */}
        {onResetData && (
          <button
            onClick={async () => {
              const confirm = await confirmAction({
                title: 'Reset ke Data Default?',
                text: 'Semua data siswa, kelas, dan pengaturan akan dikembalikan ke data sampel awal. Tindakan ini tidak dapat dibatalkan!',
                icon: 'warning',
                confirmButtonText: 'Ya, Reset Data',
                confirmButtonColor: '#d97706'
              });
              if (confirm) {
                onResetData();
                showSuccessToast('Data berhasil di-reset ke sampel awal!');
              }
            }}
            title="Reset Data ke Sampel Awal"
            className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

