import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, CreateStudentRequest } from '@/types/student';
import { X } from 'lucide-react';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: CreateStudentRequest) => Promise<void>;
  onCancel: () => void;
  title: string;
  submitText: string;
  isLoading?: boolean;
}

export const StudentForm = ({ 
  student, 
  onSubmit, 
  onCancel, 
  title, 
  submitText, 
  isLoading = false 
}: StudentFormProps) => {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: '',
    age: 18,
    gender: 'Male',
    course: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        age: student.age,
        gender: student.gender,
        course: student.course,
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateStudentRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-medium border-academic-blue/20">
      <CardHeader className="bg-gradient-academic text-primary-foreground">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-white/20 text-primary-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="transition-all duration-200 focus:ring-academic-blue focus:border-academic-blue"
              placeholder="Enter student name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">Age</Label>
            <Input
              id="age"
              type="number"
              min="16"
              max="100"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              required
              className="transition-all duration-200 focus:ring-academic-blue focus:border-academic-blue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-academic-blue focus:border-academic-blue">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm font-medium">Course</Label>
            <Input
              id="course"
              type="text"
              value={formData.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
              required
              className="transition-all duration-200 focus:ring-academic-blue focus:border-academic-blue"
              placeholder="e.g., BSc, MSc, PhD"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-academic-blue hover:bg-academic-blue/90"
            >
              {isLoading ? 'Saving...' : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};