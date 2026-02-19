import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

type Step = 'school' | 'admin' | 'template';

export const SignupPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [currentStep, setCurrentStep] = useState<Step>('school');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'hybrid'>('classic');

  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    schoolAddress: '',
    schoolEmail: '',
    phoneNumber: '',
    motto: '',
  });

  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSchoolStep = () => {
    const newErrors: Record<string, string> = {};

    if (!schoolData.schoolName) newErrors.schoolName = 'School name is required';
    if (!schoolData.schoolAddress) newErrors.schoolAddress = 'Address is required';
    if (!schoolData.schoolEmail) {
      newErrors.schoolEmail = 'School email is required';
    } else if (!/\S+@\S+\.\S+/.test(schoolData.schoolEmail)) {
      newErrors.schoolEmail = 'Invalid email format';
    }
    if (!schoolData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(schoolData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdminStep = () => {
    const newErrors: Record<string, string> = {};

    if (!adminData.firstName) newErrors.firstName = 'First name is required';
    if (!adminData.lastName) newErrors.lastName = 'Last name is required';
    if (!adminData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(adminData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!adminData.password) {
      newErrors.password = 'Password is required';
    } else if (adminData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (adminData.password !== adminData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (currentStep === 'school' && validateSchoolStep()) {
      setCurrentStep('admin');
    } else if (currentStep === 'admin' && validateAdminStep()) {
      setCurrentStep('template');
    }
  };

  const handleBack = () => {
    if (currentStep === 'admin') setCurrentStep('school');
    if (currentStep === 'template') setCurrentStep('admin');
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create demo user
      const newUser = {
        id: 'user-' + Date.now(),
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: 'school_admin' as const,
        schoolId: 'school-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = 'jwt-token-' + Date.now();

      // Login the new user
      login(newUser, token);
      setLoading(false);

      // Redirect to principal dashboard
      navigate('/principal/dashboard');
    }, 2000);
  };

  const progress = {
    school: 33,
    admin: 66,
    template: 100,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-skora-lg">
            <span className="text-4xl font-bold text-white font-display">S</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-display">
            Create School Account
          </h1>
          <p className="text-neutral-600">Join thousands of schools using Skora</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${currentStep === 'school' ? 'text-primary-600' : 'text-neutral-400'}`}>
              School Details
            </span>
            <span className={`text-sm font-medium ${currentStep === 'admin' ? 'text-primary-600' : 'text-neutral-400'}`}>
              Admin Account
            </span>
            <span className={`text-sm font-medium ${currentStep === 'template' ? 'text-primary-600' : 'text-neutral-400'}`}>
              Result Template
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${progress[currentStep]}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="card animate-slide-up">
          {/* Step 1: School Details */}
          {currentStep === 'school' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                School Information
              </h2>

              <Input
                label="School Name"
                name="schoolName"
                placeholder="e.g., Government Secondary School, Ikeja"
                value={schoolData.schoolName}
                onChange={handleSchoolChange}
                error={errors.schoolName}
                icon={<span>🏫</span>}
              />

              <Input
                label="School Address"
                name="schoolAddress"
                placeholder="Full address of the school"
                value={schoolData.schoolAddress}
                onChange={handleSchoolChange}
                error={errors.schoolAddress}
                icon={<span>📍</span>}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="School Email"
                  type="email"
                  name="schoolEmail"
                  placeholder="admin@school.edu.ng"
                  value={schoolData.schoolEmail}
                  onChange={handleSchoolChange}
                  error={errors.schoolEmail}
                  icon={<span>📧</span>}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+234 xxx xxx xxxx"
                  value={schoolData.phoneNumber}
                  onChange={handleSchoolChange}
                  error={errors.phoneNumber}
                  icon={<span>📞</span>}
                />
              </div>

              <Input
                label="School Motto (Optional)"
                name="motto"
                placeholder="e.g., Knowledge is Power"
                value={schoolData.motto}
                onChange={handleSchoolChange}
                icon={<span>💡</span>}
              />

              <Button onClick={handleNext} className="w-full">
                Continue to Admin Details
              </Button>
            </div>
          )}

          {/* Step 2: Admin Account */}
          {currentStep === 'admin' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Administrator Account
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  value={adminData.firstName}
                  onChange={handleAdminChange}
                  error={errors.firstName}
                  icon={<span>👤</span>}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  value={adminData.lastName}
                  onChange={handleAdminChange}
                  error={errors.lastName}
                  icon={<span>👤</span>}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="your.email@school.com"
                value={adminData.email}
                onChange={handleAdminChange}
                error={errors.email}
                icon={<span>📧</span>}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={adminData.password}
                onChange={handleAdminChange}
                error={errors.password}
                icon={<span>🔒</span>}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={adminData.confirmPassword}
                onChange={handleAdminChange}
                error={errors.confirmPassword}
                icon={<span>🔒</span>}
              />

              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue to Template
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Template Selection */}
          {currentStep === 'template' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Choose Result Sheet Template
              </h2>

              <p className="text-neutral-600 text-sm">
                Select the design that best represents your school. You can change this later in settings.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Classic Template */}
                <button
                  onClick={() => setSelectedTemplate('classic')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate === 'classic'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="w-full h-32 bg-neutral-100 rounded mb-3 flex items-center justify-center border border-neutral-300">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-1">Classic</h3>
                  <p className="text-xs text-neutral-600">
                    Traditional design with formal borders
                  </p>
                </button>

                {/* Modern Template */}
                <button
                  onClick={() => setSelectedTemplate('modern')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate === 'modern'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-purple-800 rounded mb-3 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-1">Modern</h3>
                  <p className="text-xs text-neutral-600">
                    Contemporary with gradient headers
                  </p>
                </button>

                {/* Hybrid Template */}
                <button
                  onClick={() => setSelectedTemplate('hybrid')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate === 'hybrid'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded mb-3 flex items-center justify-center">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-1">Hybrid</h3>
                  <p className="text-xs text-neutral-600">
                    Professional balanced design
                  </p>
                </button>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <strong>Selected:</strong> {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} loading={loading} className="flex-1">
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Login Link */}
          {currentStep === 'school' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
