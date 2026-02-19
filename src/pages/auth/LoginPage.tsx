import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Demo: Check email to determine role
      const isDemoTeacher = formData.email.includes('teacher');
      const isDemoPrincipal = formData.email.includes('principal') || formData.email.includes('admin');

      // Create demo user
      const demoUser = {
        id: 'user-123',
        email: formData.email,
        firstName: isDemoTeacher ? 'John' : 'Mary',
        lastName: isDemoTeacher ? 'Okonkwo' : 'Adebayo',
        role: (isDemoTeacher ? 'teacher' : 'school_admin') as 'teacher' | 'school_admin',
        schoolId: 'school-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const demoToken = 'demo-jwt-token-' + Date.now();

      // Login user
      login(demoUser, demoToken);
      setLoading(false);

      // Redirect based on role
      if (demoUser.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/principal/dashboard');
      }
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-skora-lg">
            <span className="text-4xl font-bold text-white font-display">S</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-display">
            Welcome to Skora
          </h1>
          <p className="text-neutral-600">Sign in to manage your school results</p>
        </div>

        {/* Login Form Card */}
        <div className="card animate-slide-up">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your.email@school.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<span>📧</span>}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<span>🔒</span>}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-xs font-semibold text-neutral-700 mb-2">
              🎮 Demo Credentials:
            </p>
            <div className="text-xs text-neutral-600 space-y-1">
              <p>
                <strong>Principal:</strong> principal@school.com (any password)
              </p>
              <p>
                <strong>Teacher:</strong> teacher@school.com (any password)
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">
                New to Skora?
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <Link to="/signup">
              <Button variant="outline" className="w-full">
                Create School Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
