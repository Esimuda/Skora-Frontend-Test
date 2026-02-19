import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user?.role === 'teacher' 
    ? [
        { to: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
        { to: '/teacher/students', label: 'Students', icon: '👥' },
        { to: '/teacher/subjects', label: 'Subjects', icon: '📚' },
        { to: '/teacher/scores', label: 'Enter Scores', icon: '📝' },
        { to: '/teacher/behavioral', label: 'Behavior', icon: '⭐' },
        { to: '/teacher/submit', label: 'Submit Results', icon: '📤' },
      ]
    : [
        { to: '/principal/dashboard', label: 'Dashboard', icon: '🏠' },
        { to: '/principal/teachers', label: 'Teachers', icon: '👨‍🏫' },
        { to: '/principal/classes', label: 'Classes', icon: '📚' },
        { to: '/principal/approvals', label: 'Approvals', icon: '✅' },
        { to: '/principal/downloads', label: 'Downloads', icon: '📥' },
        { to: '/principal/settings', label: 'Settings', icon: '⚙️' },
      ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white font-display">S</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gradient">Skora RMS</div>
                <div className="text-xs text-neutral-500">Result Management</div>
              </div>
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-neutral-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-neutral-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="card sticky top-24">
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors font-medium"
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 font-display">
                {title}
              </h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
