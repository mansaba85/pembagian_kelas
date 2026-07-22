import { Student } from '../types';

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch('/api/students');
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
};

export const addStudent = async (student: Student) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Failed to add student');
  return response.json();
};
