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
import { 
  fetchStudents, 
  apiAddStudent, 
  apiUpdateStudent, 
  apiDeleteStudent, 
  apiBulkDeleteStudents, 
  apiImportStudents,
  fetchClasses,
  apiAddClass,
  apiUpdateClass,
  apiDeleteClass,
  fetchUsers,
  apiAddUser,
  apiUpdateUser,
  apiDeleteUser,
  fetchSettings,
  apiSaveSettings,
  apiResetDatabase
} from './lib/api';

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
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [users, setUsers] = useState<UserAdmin[]>([]);
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

  // Sync state to localStorage as secondary backup
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
    if (settings.namaSekolah) {
      document.title = `Sistem Pengumuman Pembagian Kelas - ${settings.namaSekolah}`;
    }
  }, [settings]);

  // Initial load from MySQL backend
  useEffect(() => {
    fetchStudents()
      .then(res => { if (Array.isArray(res)) setStudents(res); })
      .catch(() => setStudents(loadStudents()));

    fetchClasses()
      .then(res => { if (Array.isArray(res)) setClasses(res); })
      .catch(() => setClasses(loadClasses()));

    fetchUsers()
      .then(res => { if (Array.isArray(res)) setUsers(res); })
      .catch(() => setUsers(loadUsers()));

    fetchSettings()
      .then(res => { if (res && res.namaSekolah) setSettings(res); })
      .catch(() => setSettings(loadSettings()));
  }, []);

  // Handlers for Students
  const handleAddStudent = async (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    try {
      await apiAddStudent(newStudent);
    } catch (e) {
      console.error('Failed to add student to backend', e);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    try {
      await apiUpdateStudent(updatedStudent);
    } catch (e) {
      console.error('Failed to update student in backend', e);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    try {
      await apiDeleteStudent(id);
    } catch (e) {
      console.error('Failed to delete student in backend', e);
    }
  };

  const handleBulkDeleteStudents = async (ids: string[]) => {
    setStudents(prev => prev.filter(s => !ids.includes(s.id)));
    try {
      await apiBulkDeleteStudents(ids);
    } catch (e) {
      console.error('Failed to bulk delete students in backend', e);
    }
  };

  const handleImportExcelSuccess = async (imported: Student[]) => {
    setStudents(prev => [...imported, ...prev]);
    try {
      await apiImportStudents(imported);
    } catch (e) {
      console.error('Failed to import students to backend', e);
    }
  };

  // Handlers for Classes
  const handleAddClass = async (newCls: ClassData) => {
    setClasses(prev => [...prev, newCls]);
    try {
      await apiAddClass(newCls);
    } catch (e) {
      console.error('Failed to add class to backend', e);
    }
  };

  const handleUpdateClass = async (updatedCls: ClassData) => {
    setClasses(prev => prev.map(c => c.id === updatedCls.id ? updatedCls : c));
    try {
      await apiUpdateClass(updatedCls);
    } catch (e) {
      console.error('Failed to update class in backend', e);
    }
  };

  const handleDeleteClass = async (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    try {
      await apiDeleteClass(id);
    } catch (e) {
      console.error('Failed to delete class in backend', e);
    }
  };

  // Handlers for Users
  const handleAddUser = async (newUser: UserAdmin) => {
    setUsers(prev => [...prev, newUser]);
    try {
      await apiAddUser(newUser);
    } catch (e) {
      console.error('Failed to add user to backend', e);
    }
  };

  const handleUpdateUser = async (updatedUser: UserAdmin) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    try {
      await apiUpdateUser(updatedUser);
    } catch (e) {
      console.error('Failed to update user in backend', e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await apiDeleteUser(id);
    } catch (e) {
      console.error('Failed to delete user in backend', e);
    }
  };

  // Handlers for Settings
  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await apiSaveSettings(newSettings);
    } catch (e) {
      console.error('Failed to save settings in backend', e);
    }
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
      const updated = { ...settings, statusPengumuman: newStatus };
      setSettings(updated);
      try {
        await apiSaveSettings(updated);
      } catch (e) {
        console.error('Failed to toggle status pengumuman', e);
      }
      showSuccessToast(`Akses pengumuman siswa berhasil ${newStatus ? 'DIBUKA' : 'DITUTUP'}.`);
    }
  };

  // Reset Data to Default Initial Sample
  const handleResetData = async () => {
    resetToDefaultData();
    try {
      await apiResetDatabase();
      const stds = await fetchStudents();
      const clss = await fetchClasses();
      const usrs = await fetchUsers();
      const stgs = await fetchSettings();
      setStudents(stds);
      setClasses(clss);
      setUsers(usrs);
      setSettings(stgs);
    } catch (e) {
      console.error('Failed to reset database', e);
      setStudents(loadStudents());
      setClasses(loadClasses());
      setUsers(loadUsers());
      setSettings(loadSettings());
    }
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

