import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  route?: string;
}

type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export const SubmitResultsPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SubmissionStatus>('draft');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Checklist items
  const [checklist] = useState<ChecklistItem[]>([
    {
      id: 'students',
      label: 'Students Added',
      description: '3 students added to JSS 2A',
      completed: true,
      route: '/teacher/students',
    },
    {
      id: 'subjects',
      label: 'Subjects Configured',
      description: '5 subjects (Mathematics, English, Basic Science, Basic Tech, Civic Ed)',
      completed: true,
      route: '/teacher/subjects',
    },
    {
      id: 'scores',
      label: 'All Scores Entered',
      description: 'CA1, CA2, and Exam scores for all students in all subjects',
      completed: true,
      route: '/teacher/scores',
    },
    {
      id: 'behavioral',
      label: 'Behavioral Assessment',
      description: 'Rated 8 behavioral metrics for all students',
      completed: true,
      route: '/teacher/scores',
    },
    {
      id: 'comments',
      label: 'Teacher Comments',
      description: 'Written comments for all 3 students',
      completed: true,
      route: '/teacher/comments',
    },
  ]);

  const allCompleted = checklist.every((item) => item.completed);
  const completionPercentage = (checklist.filter((i) => i.completed).length / checklist.length) * 100;

  const handleSubmit = async () => {
    if (!allCompleted) {
      alert('Please complete all sections before submitting.');
      return;
    }

    if (!confirm('Are you sure you want to submit these results to the principal for approval?')) {
      return;
    }

    setSubmitLoading(true);

    // Simulate API call
    setTimeout(() => {
      setStatus('submitted');
      setSubmitLoading(false);
      alert(
        '✅ Results Submitted Successfully!\n\n' +
        'Your results have been sent to the principal for review and approval.\n\n' +
        'You will be notified once they are approved.'
      );
    }, 2000);
  };

  const handleWithdraw = () => {
    if (!confirm('Are you sure you want to withdraw this submission?')) {
      return;
    }

    setStatus('draft');
    alert('Results withdrawn. You can make changes and resubmit.');
  };

  return (
    <DashboardLayout title="Submit Results">
      <div className="space-y-6">
        {/* Status Banner */}
        {status === 'draft' && (
          <div className="card bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <div>
                <h3 className="font-bold text-neutral-900">Draft</h3>
                <p className="text-sm text-neutral-600">
                  Complete all sections and submit for principal approval
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'submitted' && (
          <div className="card bg-secondary-50 border border-secondary-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏳</span>
              <div className="flex-1">
                <h3 className="font-bold text-secondary-900">Submitted - Awaiting Approval</h3>
                <p className="text-sm text-secondary-700">
                  Your results have been submitted to the principal for review
                </p>
                <p className="text-xs text-secondary-600 mt-1">
                  Submitted on: {new Date().toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleWithdraw}>
                Withdraw
              </Button>
            </div>
          </div>
        )}

        {status === 'approved' && (
          <div className="card bg-green-50 border border-green-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="font-bold text-green-900">Approved</h3>
                <p className="text-sm text-green-700">
                  Results have been approved by the principal. Students can now download their results.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Approved on: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="card bg-accent-50 border border-accent-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <h3 className="font-bold text-accent-900">Rejected</h3>
                <p className="text-sm text-accent-700">
                  Results were rejected by the principal. Please review the feedback and resubmit.
                </p>
                <div className="mt-2 p-3 bg-white rounded border border-accent-200">
                  <p className="text-xs font-semibold text-accent-900 mb-1">Principal's Feedback:</p>
                  <p className="text-sm text-accent-700">
                    Please review the scores for student JSS2A/002. Some subjects seem incomplete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Card */}
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold">Submission Checklist</h3>
              <p className="text-sm opacity-90">Complete all items before submitting</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {checklist.filter((i) => i.completed).length}/{checklist.length}
              </p>
              <p className="text-sm opacity-90">Items</p>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-400 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Submission Checklist</h2>
          <div className="space-y-3">
            {checklist.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  item.completed
                    ? 'bg-green-50 border-green-300'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-300 text-neutral-600'
                    }`}
                  >
                    {item.completed ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-bold ${
                        item.completed ? 'text-green-900' : 'text-neutral-900'
                      }`}
                    >
                      {item.label}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        item.completed ? 'text-green-700' : 'text-neutral-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {!item.completed && item.route && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(item.route!)}
                    >
                      Complete
                    </Button>
                  )}
                  {item.completed && item.route && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(item.route!)}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Submission Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Class</p>
              <p className="text-2xl font-bold text-neutral-900">JSS 2A</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-neutral-900">3</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Total Subjects</p>
              <p className="text-2xl font-bold text-neutral-900">5</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Once submitted, you will not be able to edit the results
              until the principal reviews them. Please ensure all information is accurate before
              submitting.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        {status === 'draft' && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>
              Save as Draft
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitLoading}
              disabled={!allCompleted}
              size="lg"
            >
              📤 Submit for Approval
            </Button>
          </div>
        )}

        {status === 'rejected' && (
          <div className="flex justify-end">
            <Button onClick={handleSubmit} loading={submitLoading} size="lg">
              🔄 Resubmit Results
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
