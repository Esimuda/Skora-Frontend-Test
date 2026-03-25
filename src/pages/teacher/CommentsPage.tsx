import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { localStorageService } from '@/lib/localStorage';

interface Student {
  id: string;
  admissionNumber: string;
  name: string;
  totalScore?: number;
  percentage?: number;
  position?: number;
}

export const CommentsPage = () => {
  const classId = 'JSS2A'; // Would come from context/route params
  const term = 'first';
  const academicYear = '2024/2025';

  // Demo students with scores
  const students: Student[] = [
    { id: '1', admissionNumber: 'JSS2A/001', name: 'ADEYEMI OLUWASEUN DAVID', totalScore: 520, percentage: 86.7, position: 1 },
    { id: '2', admissionNumber: 'JSS2A/002', name: 'OKAFOR CHIDINMA', totalScore: 495, percentage: 82.5, position: 2 },
    { id: '3', admissionNumber: 'JSS2A/003', name: 'MUSA IBRAHIM YAKUBU', totalScore: 470, percentage: 78.3, position: 3 },
  ];

  const [comments, setComments] = useState<Record<string, string>>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved comments on mount
  useEffect(() => {
    students.forEach((student) => {
      const saved = localStorageService.getComment(classId, student.id, 'teacher');
      if (saved && saved.comment) {
        setComments((prev) => ({ ...prev, [student.id]: saved.comment }));
      }
    });
  }, []);

  const handleCommentChange = (studentId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [studentId]: comment }));
    
    // Auto-save to local storage (debounced)
    setTimeout(() => {
      localStorageService.saveComment(classId, studentId, comment, 'teacher');
      setLastSaved(new Date());
    }, 1000);
  };

  const handleSaveAll = async () => {
    setSaveLoading(true);

    // Simulate API call
    setTimeout(() => {
      Object.entries(comments).forEach(([studentId, comment]) => {
        localStorageService.saveComment(classId, studentId, comment, 'teacher');
      });
      
      setSaveLoading(false);
      setLastSaved(new Date());
      alert('All comments saved successfully! ✅');
    }, 1500);
  };

  const getSuggestedComment = (percentage: number) => {
    if (percentage >= 80) {
      return "Excellent performance this term. Keep up the outstanding work!";
    } else if (percentage >= 70) {
      return "Very good performance. Continue to work hard and aim higher.";
    } else if (percentage >= 60) {
      return "Good effort this term. With more dedication, you can achieve better results.";
    } else if (percentage >= 50) {
      return "Fair performance. You need to put in more effort and seek help where needed.";
    } else {
      return "Needs improvement. Please see your teacher for extra support and guidance.";
    }
  };

  const useSuggestedComment = (studentId: string, percentage: number) => {
    const suggested = getSuggestedComment(percentage);
    handleCommentChange(studentId, suggested);
  };

  const getCompletionStats = () => {
    const total = students.length;
    const completed = Object.values(comments).filter((c) => c && c.trim().length > 0).length;
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const stats = getCompletionStats();

  return (
    <DashboardLayout title="Teacher Comments">
      <div className="space-y-6">
        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className="text-sm text-neutral-600 flex items-center gap-2">
            <span>💾</span>
            <span>Last saved: {lastSaved.toLocaleTimeString()} (auto-saved locally)</span>
          </div>
        )}

        {/* Progress Card */}
        <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold">Comments Progress</h3>
              <p className="text-sm opacity-90">
                Class: {classId} • {term} Term {academicYear}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {stats.completed}/{stats.total}
              </p>
              <p className="text-sm opacity-90">Students</p>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-400 transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Writing Effective Comments</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific about the student's strengths and areas for improvement</li>
                <li>• Mention notable achievements or improvements</li>
                <li>• Provide constructive feedback and encouragement</li>
                <li>• Keep it professional and positive</li>
                <li>• Use "Quick Suggest" for standard comments based on performance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            Student Comments ({stats.completed}/{stats.total} completed)
          </h2>
          <Button onClick={handleSaveAll} loading={saveLoading}>
            💾 Save All Comments
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {students.map((student, idx) => (
            <div
              key={student.id}
              className="card animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Student Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.position}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{student.name}</h3>
                      <p className="text-sm text-neutral-600">
                        Admission No: {student.admissionNumber}
                      </p>
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600">Position:</span>
                      <span className="font-bold text-primary-700">
                        {student.position}
                        {student.position === 1 ? 'st' : student.position === 2 ? 'nd' : student.position === 3 ? 'rd' : 'th'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600">Total Score:</span>
                      <span className="font-bold text-primary-700">{student.totalScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600">Average:</span>
                      <span className="font-bold text-primary-700">{student.percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Suggest Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => useSuggestedComment(student.id, student.percentage || 0)}
                >
                  ✨ Quick Suggest
                </Button>
              </div>

              {/* Comment Textarea */}
              <div className="relative">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Teacher's Comment
                </label>
                <textarea
                  value={comments[student.id] || ''}
                  onChange={(e) => handleCommentChange(student.id, e.target.value)}
                  placeholder="Enter your comment for this student... (e.g., 'Excellent performance this term. Keep up the good work!')"
                  className="w-full p-4 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition-all"
                  rows={3}
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                  {(comments[student.id] || '').length}/500
                </div>
              </div>

              {/* Character count indicator */}
              {comments[student.id] && comments[student.id].length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        (comments[student.id] || '').length < 250
                          ? 'bg-green-500'
                          : (comments[student.id] || '').length < 400
                          ? 'bg-secondary-500'
                          : 'bg-accent-500'
                      }`}
                      style={{
                        width: `${((comments[student.id] || '').length / 500) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500">
                    {(comments[student.id] || '').length < 250
                      ? 'Good length'
                      : (comments[student.id] || '').length < 400
                      ? 'Detailed'
                      : 'Maximum length'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveAll} loading={saveLoading} size="lg">
            💾 Save All Comments
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
