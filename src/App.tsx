import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Student, ClassData, UserAdmin, AppSettings } from './types';
import { 
  loadStudents, 
  saveStudents, 
  loadClasses, 
  saveClasses, 
  loadUsers, 
  saveUsers, 
  loadSettings, 
  saveSettings,
  resetToDefaultData
} from './lib/storage';

// Public Components
import { StudentAnnouncement } from './components/public/StudentAnnouncement';

// Admin Components
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DataKelas } from './components/admin/DataKelas';
import { DataSiswa } from './components/admin/DataSiswa';
import { ManajemenPengguna } from './components/admin/ManajemenPengguna';
import { PengaturanLaporan } from './components/admin/PengaturanLaporan';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ImportExcelModal } from './components/admin/ImportExcelModal';
import { PrintableReportModal } from './components/admin/PrintableReportModal';
import { showSuccessToast, confirmAction } from './lib/swal';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load persistent state
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [classes, setClasses] = useState<ClassData[]>(() => loadClasses());
  const [users, setUsers] = useState<UserAdmin[]>(() => loadUsers());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // View & Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<UserAdmin | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPrintReportModalOpen, setIsPrintReportModalOpen] = useState(false);

  // Derive active admin tab from location pathname
  const pathname = location.pathname;
  let activeAdminTab = 'dashboard';
  if (pathname.includes('/kelas')) activeAdminTab = 'kelas';
  else if (pathname.includes('/siswa')) activeAdminTab = 'siswa';
  else if (pathname.includes('/pengguna')) activeAdminTab = 'pengguna';
  else if (pathname.includes('/laporan') || pathname.includes('/pengaturan')) activeAdminTab = 'laporan';
  else if (pathname.includes('/dashboard')) activeAdminTab = 'dashboard';

  const isPublicRoute = pathname === '/' || pathname === '/public' || pathname === '/pengumuman';
  const isAdminRoute = pathname.startsWith('/admin');

  // Auto-trigger login modal if visiting an admin route without being logged in
  useEffect(() => {
    if (isAdminRoute && !isLoggedIn) {
      setIsAdminLoginModalOpen(true);
    }
  }, [isAdminRoute, isLoggedIn]);

  // Persist edits to localStorage whenever state updates
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Handlers for Students
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleBulkDeleteStudents = (ids: string[]) => {
    setStudents(prev => prev.filter(s => !ids.includes(s.id)));
  };

  const handleImportExcelSuccess = (imported: Student[]) => {
    setStudents(prev => [...imported, ...prev]);
  };

  // Handlers for Classes
  const handleAddClass = (newCls: ClassData) => {
    setClasses(prev => [...prev, newCls]);
  };

  const handleUpdateClass = (updatedCls: ClassData) => {
    setClasses(prev => prev.map(c => c.id === updatedCls.id ? updatedCls : c));
  };

  const handleDeleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Handlers for Users
  const handleAddUser = (newUser: UserAdmin) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: UserAdmin) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Handlers for Settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleToggleStatusPengumuman = async () => {
    const newStatus = !settings.statusPengumuman;
    const confirmed = await confirmAction({
      title: newStatus ? 'Buka Pengumuman Akses Siswa?' : 'Tutup Pengumuman Akses Siswa?',
      text: newStatus 
        ? 'Siswa baru dapat mengecek nomor DU mereka di portal public.' 
        : 'Siswa akan melihat pemberitahuan bahwa pengumuman sedang ditutup.',
      icon: 'question',
      confirmButtonText: newStatus ? 'Ya, Buka Public' : 'Ya, Tutup Public'
    });

    if (confirmed) {
      setSettings(prev => ({ ...prev, statusPengumuman: newStatus }));
      showSuccessToast(`Akses pengumuman siswa berhasil ${newStatus ? 'DIBUKA' : 'DITUTUP'}.`);
    }
  };

  // Reset Data to Default Initial Sample
  const handleResetData = () => {
    resetToDefaultData();
    setStudents(loadStudents());
    setClasses(loadClasses());
    setUsers(loadUsers());
    setSettings(loadSettings());
  };

  // Login & Logout
  const handleLoginSuccess = (user: UserAdmin) => {
    setCurrentAdminUser(user);
    setIsLoggedIn(true);
    setIsAdminLoginModalOpen(false);
    if (!pathname.startsWith('/admin')) {
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAdminUser(null);
    navigate('/');
  };

  // Switch Admin Tab Navigation
  const handleSelectAdminTab = (tab: string) => {
    navigate(`/admin/${tab}`);
  };

  // Titles mapping
  const adminTabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dasbor Utama Administrasi',
      subtitle: 'Ringkasan statistik alokasi kelas, kuota siswa, dan aktivitas terbaru.'
    },
    kelas: {
      title: 'Kelola Data Kelas & Rombel',
      subtitle: 'Pengaturan daftar kelas, kuota siswa, dan penetapan wali kelas.'
    },
    siswa: {
      title: 'Kelola Data Siswa Baru',
      subtitle: 'Pencarian, pemfilteran, tambah manual, serta impor & ekspor Excel.'
    },
    pengguna: {
      title: 'Manajemen Pengguna Admin',
      subtitle: 'Daftar petugas panitia, peran (role), dan status aktivasi akun.'
    },
    laporan: {
      title: 'Pengaturan Laporan & Identitas Sekolah',
      subtitle: 'Konfigurasi kop surat resmi, pengesahan kepala sekolah, dan cetak rekap.'
    }
  };

  // RENDER: PUBLIC VIEW
  if (isPublicRoute || (!isLoggedIn && !isAdminRoute)) {
    return (
      <div className="min-h-screen bg-slate-900">
        <StudentAnnouncement
          students={students}
          classes={classes}
          settings={settings}
          onOpenAdminLogin={() => {
            if (isLoggedIn) {
              navigate('/admin/dashboard');
            } else {
              setIsAdminLoginModalOpen(true);
            }
          }}
        />

        {/* Admin Login Modal */}
        {isAdminLoginModalOpen && (
          <AdminLoginModal
            users={users}
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setIsAdminLoginModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // RENDER: ADMIN PORTAL VIEW
  const activeHeader = adminTabTitles[activeAdminTab] || {
    title: 'Panel Administrasi',
    subtitle: 'Sistem Informasi Pembagian Kelas'
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        activeTab={activeAdminTab}
        setActiveTab={handleSelectAdminTab}
        onSwitchToPublic={() => navigate('/')}
        onLogout={handleLogout}
        statusPengumuman={settings.statusPengumuman}
        onToggleStatusPengumuman={handleToggleStatusPengumuman}
        currentAdminName={currentAdminUser?.nama || 'Petugas Panitia'}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        logoSekolah={settings.logoSekolah}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Sticky Header */}
        <Header
          title={activeHeader.title}
          subtitle={activeHeader.subtitle}
          statusPengumuman={settings.statusPengumuman}
          onToggleStatusPengumuman={handleToggleStatusPengumuman}
          onResetData={handleResetData}
          namaSekolah={settings.namaSekolah}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic Admin View Routes */}
        <main className="p-3 sm:p-6 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminDashboard
                  students={students}
                  classes={classes}
                  settings={settings}
                  onNavigate={(tab) => navigate(`/admin/${tab}`)}
                  onOpenImportModal={() => setIsImportModalOpen(true)}
                  onOpenAddStudentModal={() => navigate('/admin/siswa')}
                  onOpenPrintReportModal={() => setIsPrintReportModalOpen(true)}
                />
              } 
            />
            <Route 
              path="/admin/kelas" 
              element={
                <DataKelas
                  classes={classes}
                  students={students}
                  onAddClass={handleAddClass}
                  onUpdateClass={handleUpdateClass}
                  onDeleteClass={handleDeleteClass}
                />
              } 
            />
            <Route 
              path="/admin/siswa" 
              element={
                <DataSiswa
                  students={students}
                  classes={classes}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onBulkDeleteStudents={handleBulkDeleteStudents}
                  onOpenImportExcel={() => setIsImportModalOpen(true)}
                />
              } 
            />
            <Route 
              path="/admin/pengguna" 
              element={
                <ManajemenPengguna
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              } 
            />
            <Route 
              path="/admin/laporan" 
              element={
                <PengaturanLaporan
                  settings={settings}
                  students={students}
                  classes={classes}
                  onSaveSettings={handleSaveSettings}
                />
              } 
            />
            <Route 
              path="/admin/pengaturan" 
              element={<Navigate to="/admin/laporan" replace />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>
      </div>

      {/* Import Excel Modal */}
      {isImportModalOpen && (
        <ImportExcelModal
          classes={classes}
          onImportSuccess={handleImportExcelSuccess}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}

      {/* Full Printable Report Modal */}
      {isPrintReportModalOpen && (
        <PrintableReportModal
          students={students}
          classes={classes}
          settings={settings}
          onClose={() => setIsPrintReportModalOpen(false)}
        />
      )}

      {/* Admin Login Modal (Overlay if visiting /admin directly without login) */}
      {isAdminLoginModalOpen && !isLoggedIn && (
        <AdminLoginModal
          users={users}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => {
            setIsAdminLoginModalOpen(false);
            if (!isLoggedIn) {
              navigate('/');
            }
          }}
        />
      )}

    </div>
  );
}

