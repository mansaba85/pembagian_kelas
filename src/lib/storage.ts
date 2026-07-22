import { Student, ClassData, UserAdmin, AppSettings } from '../types';
import { initialStudents, initialClasses, initialUsers, initialAppSettings } from '../data/initialData';

const KEYS = {
  STUDENTS: 'app_pembagian_kelas_students_v1',
  CLASSES: 'app_pembagian_kelas_classes_v1',
  USERS: 'app_pembagian_kelas_users_v1',
  SETTINGS: 'app_pembagian_kelas_settings_v1',
  ADMIN_AUTH: 'app_pembagian_kelas_auth_v1'
};

export const loadStudents = (): Student[] => {
  try {
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : initialStudents;
  } catch (e) {
    console.error('Error loading students from localStorage', e);
    return initialStudents;
  }
};

export const saveStudents = (students: Student[]) => {
  try {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students to localStorage', e);
  }
};

export const loadClasses = (): ClassData[] => {
  try {
    const data = localStorage.getItem(KEYS.CLASSES);
    return data ? JSON.parse(data) : initialClasses;
  } catch (e) {
    console.error('Error loading classes from localStorage', e);
    return initialClasses;
  }
};

export const saveClasses = (classes: ClassData[]) => {
  try {
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
  } catch (e) {
    console.error('Error saving classes to localStorage', e);
  }
};

export const loadUsers = (): UserAdmin[] => {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : initialUsers;
  } catch (e) {
    console.error('Error loading users from localStorage', e);
    return initialUsers;
  }
};

export const saveUsers = (users: UserAdmin[]) => {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage', e);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) return initialAppSettings;
    const parsed = JSON.parse(data);
    if (parsed.namaSekolah === 'SMA NEGERI 1 GARUDA NUSANTARA' || !parsed.namaSekolah) {
      return { ...parsed, namaSekolah: 'MA NU 01 Banyuputih' };
    }
    return parsed;
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
    return initialAppSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
};

export const resetToDefaultData = () => {
  localStorage.removeItem(KEYS.STUDENTS);
  localStorage.removeItem(KEYS.CLASSES);
  localStorage.removeItem(KEYS.USERS);
  localStorage.removeItem(KEYS.SETTINGS);
};
