import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Subject {
  id: string;
  name: string;
  code: string;
  isCore: boolean;
}

export const SubjectsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default subjects (Math and English are always present)
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', code: 'MTH', isCore: true },
    { id: '2', name: 'English Language', code: 'ENG', isCore: true },
    { id: '3', name: 'Basic Science', code: 'BSC', isCore: false },
    { id: '4', name: 'Basic Technology', code: 'BTC', isCore: false },
    { id: '5', name: 'Civic Education', code: 'CVC', isCore: false },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Subject code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubject = async () => {
    if (!validateForm()) return;

    setAddLoading(true);

    setTimeout(() => {
      const newSubject: Subject = {
        id: String(subjects.length + 1),
        name: formData.name,
        code: formData.code.toUpperCase(),
        isCore: false,
      };

      setSubjects([...subjects, newSubject]);
      setAddLoading(false);
      resetModal();
    }, 1000);
  };

  const handleRemoveSubject = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject?.isCore) {
      alert('Cannot remove core subjects (Mathematics and English)');
      return;
    }
    
    if (confirm('Are you sure you want to remove this subject?')) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const resetModal = () => {
    setFormData({ name: '', code: '' });
    setErrors({});
    setIsAddModalOpen(false);
  };

  const coreSubjects = subjects.filter((s) => s.isCore);
  const electiveSubjects = subjects.filter((s) => !s.isCore);

  return (
    <DashboardLayout title="Subjects Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Subjects</p>
                <p className="text-3xl font-bold text-neutral-900">{subjects.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Core Subjects</p>
                <p className="text-3xl font-bold text-neutral-900">{coreSubjects.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Elective Subjects</p>
                <p className="text-3xl font-bold text-neutral-900">{electiveSubjects.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Class: JSS 2A</h2>
            <p className="text-sm text-neutral-600 mt-1">Manage subjects for this class</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} icon={<span>➕</span>}>
            Add Subject
          </Button>
        </div>

        {/* Core Subjects */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⭐</span>
            <h3 className="text-lg font-bold text-neutral-900">Core Subjects</h3>
            <span className="badge badge-success text-xs">Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreSubjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-neutral-900">{subject.name}</h4>
                    <p className="text-sm text-neutral-600 font-mono">{subject.code}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <p className="text-xs text-neutral-600">
              ℹ️ Core subjects (Mathematics and English) cannot be removed and are
              automatically added to all classes.
            </p>
          </div>
        </div>

        {/* Elective Subjects */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📖</span>
            <h3 className="text-lg font-bold text-neutral-900">Elective Subjects</h3>
          </div>

          {electiveSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {electiveSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-neutral-900">{subject.name}</h4>
                      <p className="text-sm text-neutral-600 font-mono">{subject.code}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📖</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 font-medium">
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="flex-1 text-xs px-3 py-2 bg-accent-50 text-accent-600 border border-accent-200 rounded-lg hover:bg-accent-100 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-lg">
              <p className="text-neutral-500 mb-2">No elective subjects added yet</p>
              <p className="text-sm text-neutral-400">
                Click "Add Subject" to add more subjects
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      <Modal isOpen={isAddModalOpen} onClose={resetModal} title="Add New Subject" size="md">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Add a new subject to this class. Students will be able to receive scores for this
            subject.
          </p>

          <Input
            label="Subject Name"
            name="name"
            placeholder="e.g., Computer Studies"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            icon={<span>📚</span>}
          />

          <Input
            label="Subject Code"
            name="code"
            placeholder="e.g., CMP (3 letters)"
            value={formData.code}
            onChange={handleInputChange}
            error={errors.code}
            icon={<span>🔤</span>}
            maxLength={3}
          />

          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-xs font-semibold text-neutral-700 mb-2">💡 Tips:</p>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>• Use clear, recognizable subject names</li>
              <li>• Subject codes should be 3 letters (e.g., PHY, CHE, BIO)</li>
              <li>• Mathematics and English are already added as core subjects</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={resetModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddSubject} loading={addLoading} className="flex-1">
              Add Subject
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
