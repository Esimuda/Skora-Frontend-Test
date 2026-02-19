import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

export const PrincipalDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { label: 'Total Teachers', value: '24', icon: '👨‍🏫', color: 'bg-primary-100 text-primary-700' },
    { label: 'Total Classes', value: '18', icon: '📚', color: 'bg-secondary-100 text-secondary-700' },
    { label: 'Total Students', value: '642', icon: '👥', color: 'bg-purple-100 text-purple-700' },
    { label: 'Pending Approvals', value: '5', icon: '⏳', color: 'bg-accent-100 text-accent-700' },
  ];

  const pendingApprovals = [
    { teacher: 'Mrs. Adebayo', class: 'JSS 1A', students: 35, submitted: '2 hours ago' },
    { teacher: 'Mr. Okonkwo', class: 'JSS 2B', students: 38, submitted: '5 hours ago' },
    { teacher: 'Miss Ibrahim', class: 'SS 1 Science', students: 32, submitted: '1 day ago' },
    { teacher: 'Mr. Chukwu', class: 'JSS 3A', students: 40, submitted: '1 day ago' },
    { teacher: 'Mrs. Bello', class: 'SS 2 Arts', students: 28, submitted: '2 days ago' },
  ];

  const recentActivity = [
    { action: 'Approved results for JSS 1B (Mrs. Okafor)', time: '3 hours ago', icon: '✅' },
    { action: 'Added new teacher: Mr. John Adewale', time: '1 day ago', icon: '👨‍🏫' },
    { action: 'Downloaded JSS 2A results (ZIP)', time: '2 days ago', icon: '📥' },
  ];

  return (
    <DashboardLayout title={`Welcome, Principal ${user?.lastName}!`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Approvals - Takes 2 columns */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <span>⏳</span>
                Pending Result Approvals
              </h2>
              <span className="badge badge-warning">{pendingApprovals.length} Pending</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-2 font-semibold text-neutral-700">Teacher</th>
                    <th className="text-left py-3 px-2 font-semibold text-neutral-700">Class</th>
                    <th className="text-center py-3 px-2 font-semibold text-neutral-700">Students</th>
                    <th className="text-left py-3 px-2 font-semibold text-neutral-700">Submitted</th>
                    <th className="text-right py-3 px-2 font-semibold text-neutral-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((approval, idx) => (
                    <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-2 font-medium text-neutral-900">{approval.teacher}</td>
                      <td className="py-3 px-2 text-neutral-600">{approval.class}</td>
                      <td className="py-3 px-2 text-center text-neutral-600">{approval.students}</td>
                      <td className="py-3 px-2 text-neutral-500 text-xs">{approval.submitted}</td>
                      <td className="py-3 px-2 text-right">
                        <button className="text-primary-600 hover:text-primary-700 font-medium text-xs">
                          Review →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <div className="font-semibold mb-1">Invite Teacher</div>
              <div className="text-sm opacity-90">Send email invite</div>
            </button>

            <button className="p-6 bg-gradient-to-br from-secondary-500 to-secondary-600 text-neutral-900 rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-semibold mb-1">Create Class</div>
              <div className="text-sm opacity-90">Add new class</div>
            </button>

            <button className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold mb-1">Review Results</div>
              <div className="text-sm opacity-90">Approve submissions</div>
            </button>

            <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-left">
              <div className="text-3xl mb-2">📥</div>
              <div className="font-semibold mb-1">Download PDFs</div>
              <div className="text-sm opacity-90">Bulk downloads</div>
            </button>
          </div>
        </div>

        {/* School Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Term Progress */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Term Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Results Submitted</span>
                  <span>13/18 Classes</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Results Approved</span>
                  <span>8/18 Classes</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-400 rounded-full" style={{ width: '44%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Current Term Info */}
          <div className="card bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
            <h3 className="text-lg font-semibold mb-3">Current Academic Term</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-300">Term:</span>
                <span className="font-semibold">First Term</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Session:</span>
                <span className="font-semibold">2024/2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Approval Deadline:</span>
                <span className="font-semibold text-secondary-400">Dec 20, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
