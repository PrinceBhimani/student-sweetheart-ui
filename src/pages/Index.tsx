import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { StudentTable } from '@/components/StudentTable';
import { StudentForm } from '@/components/StudentForm';
import { Student, CreateStudentRequest } from '@/types/student';
import { studentApi } from '@/lib/api';
import { Plus, Users, BookOpen } from 'lucide-react';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch students
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: studentApi.getAll,
  });

  // Create student mutation
  const createMutation = useMutation({
    mutationFn: studentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowForm(false);
      toast({
        title: "Success!",
        description: "Student created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create student. Please try again.",
        variant: "destructive",
      });
      console.error('Create error:', error);
    },
  });

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateStudentRequest }) =>
      studentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setEditingStudent(null);
      toast({
        title: "Success!",
        description: "Student updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
      console.error('Update error:', error);
    },
  });

  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success!",
        description: "Student deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    },
  });

  const handleCreateStudent = async (data: CreateStudentRequest) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateStudent = async (data: CreateStudentRequest) => {
    if (editingStudent?._id) {
      await updateMutation.mutateAsync({ id: editingStudent._id, data });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-destructive">Connection Error</h1>
            <p className="text-muted-foreground">
              Unable to connect to the student API. Please ensure the backend server is running on localhost:3000.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-academic bg-clip-text text-transparent">
                Student Management System
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Manage and track student information efficiently
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-academic-blue hover:bg-academic-blue/90 shadow-medium"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-soft border border-academic-blue/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-academic-blue/10 rounded-lg">
                <Users className="h-6 w-6 text-academic-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
                <p className="text-muted-foreground">Total Students</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-soft border border-academic-teal/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-academic-teal/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-academic-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(students.map(s => s.course)).size}
                </p>
                <p className="text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-soft border border-academic-success/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-academic-success/10 rounded-lg">
                <Users className="h-6 w-6 text-academic-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.age, 0) / students.length) : 0}
                </p>
                <p className="text-muted-foreground">Average Age</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {(showForm || editingStudent) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <StudentForm
              student={editingStudent || undefined}
              onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
              onCancel={handleCancelForm}
              title={editingStudent ? 'Edit Student' : 'Add New Student'}
              submitText={editingStudent ? 'Update' : 'Create'}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        )}

        {/* Students Table */}
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDeleteStudent}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
