import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

export const TeacherDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { label: 'My Classes', value: '2', icon: '📚', color: 'bg-primary-100 text-primary-700' },
    { label: 'Total Students', value: '68', icon: '👥', color: 'bg-secondary-100 text-secondary-700' },
    { label: 'Subjects', value: '10', icon: '📖', color: 'bg-purple-100 text-purple-700' },
    { label: 'Pending Submissions', value: '1', icon: '⏳', color: 'bg-accent-100 text-accent-700' },
  ];

  const recentActivity = [
    { action: 'Added scores for Mathematics - JSS 2A', time: '2 hours ago', icon: '✅' },
    { action: 'Updated behavioral assessment for 15 students', time: '1 day ago', icon: '⭐' },
    { action: 'Submitted First Term results for JSS 2A', time: '3 days ago', icon: '📤' },
  ];

  const pendingTasks = [
    { task: 'Enter scores for English Language - JSS 2B', due: 'Due in 2 days', priority: 'high' },
    { task: 'Complete behavioral assessments - JSS 2A', due: 'Due in 5 days', priority: 'medium' },
    { task: 'Add teacher comments for all students', due: 'Due in 1 week', priority: 'low' },
  ];

  return (
    <DashboardLayout title={`Welcome back, ${user?.firstName}!`}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="card card-hover animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Pending Tasks
            </h2>
            <div className="space-y-3">
              {pendingTasks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-50 rounded-lg border-l-4 hover:bg-neutral-100 transition-colors"
                  style={{
                    borderLeftColor:
                      item.priority === 'high' ? '#ef4444' : item.priority === 'medium' ? '#f0b000' : '#0f9d99',
                  }}
                >
                  <p className="font-medium text-neutral-900">{item.task}</p>
                  <p className="text-sm text-neutral-500 mt-1">{item.due}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span>🕒</span>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900">{item.action}</p>
                    <p className="text-xs text-neutral-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">📝</div>
              <div className="font-semibold mb-1">Enter Scores</div>
              <div className="text-sm opacity-90">Add CA and exam scores</div>
            </button>

            <button className="p-6 bg-gradient-to-br from-secondary-500 to-secondary-600 text-neutral-900 rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold mb-1">Manage Students</div>
              <div className="text-sm opacity-90">Add or edit student details</div>
            </button>

            <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold mb-1">Behavioral Ratings</div>
              <div className="text-sm opacity-90">Rate student behavior</div>
            </button>
          </div>
        </div>

        {/* Term Info */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Current Term: First Term</h3>
              <p className="text-sm opacity-90">Academic Year: 2024/2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Submission Deadline</p>
              <p className="text-xl font-bold">December 15, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
