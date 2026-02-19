import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ClassicResultSheet } from '@/templates/ClassicResultSheet';
import { ModernResultSheet } from '@/templates/ModernResultSheet';
import { Modal } from '@/components/ui/Modal';
import type { StudentResult, School } from '@/types';

export const SettingsPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'hybrid'>('classic');
  const [previewTemplate, setPreviewTemplate] = useState<'classic' | 'modern' | 'hybrid' | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [schoolData, setSchoolData] = useState({
    name: 'Government Secondary School, Ikeja',
    address: 'No. 45, Allen Avenue, Ikeja, Lagos State',
    email: 'info@gssikeja.edu.ng',
    phoneNumber: '+234 803 456 7890',
    motto: 'Knowledge is Power',
  });

  // Demo result for preview
  const demoSchool: School = {
    id: 'school-1',
    ...schoolData,
    templateId: previewTemplate || selectedTemplate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoResult: StudentResult = {
    student: {
      id: 'student-1',
      classId: 'JSS 2A',
      admissionNumber: 'GSS/2023/0145',
      firstName: 'Oluwaseun',
      lastName: 'Adeyemi',
      middleName: 'David',
      gender: 'male',
      createdAt: '',
      updatedAt: '',
    },
    scores: [
      { id: '1', studentId: 'student-1', subjectId: 'Mathematics', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '2', studentId: 'student-1', subjectId: 'English Language', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 18, exam: 48, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '3', studentId: 'student-1', subjectId: 'Basic Science', term: 'first', academicYear: '2024/2025', ca1: 17, ca2: 16, exam: 50, total: 83, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    ],
    behavioralAssessment: {
      id: 'ba-1',
      studentId: 'student-1',
      term: 'first',
      academicYear: '2024/2025',
      ratings: {
        'Punctuality': 5,
        'Attentiveness': 5,
        'Neatness': 4,
        'Politeness': 5,
      },
      createdAt: '',
      updatedAt: '',
    },
    comment: {
      id: 'comment-1',
      studentId: 'student-1',
      term: 'first',
      academicYear: '2024/2025',
      teacherComment: 'Excellent performance this term!',
      principalComment: 'Outstanding work. Keep it up!',
      createdAt: '',
      updatedAt: '',
    },
    totalScore: 252,
    totalPossible: 300,
    percentage: 84.0,
    position: 2,
    totalStudents: 35,
    classHighest: 85.4,
    term: 'first',
    academicYear: '2024/2025',
  };

  const handleSaveTemplate = async () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
      alert('Template settings saved successfully!');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolData((prev) => ({ ...prev, [name]: value }));
  };

  const templates = [
    {
      id: 'classic' as const,
      name: 'Classic Template',
      description: 'Traditional design with formal borders and black & white styling',
      icon: '📄',
      color: 'from-neutral-600 to-neutral-800',
    },
    {
      id: 'modern' as const,
      name: 'Modern Template',
      description: 'Contemporary with gradient headers and modern card layouts',
      icon: '✨',
      color: 'from-purple-600 to-purple-800',
    },
    {
      id: 'hybrid' as const,
      name: 'Hybrid Template',
      description: 'Professional balanced design combining traditional and modern',
      icon: '🎯',
      color: 'from-primary-600 to-primary-800',
    },
  ];

  return (
    <DashboardLayout title="School Settings">
      <div className="space-y-6">
        {/* School Information Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <span>🏫</span>
            School Information
          </h2>

          <div className="space-y-4">
            <Input
              label="School Name"
              name="name"
              value={schoolData.name}
              onChange={handleInputChange}
              icon={<span>🏫</span>}
            />

            <Input
              label="School Address"
              name="address"
              value={schoolData.address}
              onChange={handleInputChange}
              icon={<span>📍</span>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={schoolData.email}
                onChange={handleInputChange}
                icon={<span>📧</span>}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={schoolData.phoneNumber}
                onChange={handleInputChange}
                icon={<span>📞</span>}
              />
            </div>

            <Input
              label="School Motto"
              name="motto"
              value={schoolData.motto}
              onChange={handleInputChange}
              icon={<span>💡</span>}
            />

            <Button variant="outline">Update School Information</Button>
          </div>
        </div>

        {/* Result Sheet Template Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <span>📄</span>
            Result Sheet Template
          </h2>
          <p className="text-sm text-neutral-600 mb-6">
            Choose the design that will be used for all student result sheets. You can preview
            each template before saving.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div
                  className={`w-full h-32 bg-gradient-to-br ${template.color} rounded-lg mb-4 flex items-center justify-center`}
                >
                  <span className="text-5xl">{template.icon}</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{template.name}</h3>
                <p className="text-xs text-neutral-600 mb-3">{template.description}</p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Preview Template →
                </button>
              </button>
            ))}
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold text-neutral-700 mb-2">
              Currently Selected: {templates.find((t) => t.id === selectedTemplate)?.name}
            </p>
            <p className="text-xs text-neutral-600">
              This template will be used for all result sheets generated in your school.
              Changes will apply to new downloads only.
            </p>
          </div>

          <Button onClick={handleSaveTemplate} loading={saveLoading}>
            Save Template Settings
          </Button>
        </div>

        {/* Other Settings Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            Other Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">Email Notifications</p>
                <p className="text-sm text-neutral-600">
                  Receive emails when teachers submit results
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">Auto-approve Results</p>
                <p className="text-sm text-neutral-600">
                  Automatically approve results when submitted
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <Modal
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        title={`Preview: ${templates.find((t) => t.id === previewTemplate)?.name}`}
        size="xl"
      >
        <div className="bg-neutral-100 p-8 rounded-lg max-h-[70vh] overflow-y-auto">
          {previewTemplate === 'classic' && (
            <ClassicResultSheet result={demoResult} school={demoSchool} />
          )}
          {previewTemplate === 'modern' && (
            <ModernResultSheet result={demoResult} school={demoSchool} />
          )}
          {previewTemplate === 'hybrid' && (
            <div className="text-center py-12">
              <p className="text-neutral-600">Hybrid template preview coming soon...</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => setPreviewTemplate(null)} className="flex-1">
            Close Preview
          </Button>
          <Button
            onClick={() => {
              if (previewTemplate) {
                setSelectedTemplate(previewTemplate);
                setPreviewTemplate(null);
              }
            }}
            className="flex-1"
          >
            Use This Template
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
