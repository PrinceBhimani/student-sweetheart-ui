import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Student } from '@/types/student';
import { Edit2, Trash2, GraduationCap } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const StudentTable = ({ students, onEdit, onDelete, isLoading = false }: StudentTableProps) => {
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteStudentId) return;
    
    setIsDeleting(true);
    try {
      await onDelete(deleteStudentId);
    } finally {
      setIsDeleting(false);
      setDeleteStudentId(null);
    }
  };

  const getGenderBadgeColor = (gender: string) => {
    switch (gender) {
      case 'Male':
        return 'bg-academic-blue/10 text-academic-blue border-academic-blue/20';
      case 'Female':
        return 'bg-academic-teal/10 text-academic-teal border-academic-teal/20';
      default:
        return 'bg-academic-success/10 text-academic-success border-academic-success/20';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-medium">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-academic-blue"></div>
            <span className="text-muted-foreground">Loading students...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-foreground">No students found</h3>
              <p className="text-muted-foreground">Get started by adding your first student.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-medium border-academic-blue/10">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <GraduationCap className="h-5 w-5 text-academic-blue" />
            Students Directory ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Age</TableHead>
                  <TableHead className="font-semibold">Gender</TableHead>
                  <TableHead className="font-semibold">Course</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} className="hover:bg-academic-blue-light/30 transition-colors">
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getGenderBadgeColor(student.gender)}>
                        {student.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-academic-blue">{student.course}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(student)}
                          className="hover:bg-academic-blue hover:text-white transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteStudentId(student._id!)}
                          className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};