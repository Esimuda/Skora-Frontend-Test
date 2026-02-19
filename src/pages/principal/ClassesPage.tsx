import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Class {
  id: string;
  name: string;
  academicYear: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  subjects: number;
}

interface Teacher {
  id: string;
  name: string;
}

export const ClassesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const [formData, setFormData] = useState({
    className: '',
    academicYear: '2024/2025',
  });

  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo data
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'JSS 1A',
      academicYear: '2024/2025',
      teacherId: '1',
      teacherName: 'Mrs. Adebayo Folake',
      studentCount: 35,
      subjects: 10,
    },
    {
      id: '2',
      name: 'JSS 1B',
      academicYear: '2024/2025',
      teacherId: '1',
      teacherName: 'Mrs. Adebayo Folake',
      studentCount: 38,
      subjects: 10,
    },
    {
      id: '3',
      name: 'JSS 2A',
      academicYear: '2024/2025',
      teacherId: '2',
      teacherName: 'Mr. Okonkwo John',
      studentCount: 32,
      subjects: 10,
    },
    {
      id: '4',
      name: 'JSS 2B',
      academicYear: '2024/2025',
      studentCount: 40,
      subjects: 10,
    },
    {
      id: '5',
      name: 'SS 1 Science',
      academicYear: '2024/2025',
      teacherId: '3',
      teacherName: 'Miss Ibrahim Aisha',
      studentCount: 28,
      subjects: 9,
    },
  ]);

  const teachers: Teacher[] = [
    { id: '1', name: 'Mrs. Adebayo Folake' },
    { id: '2', name: 'Mr. Okonkwo John' },
    { id: '3', name: 'Miss Ibrahim Aisha' },
    { id: '4', name: 'Mr. Chukwu Emmanuel' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateCreateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
    }
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = 'Academic year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateClass = async () => {
    if (!validateCreateForm()) return;

    setCreateLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newClass: Class = {
        id: String(classes.length + 1),
        name: formData.className,
        academicYear: formData.academicYear,
        studentCount: 0,
        subjects: 0,
      };

      setClasses([...classes, newClass]);
      setCreateLoading(false);
      resetCreateModal();
    }, 1000);
  };

  const handleAssignTeacher = async () => {
    if (!selectedTeacherId) {
      setErrors({ teacher: 'Please select a teacher' });
      return;
    }

    setAssignLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (selectedClass) {
        const teacher = teachers.find((t) => t.id === selectedTeacherId);
        setClasses(
          classes.map((c) =>
            c.id === selectedClass.id
              ? { ...c, teacherId: selectedTeacherId, teacherName: teacher?.name }
              : c
          )
        );
      }

      setAssignLoading(false);
      resetAssignModal();
    }, 1000);
  };

  const openAssignModal = (classItem: Class) => {
    setSelectedClass(classItem);
    setSelectedTeacherId(classItem.teacherId || '');
    setIsAssignModalOpen(true);
  };

  const resetCreateModal = () => {
    setFormData({ className: '', academicYear: '2024/2025' });
    setErrors({});
    setIsCreateModalOpen(false);
  };

  const resetAssignModal = () => {
    setSelectedClass(null);
    setSelectedTeacherId('');
    setErrors({});
    setIsAssignModalOpen(false);
  };

  const totalClasses = classes.length;
  const assignedClasses = classes.filter((c) => c.teacherId).length;
  const unassignedClasses = classes.filter((c) => !c.teacherId).length;

  return (
    <DashboardLayout title="Classes Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-neutral-900">{totalClasses}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Assigned Teachers</p>
                <p className="text-3xl font-bold text-neutral-900">{assignedClasses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Unassigned</p>
                <p className="text-3xl font-bold text-neutral-900">{unassignedClasses}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">All Classes</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Manage classes and assign teachers
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} icon={<span>➕</span>}>
            Create New Class
          </Button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            <div key={classItem.id} className="card card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{classItem.name}</h3>
                  <p className="text-sm text-neutral-500">{classItem.academicYear}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Students:</span>
                  <span className="font-semibold text-neutral-900">
                    {classItem.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subjects:</span>
                  <span className="font-semibold text-neutral-900">
                    {classItem.subjects}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                {classItem.teacherName ? (
                  <div className="mb-3">
                    <p className="text-xs text-neutral-500 mb-1">Assigned Teacher:</p>
                    <p className="text-sm font-medium text-neutral-900">
                      👨‍🏫 {classItem.teacherName}
                    </p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-neutral-400">No teacher assigned</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openAssignModal(classItem)}
                    className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                  >
                    {classItem.teacherName ? 'Reassign' : 'Assign Teacher'}
                  </button>
                  <button className="px-3 py-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Class Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={resetCreateModal}
        title="Create New Class"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Add a new class to your school. You can assign teachers and students later.
          </p>

          <Input
            label="Class Name"
            name="className"
            placeholder="e.g., JSS 1A, SS 2 Science"
            value={formData.className}
            onChange={handleInputChange}
            error={errors.className}
            icon={<span>📚</span>}
          />

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Academic Year
            </label>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
            {errors.academicYear && (
              <p className="mt-1.5 text-sm text-accent-600">{errors.academicYear}</p>
            )}
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-xs font-semibold text-neutral-700 mb-2">
              ℹ️ After creating:
            </p>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>• Assign a teacher to manage this class</li>
              <li>• Add students and subjects</li>
              <li>• Begin entering scores for the term</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={resetCreateModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateClass} loading={createLoading} className="flex-1">
              Create Class
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Teacher Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={resetAssignModal}
        title={`Assign Teacher to ${selectedClass?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Select a teacher to manage this class. They'll be able to add students, enter
            scores, and submit results.
          </p>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Select Teacher
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => {
                setSelectedTeacherId(e.target.value);
                if (errors.teacher) {
                  setErrors((prev) => ({ ...prev, teacher: '' }));
                }
              }}
              className="input-field"
            >
              <option value="">-- Choose a teacher --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teacher && (
              <p className="mt-1.5 text-sm text-accent-600">{errors.teacher}</p>
            )}
          </div>

          {selectedTeacherId && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                ✅{' '}
                <strong>
                  {teachers.find((t) => t.id === selectedTeacherId)?.name}
                </strong>{' '}
                will be assigned to {selectedClass?.name}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={resetAssignModal} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleAssignTeacher}
              loading={assignLoading}
              disabled={!selectedTeacherId}
              className="flex-1"
            >
              Assign Teacher
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
