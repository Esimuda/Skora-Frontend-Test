import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { localStorageService } from '@/lib/localStorage';

interface PendingSubmission {
  id: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  subjectCount: number;
  submittedAt: string;
  term: string;
  academicYear: string;
}

interface StudentResult {
  id: string;
  admissionNumber: string;
  name: string;
  totalScore: number;
  percentage: number;
  position: number;
  teacherComment: string;
}

export const ApprovalsPage = () => {
  const [pendingSubmissions] = useState<PendingSubmission[]>([
    {
      id: '1',
      classId: 'JSS2A',
      className: 'JSS 2A',
      teacherId: 'teacher-1',
      teacherName: 'Mrs. Adebayo Folake',
      studentCount: 3,
      subjectCount: 5,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      term: 'first',
      academicYear: '2024/2025',
    },
    {
      id: '2',
      classId: 'JSS1B',
      className: 'JSS 1B',
      teacherId: 'teacher-2',
      teacherName: 'Mr. Okonkwo John',
      studentCount: 35,
      subjectCount: 10,
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      term: 'first',
      academicYear: '2024/2025',
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [principalComments, setPrincipalComments] = useState<Record<string, string>>({});
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Demo student results for selected submission
  const studentResults: StudentResult[] = [
    {
      id: '1',
      admissionNumber: 'JSS2A/001',
      name: 'ADEYEMI OLUWASEUN DAVID',
      totalScore: 435,
      percentage: 87.0,
      position: 1,
      teacherComment: 'Excellent performance this term. Keep up the outstanding work!',
    },
    {
      id: '2',
      admissionNumber: 'JSS2A/002',
      name: 'OKAFOR CHIDINMA',
      totalScore: 412,
      percentage: 82.4,
      position: 2,
      teacherComment: 'Very good performance. Continue to work hard and aim higher.',
    },
    {
      id: '3',
      admissionNumber: 'JSS2A/003',
      name: 'MUSA IBRAHIM YAKUBU',
      totalScore: 391,
      percentage: 78.2,
      position: 3,
      teacherComment: 'Good effort this term. With more dedication, you can achieve better results.',
    },
  ];

  const openReviewModal = (submission: PendingSubmission) => {
    setSelectedSubmission(submission);
    setIsReviewModalOpen(true);

    // Load saved principal comments
    studentResults.forEach((student) => {
      const saved = localStorageService.getComment(submission.classId, student.id, 'principal');
      if (saved && saved.comment) {
        setPrincipalComments((prev) => ({ ...prev, [student.id]: saved.comment }));
      }
    });
  };

  const handlePrincipalCommentChange = (studentId: string, comment: string) => {
    setPrincipalComments((prev) => ({ ...prev, [studentId]: comment }));
    
    if (selectedSubmission) {
      localStorageService.saveComment(selectedSubmission.classId, studentId, comment, 'principal');
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    // Check if all students have principal comments
    const missingComments = studentResults.filter(
      (student) => !principalComments[student.id] || principalComments[student.id].trim() === ''
    );

    if (missingComments.length > 0) {
      if (
        !confirm(
          `${missingComments.length} student(s) don't have principal comments.\n\nDo you want to approve anyway?`
        )
      ) {
        return;
      }
    }

    if (
      !confirm(
        `Approve results for ${selectedSubmission.className}?\n\n` +
        `This will make the results available for download by students.`
      )
    ) {
      return;
    }

    setApproveLoading(true);

    // Simulate API call
    setTimeout(() => {
      setApproveLoading(false);
      setIsReviewModalOpen(false);
      alert(
        '✅ Results Approved!\n\n' +
        `Results for ${selectedSubmission.className} have been approved.\n\n` +
        'Students can now download their results from the portal.'
      );
    }, 2000);
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    if (
      !confirm(
        `Reject results for ${selectedSubmission.className}?\n\n` +
        `The teacher will be notified and can make corrections.`
      )
    ) {
      return;
    }

    setRejectLoading(true);

    // Simulate API call
    setTimeout(() => {
      setRejectLoading(false);
      setIsReviewModalOpen(false);
      setRejectionReason('');
      alert(
        '❌ Results Rejected\n\n' +
        `Results for ${selectedSubmission.className} have been rejected.\n\n` +
        'The teacher has been notified and can make corrections.'
      );
    }, 2000);
  };

  const getSuggestedPrincipalComment = (percentage: number, position: number) => {
    if (position === 1) {
      return 'Outstanding achievement! Continue to set the pace for your classmates.';
    } else if (percentage >= 80) {
      return 'Excellent performance. I am very proud of your achievement.';
    } else if (percentage >= 70) {
      return 'Well done! Keep working hard to achieve excellence.';
    } else if (percentage >= 60) {
      return 'Good effort. Continue to strive for improvement.';
    } else if (percentage >= 50) {
      return 'Fair performance. Please see your class teacher for guidance.';
    } else {
      return 'More effort needed. Please seek extra help from your teachers.';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <DashboardLayout title="Approve Results">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-neutral-900">{pendingSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approved This Week</p>
                <p className="text-3xl font-bold text-neutral-900">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {pendingSubmissions.reduce((sum, s) => sum + s.studentCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Pending Submissions</h2>

          {pendingSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Class</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Teacher</th>
                    <th className="text-center py-3 px-4 font-semibold text-neutral-700">Students</th>
                    <th className="text-center py-3 px-4 font-semibold text-neutral-700">Subjects</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Submitted</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td className="py-3 px-4 font-medium text-neutral-900">
                        {submission.className}
                        <p className="text-xs text-neutral-500">
                          {submission.term} Term {submission.academicYear}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{submission.teacherName}</td>
                      <td className="py-3 px-4 text-center font-semibold text-neutral-900">
                        {submission.studentCount}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-neutral-900">
                        {submission.subjectCount}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 text-xs">
                        {getTimeAgo(submission.submittedAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => openReviewModal(submission)}
                        >
                          👁️ Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-lg">
              <span className="text-5xl mb-3 block">📋</span>
              <p className="text-neutral-600 mb-2">No pending submissions</p>
              <p className="text-sm text-neutral-500">
                All results have been reviewed and approved
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review Results: ${selectedSubmission?.className}`}
        size="xl"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">Teacher:</p>
                  <p className="font-semibold">{selectedSubmission.teacherName}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Students:</p>
                  <p className="font-semibold">{selectedSubmission.studentCount}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Subjects:</p>
                  <p className="font-semibold">{selectedSubmission.subjectCount}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Submitted:</p>
                  <p className="font-semibold">{getTimeAgo(selectedSubmission.submittedAt)}</p>
                </div>
              </div>
            </div>

            {/* Student Results with Principal Comments */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {studentResults.map((student) => (
                <div key={student.id} className="p-4 border border-neutral-200 rounded-lg">
                  {/* Student Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.position}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-neutral-900">{student.name}</h4>
                      <p className="text-xs text-neutral-500">{student.admissionNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-700">{student.percentage}%</p>
                      <p className="text-xs text-neutral-500">{student.totalScore} marks</p>
                    </div>
                  </div>

                  {/* Teacher Comment */}
                  <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Teacher's Comment:</p>
                    <p className="text-sm text-blue-700">{student.teacherComment}</p>
                  </div>

                  {/* Principal Comment Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-neutral-700">
                        Principal's Comment:
                      </label>
                      <button
                        onClick={() =>
                          handlePrincipalCommentChange(
                            student.id,
                            getSuggestedPrincipalComment(student.percentage, student.position)
                          )
                        }
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        ✨ Quick Suggest
                      </button>
                    </div>
                    <textarea
                      value={principalComments[student.id] || ''}
                      onChange={(e) => handlePrincipalCommentChange(student.id, e.target.value)}
                      placeholder="Enter principal's comment..."
                      className="w-full p-3 border border-neutral-300 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Rejection Reason (Optional) */}
            <div className="p-4 bg-accent-50 border border-accent-200 rounded-lg">
              <label className="block text-sm font-semibold text-accent-900 mb-2">
                Rejection Reason (if applicable):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide reason if you're rejecting these results..."
                className="w-full p-3 border border-accent-300 rounded-lg text-sm"
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                loading={rejectLoading}
                disabled={!rejectionReason.trim()}
                className="flex-1 border-accent-300 text-accent-600 hover:bg-accent-50"
              >
                ❌ Reject
              </Button>
              <Button onClick={handleApprove} loading={approveLoading} className="flex-1">
                ✅ Approve Results
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
