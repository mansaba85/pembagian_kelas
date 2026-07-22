import { Student, ClassData, UserAdmin, AppSettings } from '../types';

// --- STUDENTS ---
export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch('/api/students');
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
};

export const apiAddStudent = async (student: Student) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Failed to add student');
  return response.json();
};

export const apiUpdateStudent = async (student: Student) => {
  const response = await fetch(`/api/students/${encodeURIComponent(student.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Failed to update student');
  return response.json();
};

export const apiDeleteStudent = async (id: string) => {
  const response = await fetch(`/api/students/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete student');
  return response.json();
};

export const apiBulkDeleteStudents = async (ids: string[]) => {
  const response = await fetch('/api/students/bulk-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error('Failed to bulk delete students');
  return response.json();
};

export const apiImportStudents = async (students: Student[]) => {
  const response = await fetch('/api/students/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ students }),
  });
  if (!response.ok) throw new Error('Failed to import students');
  return response.json();
};

// --- CLASSES ---
export const fetchClasses = async (): Promise<ClassData[]> => {
  const response = await fetch('/api/classes');
  if (!response.ok) throw new Error('Failed to fetch classes');
  return response.json();
};

export const apiAddClass = async (cls: ClassData) => {
  const response = await fetch('/api/classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cls),
  });
  if (!response.ok) throw new Error('Failed to add class');
  return response.json();
};

export const apiUpdateClass = async (cls: ClassData) => {
  const response = await fetch(`/api/classes/${encodeURIComponent(cls.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cls),
  });
  if (!response.ok) throw new Error('Failed to update class');
  return response.json();
};

export const apiDeleteClass = async (id: string) => {
  const response = await fetch(`/api/classes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete class');
  return response.json();
};

// --- USERS ---
export const fetchUsers = async (): Promise<UserAdmin[]> => {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const apiAddUser = async (user: UserAdmin) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to add user');
  return response.json();
};

export const apiUpdateUser = async (user: UserAdmin) => {
  const response = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
};

export const apiDeleteUser = async (id: string) => {
  const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return response.json();
};

// --- SETTINGS ---
export const fetchSettings = async (): Promise<AppSettings> => {
  const response = await fetch('/api/settings');
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
};

export const apiSaveSettings = async (settings: AppSettings) => {
  const response = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error('Failed to save settings');
  return response.json();
};

// --- RESET DB ---
export const apiResetDatabase = async () => {
  const response = await fetch('/api/reset', {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to reset database');
  return response.json();
};
