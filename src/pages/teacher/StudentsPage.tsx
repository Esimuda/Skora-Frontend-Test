import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  passportPhoto?: string;
}

export const StudentsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'male' as 'male' | 'female',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo students
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      admissionNumber: 'JSS2A/001',
      firstName: 'Oluwaseun',
      lastName: 'Adeyemi',
      middleName: 'David',
      gender: 'male',
    },
    {
      id: '2',
      admissionNumber: 'JSS2A/002',
      firstName: 'Chidinma',
      lastName: 'Okafor',
      gender: 'female',
    },
    {
      id: '3',
      admissionNumber: 'JSS2A/003',
      firstName: 'Ibrahim',
      lastName: 'Musa',
      middleName: 'Yakubu',
      gender: 'male',
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Admission number is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;

    setAddLoading(true);

    setTimeout(() => {
      const newStudent: Student = {
        id: String(students.length + 1),
        ...formData,
        middleName: formData.middleName || undefined,
      };

      setStudents([...students, newStudent]);
      setAddLoading(false);
      resetModal();
    }, 1000);
  };

  const resetModal = () => {
    setFormData({
      admissionNumber: '',
      firstName: '',
      lastName: '',
      middleName: '',
      gender: 'male',
    });
    setErrors({});
    setIsAddModalOpen(false);
  };

  return (
    <DashboardLayout title="Students Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-neutral-900">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Male Students</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {students.filter((s) => s.gender === 'male').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Female Students</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {students.filter((s) => s.gender === 'female').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👩</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Class: JSS 2A</h2>
            <p className="text-sm text-neutral-600 mt-1">Manage your students</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} icon={<span>➕</span>}>
            Add Student
          </Button>
        </div>

        {/* Students Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Admission No.
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Gender
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      {student.lastName.toUpperCase()}{' '}
                      {student.firstName.toUpperCase()}{' '}
                      {student.middleName?.toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          student.gender === 'male' ? 'badge-info' : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {student.gender === 'male' ? '👨 Male' : '👩 Female'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-xs mr-3">
                        Edit
                      </button>
                      <button className="text-accent-600 hover:text-accent-700 font-medium text-xs">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={resetModal} title="Add New Student" size="md">
        <div className="space-y-4">
          <Input
            label="Admission Number"
            name="admissionNumber"
            placeholder="e.g., JSS2A/001"
            value={formData.admissionNumber}
            onChange={handleInputChange}
            error={errors.admissionNumber}
            icon={<span>🔢</span>}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              icon={<span>👤</span>}
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              icon={<span>👤</span>}
            />
          </div>

          <Input
            label="Middle Name (Optional)"
            name="middleName"
            placeholder="Optional"
            value={formData.middleName}
            onChange={handleInputChange}
            icon={<span>👤</span>}
          />

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={resetModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddStudent} loading={addLoading} className="flex-1">
              Add Student
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
