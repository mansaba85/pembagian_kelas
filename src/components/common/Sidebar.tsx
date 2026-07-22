import React from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  UserCheck, 
  FileText, 
  Eye, 
  LogOut, 
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react';
import { confirmAction } from '../../lib/swal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSwitchToPublic: () => void;
  onLogout: () => void;
  statusPengumuman: boolean;
  onToggleStatusPengumuman: () => void;
  currentAdminName: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  logoSekolah?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onSwitchToPublic,
  onLogout,
  statusPengumuman,
  onToggleStatusPengumuman,
  currentAdminName,
  isOpenMobile = false,
  onCloseMobile,
  logoSekolah
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'kelas', label: 'Data Kelas', icon: School },
    { id: 'siswa', label: 'Data Siswa', icon: Users },
    { id: 'pengguna', label: 'Manajemen Pengguna', icon: UserCheck },
    { id: 'laporan', label: 'Pengaturan Laporan', icon: FileText },
  ];

  const handleLogoutClick = async () => {
    const confirmed = await confirmAction({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin keluar dari Sesi Admin?',
      icon: 'question',
      confirmButtonText: 'Ya, Keluar',
      confirmButtonColor: '#dc2626'
    });
    if (confirmed) {
      onLogout();
      if (onCloseMobile) onCloseMobile();
    }
  };

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-slate-900 text-slate-100 select-none">
      {/* Top Header Logo */}
      <div>
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner p-1 overflow-hidden shrink-0">
              {logoSekolah ? (
                <img src={logoSekolah} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <School className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight text-white tracking-wide">
                ADMIN SISWA
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">Pembagian Kelas Siswa</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 sm:p-4 space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Utama
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & Status */}
      <div className="p-3 sm:p-4 space-y-3 border-t border-slate-800 bg-slate-950/50">
        {/* Status Pengumuman Card */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Status Pengumuman:</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              statusPengumuman ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {statusPengumuman ? 'DIBUKA' : 'DITUTUP'}
            </span>
          </div>
          <button
            onClick={onToggleStatusPengumuman}
            className="w-full text-xs flex items-center justify-between px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors"
          >
            <span className="text-[11px]">Ubah Akses Public</span>
            {statusPengumuman ? (
              <ToggleRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-rose-400" />
            )}
          </button>
        </div>

        {/* Switch to Public View */}
        <button
          onClick={() => {
            onSwitchToPublic();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>Lihat Halaman Siswa</span>
        </button>

        {/* Admin Info & Logout */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <div className="truncate max-w-[130px]">
            <p className="font-semibold text-slate-200 truncate">{currentAdminName}</p>
            <p className="text-[10px] text-slate-400">Petugas Panitia</p>
          </div>
          <button
            onClick={handleLogoutClick}
            title="Keluar dari Sistem Admin"
            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 z-20 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

