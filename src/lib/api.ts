import axios from 'axios';
import { Student, CreateStudentRequest } from '@/types/student';

const API_BASE_URL = 'http://localhost:3000/api/students';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentApi = {
  // Get all students
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/');
    return response.data;
  },

  // Get student by ID
  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Create new student
  create: async (student: CreateStudentRequest): Promise<Student> => {
    const response = await api.post('/', student);
    return response.data;
  },

  // Update student
  update: async (id: string, student: CreateStudentRequest): Promise<Student> => {
    const response = await api.put(`/${id}`, student);
    return response.data;
  },

  // Delete student
  delete: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};