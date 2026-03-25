import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

type Step = 'school' | 'admin' | 'template';

export const SignupPageEnhanced = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<Step>('school');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'hybrid'>('classic');
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    schoolAddress: '',
    schoolEmail: '',
    phoneNumber: '',
    motto: '',
    logo: '', // Base64 logo string
  });

  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, logo: 'Please select an image file' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, logo: 'Image size should be less than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogoPreview(base64String);
      setSchoolData({ ...schoolData, logo: base64String });
      setErrors({ ...errors, logo: '' });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview('');
    setSchoolData({ ...schoolData, logo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'school' | 'admin'
  ) => {
    const { name, value } = e.target;
    if (section === 'school') {
      setSchoolData({ ...schoolData, [name]: value });
    } else {
      setAdminData({ ...adminData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = {
        id: 'admin-123',
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: 'school_admin' as const,
        schoolId: 'school-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = 'demo-token-' + Date.now();

      // Save school data to localStorage (in production, this would go to backend)
      localStorage.setItem('skora_school_data', JSON.stringify({
        ...schoolData,
        templateId: selectedTemplate,
      }));

      login(user, token);
      setLoading(false);
      navigate('/principal/dashboard');
    }, 2000);
  };

  const getStepProgress = () => {
    const steps = ['school', 'admin', 'template'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4">
            <span className="text-3xl font-bold text-white font-display">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Create School Account</h1>
          <p className="text-neutral-600">Set up your school on Skora RMS</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className={currentStep === 'school' ? 'text-primary-600' : 'text-neutral-400'}>
              School Info
            </span>
            <span className={currentStep === 'admin' ? 'text-primary-600' : 'text-neutral-400'}>
              Administrator
            </span>
            <span className={currentStep === 'template' ? 'text-primary-600' : 'text-neutral-400'}>
              Template
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          {/* Step 1: School Information */}
          {currentStep === 'school' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">School Information</h2>

              <Input
                label="School Name"
                name="schoolName"
                placeholder="e.g., Government Secondary School, Ikeja"
                value={schoolData.schoolName}
                onChange={(e) => handleInputChange(e, 'school')}
                error={errors.schoolName}
                icon={<span>🏫</span>}
              />

              <Input
                label="School Address"
                name="schoolAddress"
                placeholder="Full address including state"
                value={schoolData.schoolAddress}
                onChange={(e) => handleInputChange(e, 'school')}
                error={errors.schoolAddress}
                icon={<span>📍</span>}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="School Email"
                  type="email"
                  name="schoolEmail"
                  placeholder="info@school.edu.ng"
                  value={schoolData.schoolEmail}
                  onChange={(e) => handleInputChange(e, 'school')}
                  error={errors.schoolEmail}
                  icon={<span>📧</span>}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+234 803 456 7890"
                  value={schoolData.phoneNumber}
                  onChange={(e) => handleInputChange(e, 'school')}
                  error={errors.phoneNumber}
                  icon={<span>📞</span>}
                />
              </div>

              <Input
                label="School Motto (Optional)"
                name="motto"
                placeholder="e.g., Knowledge is Power"
                value={schoolData.motto}
                onChange={(e) => handleInputChange(e, 'school')}
                icon={<span>💡</span>}
              />

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  School Logo (Optional)
                </label>
                
                {!logoPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <div className="text-5xl mb-3">🏫</div>
                    <p className="text-sm font-medium text-neutral-700 mb-1">
                      Click to upload school logo
                    </p>
                    <p className="text-xs text-neutral-500">
                      PNG, JPG or GIF (Max 2MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-primary-300 rounded-lg p-4 bg-primary-50">
                    <div className="flex items-center gap-4">
                      <img
                        src={logoPreview}
                        alt="School Logo Preview"
                        className="w-24 h-24 object-contain bg-white rounded-lg border border-neutral-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 mb-1">
                          Logo uploaded successfully
                        </p>
                        <p className="text-xs text-neutral-600">
                          This logo will appear on all result sheets
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={removeLogo}>
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
                {errors.logo && (
                  <p className="mt-1.5 text-sm text-accent-600">{errors.logo}</p>
                )}
              </div>

              <Button onClick={handleNext} className="w-full">
                Next: Administrator Account →
              </Button>
            </div>
          )}

          {/* Step 2: Administrator Account */}
          {currentStep === 'admin' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Administrator Account</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  value={adminData.firstName}
                  onChange={(e) => handleInputChange(e, 'admin')}
                  error={errors.firstName}
                  icon={<span>👤</span>}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  value={adminData.lastName}
                  onChange={(e) => handleInputChange(e, 'admin')}
                  error={errors.lastName}
                  icon={<span>👤</span>}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="principal@school.edu.ng"
                value={adminData.email}
                onChange={(e) => handleInputChange(e, 'admin')}
                error={errors.email}
                icon={<span>📧</span>}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                value={adminData.password}
                onChange={(e) => handleInputChange(e, 'admin')}
                error={errors.password}
                icon={<span>🔒</span>}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={adminData.confirmPassword}
                onChange={(e) => handleInputChange(e, 'admin')}
                error={errors.confirmPassword}
                icon={<span>🔒</span>}
              />

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  ← Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Next: Choose Template →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Template Selection */}
          {currentStep === 'template' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Choose Result Template</h2>
              <p className="text-sm text-neutral-600 mb-6">
                Select the design that will be used for all student result sheets
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'classic' as const,
                    name: 'Classic',
                    description: 'Traditional formal design',
                    icon: '📄',
                    color: 'from-neutral-600 to-neutral-800',
                  },
                  {
                    id: 'modern' as const,
                    name: 'Modern',
                    description: 'Contemporary gradient style',
                    icon: '✨',
                    color: 'from-purple-600 to-purple-800',
                  },
                  {
                    id: 'hybrid' as const,
                    name: 'Hybrid',
                    description: 'Professional balanced design',
                    icon: '🎯',
                    color: 'from-primary-600 to-primary-800',
                  },
                ].map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div
                      className={`w-full h-24 bg-gradient-to-br ${template.color} rounded-lg mb-3 flex items-center justify-center`}
                    >
                      <span className="text-4xl">{template.icon}</span>
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-neutral-600">{template.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  ← Back
                </Button>
                <Button onClick={handleSubmit} loading={loading} className="flex-1">
                  🎉 Create School Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
