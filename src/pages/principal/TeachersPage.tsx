import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Teacher {
  id: string;
  name: string;
  email: string;
  classes: string[];
  status: 'pending' | 'active' | 'inactive';
  invitedAt: string;
}

export const TeachersPage = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo teachers data
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Mrs. Adebayo Folake',
      email: 'fadebayo@school.com',
      classes: ['JSS 1A', 'JSS 1B'],
      status: 'active',
      invitedAt: '2024-09-15',
    },
    {
      id: '2',
      name: 'Mr. Okonkwo John',
      email: 'jokonkwo@school.com',
      classes: ['JSS 2A'],
      status: 'active',
      invitedAt: '2024-09-15',
    },
    {
      id: '3',
      name: 'Miss Ibrahim Aisha',
      email: 'aibrahim@school.com',
      classes: ['SS 1 Science'],
      status: 'active',
      invitedAt: '2024-10-01',
    },
    {
      id: '4',
      name: 'Mr. Chukwu Emmanuel',
      email: 'echukwu@school.com',
      classes: [],
      status: 'pending',
      invitedAt: '2024-11-20',
    },
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInvite = async () => {
    if (!validateForm()) return;

    setInviteLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Generate invite link
      const baseUrl = window.location.origin;
      const token = btoa(formData.email + Date.now());
      const link = `${baseUrl}/invite/accept?token=${token}`;
      
      setInviteLink(link);
      setInviteLoading(false);
    }, 1500);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const resetModal = () => {
    setFormData({ firstName: '', lastName: '', email: '' });
    setInviteLink('');
    setErrors({});
    setIsInviteModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'badge badge-success',
      pending: 'badge badge-warning',
      inactive: 'badge badge-danger',
    };
    return badges[status as keyof typeof badges] || 'badge';
  };

  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const pendingInvites = teachers.filter((t) => t.status === 'pending').length;

  return (
    <DashboardLayout title="Teachers Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Teachers</p>
                <p className="text-3xl font-bold text-neutral-900">{teachers.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Active Teachers</p>
                <p className="text-3xl font-bold text-neutral-900">{activeTeachers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Pending Invites</p>
                <p className="text-3xl font-bold text-neutral-900">{pendingInvites}</p>
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
            <h2 className="text-xl font-bold text-neutral-900">All Teachers</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Manage your school's teaching staff
            </p>
          </div>
          <Button onClick={() => setIsInviteModalOpen(true)} icon={<span>📧</span>}>
            Invite Teacher
          </Button>
        </div>

        {/* Teachers Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Teacher
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Classes Assigned
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                    Invited On
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      {teacher.name}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{teacher.email}</td>
                    <td className="py-3 px-4">
                      {teacher.classes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.map((cls, idx) => (
                            <span
                              key={idx}
                              className="badge badge-info text-xs"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-xs">No classes assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(teacher.status)}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">
                      {new Date(teacher.invitedAt).toLocaleDateString()}
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

      {/* Invite Teacher Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={resetModal}
        title="Invite Teacher"
        size="md"
      >
        {!inviteLink ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Send an email invitation to a teacher. They'll receive a link to join your
              school.
            </p>

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
              label="Email Address"
              type="email"
              name="email"
              placeholder="teacher@school.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              icon={<span>📧</span>}
            />

            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <p className="text-xs font-semibold text-neutral-700 mb-2">
                ℹ️ What happens next:
              </p>
              <ul className="text-xs text-neutral-600 space-y-1">
                <li>• Teacher receives email with invitation link</li>
                <li>• They complete their profile using the link</li>
                <li>• You can assign them to classes after they join</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={resetModal} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleInvite} loading={inviteLoading} className="flex-1">
                Send Invitation
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-700 font-semibold mb-2 flex items-center gap-2">
                <span>✅</span>
                Invitation Created Successfully!
              </p>
              <p className="text-sm text-green-600">
                Share this link with {formData.firstName} {formData.lastName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Invitation Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="input-field flex-1 bg-neutral-50"
                />
                <Button onClick={copyInviteLink} variant="outline">
                  📋 Copy
                </Button>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-neutral-700 mb-2">
                📧 Email Preview:
              </p>
              <div className="text-xs text-neutral-600 space-y-2">
                <p>
                  <strong>To:</strong> {formData.email}
                </p>
                <p>
                  <strong>Subject:</strong> You've been invited to join [School Name] on
                  Skora
                </p>
                <div className="mt-2 p-3 bg-white rounded border border-neutral-200">
                  <p>Hi {formData.firstName},</p>
                  <p className="mt-2">
                    You've been invited to join [School Name] as a teacher on Skora RMS.
                  </p>
                  <p className="mt-2">
                    Click the link below to complete your registration:
                  </p>
                  <p className="mt-2 text-primary-600 break-all">{inviteLink}</p>
                </div>
              </div>
            </div>

            <Button onClick={resetModal} className="w-full">
              Done
            </Button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
