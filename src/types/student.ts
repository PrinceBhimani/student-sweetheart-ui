export interface Student {
  _id?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  course: string;
}

export interface CreateStudentRequest {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  course: string;
}