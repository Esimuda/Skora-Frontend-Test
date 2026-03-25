import { useState } from 'react';
// Use HashRouter for GitHub Pages compatibility.
// GitHub Pages does not support client-side routing fallback, so HashRouter ensures all routes work.
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClassicResultSheet } from './templates/ClassicResultSheet';
import { ModernResultSheet } from './templates/ModernResultSheet';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentsPage } from './pages/teacher/StudentsPage';
import { SubjectsPage } from './pages/teacher/SubjectsPage';
import { ScoreEntryPageEnhanced } from './pages/teacher/ScoreEntryPageEnhanced';
import { PrincipalDashboard } from './pages/principal/PrincipalDashboard';
import { TeachersPage } from './pages/principal/TeachersPage';
import { ClassesPage } from './pages/principal/ClassesPage';
import { SettingsPage } from './pages/principal/SettingsPage';
import { useAuthStore } from './store/authStore';
import { StudentResult, School } from './types';
import { CommentsPage } from './pages/teacher/CommentsPage';
import { SubmitResultsPage } from './pages/teacher/SubmitResultsPage';
import { ApprovalsPage } from './pages/principal/ApprovalsPage';
import { DownloadsPage } from './pages/principal/DownloadsPage';
import { SignupPageEnhanced } from './pages/auth/SignupPageEnhanced';
// Demo data for preview
const demoSchool: School = {
  id: 'school-1',
  name: 'Government Secondary School, Ikeja',
  address: 'No. 45, Allen Avenue, Ikeja, Lagos State',
  email: 'info@gssikeja.edu.ng',
  phoneNumber: '+234 803 456 7890',
  motto: 'Knowledge is Power',
  templateId: 'classic',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const demoResult: StudentResult = {
  student: {
    id: 'student-1',
    classId: 'JSS 2A',
    admissionNumber: 'GSS/2023/0145',
    firstName: 'Oluwaseun',
    lastName: 'Adeyemi',
    middleName: 'David',
    gender: 'male',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  scores: [
    { id: '1', studentId: 'student-1', subjectId: 'Mathematics', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '2', studentId: 'student-1', subjectId: 'English Language', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 18, exam: 48, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '3', studentId: 'student-1', subjectId: 'Basic Science', term: 'first', academicYear: '2024/2025', ca1: 17, ca2: 16, exam: 50, total: 83, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '4', studentId: 'student-1', subjectId: 'Basic Technology', term: 'first', academicYear: '2024/2025', ca1: 15, ca2: 17, exam: 46, total: 78, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '5', studentId: 'student-1', subjectId: 'Civic Education', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 19, exam: 54, total: 91, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '6', studentId: 'student-1', subjectId: 'Computer Studies', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 17, exam: 49, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '7', studentId: 'student-1', subjectId: 'Physical & Health Education', term: 'first', academicYear: '2024/2025', ca1: 17, ca2: 18, exam: 51, total: 86, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '8', studentId: 'student-1', subjectId: 'Yoruba Language', term: 'first', academicYear: '2024/2025', ca1: 14, ca2: 16, exam: 44, total: 74, grade: 'B2', remark: 'Very Good', createdAt: '', updatedAt: '' },
    { id: '9', studentId: 'student-1', subjectId: 'Agricultural Science', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 15, exam: 47, total: 78, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    { id: '10', studentId: 'student-1', subjectId: 'Cultural & Creative Arts', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 17, exam: 53, total: 88, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
  ],
  behavioralAssessment: {
    id: 'ba-1',
    studentId: 'student-1',
    term: 'first',
    academicYear: '2024/2025',
    ratings: {
      'Punctuality': 5,
      'Attentiveness': 5,
      'Neatness': 4,
      'Politeness': 5,
      'Honesty': 5,
      'Leadership': 4,
      'Cooperation': 5,
      'Initiative': 4,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  comment: {
    id: 'comment-1',
    studentId: 'student-1',
    term: 'first',
    academicYear: '2024/2025',
    teacherComment: 'Oluwaseun is an exceptional student who consistently demonstrates strong academic performance across all subjects. His dedication to learning and excellent behavior make him a role model for his peers. Keep up the excellent work!',
    principalComment: 'An outstanding performance. Continue to maintain this high standard. Well done!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  totalScore: 829,
  totalPossible: 1000,
  percentage: 82.9,
  position: 2,
  totalStudents: 35,
  classHighest: 85.4,
  term: 'first',
  academicYear: '2024/2025',
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={user?.role === 'teacher' ? '/teacher/dashboard' : '/principal/dashboard'} />} />
        <Route path="/signup" element={<SignupPageEnhanced />} />
        
        {/* Protected Routes - Teacher */}
        <Route 
          path="/teacher/dashboard" 
          element={isAuthenticated && user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/students" 
          element={isAuthenticated && user?.role === 'teacher' ? <StudentsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/subjects" 
          element={isAuthenticated && user?.role === 'teacher' ? <SubjectsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/scores" 
          element={isAuthenticated && user?.role === 'teacher' ? <ScoreEntryPageEnhanced /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/comments" 
          element={isAuthenticated && user?.role === 'teacher' ? <CommentsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/submit" 
          element={isAuthenticated && user?.role === 'teacher' ? <SubmitResultsPage /> : <Navigate to="/login" />} 
        />
        
        {/* Protected Routes - Principal */}
        <Route 
          path="/principal/dashboard" 
          element={isAuthenticated && user?.role === 'school_admin' ? <PrincipalDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/principal/teachers" 
          element={isAuthenticated && user?.role === 'school_admin' ? <TeachersPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/principal/classes" 
          element={isAuthenticated && user?.role === 'school_admin' ? <ClassesPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/principal/settings" 
          element={isAuthenticated && user?.role === 'school_admin' ? <SettingsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/principal/approvals" 
          element={isAuthenticated && user?.role === 'school_admin' ? <ApprovalsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/principal/downloads" 
          element={isAuthenticated && user?.role === 'school_admin' ? <DownloadsPage /> : <Navigate to="/login" />} 
        />
        
        {/* Demo Landing Page */}
        <Route path="/demo" element={<DemoLandingPage />} />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={user?.role === 'teacher' ? '/teacher/dashboard' : '/principal/dashboard'} />
              : <Navigate to="/login" />
          } 
        />
      </Routes>
    </HashRouter>
  );
}

// Demo Landing Page Component (original home page)
function DemoLandingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern'>('classic');
  const [showPreview, setShowPreview] = useState(false);

  // Demo data for preview
  const demoSchool: School = {
    id: 'school-1',
    name: 'Government Secondary School, Ikeja',
    address: 'No. 45, Allen Avenue, Ikeja, Lagos State',
    email: 'info@gssikeja.edu.ng',
    phoneNumber: '+234 803 456 7890',
    motto: 'Knowledge is Power',
    templateId: 'classic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoResult: StudentResult = {
    student: {
      id: 'student-1',
      classId: 'JSS 2A',
      admissionNumber: 'GSS/2023/0145',
      firstName: 'Oluwaseun',
      lastName: 'Adeyemi',
      middleName: 'David',
      gender: 'male',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    scores: [
      { id: '1', studentId: 'student-1', subjectId: 'Mathematics', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '2', studentId: 'student-1', subjectId: 'English Language', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 18, exam: 48, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '3', studentId: 'student-1', subjectId: 'Basic Science', term: 'first', academicYear: '2024/2025', ca1: 17, ca2: 16, exam: 50, total: 83, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '4', studentId: 'student-1', subjectId: 'Basic Technology', term: 'first', academicYear: '2024/2025', ca1: 15, ca2: 17, exam: 46, total: 78, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '5', studentId: 'student-1', subjectId: 'Civic Education', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 19, exam: 54, total: 91, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '6', studentId: 'student-1', subjectId: 'Computer Studies', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 17, exam: 49, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '7', studentId: 'student-1', subjectId: 'Physical & Health Education', term: 'first', academicYear: '2024/2025', ca1: 17, ca2: 18, exam: 51, total: 86, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '8', studentId: 'student-1', subjectId: 'Yoruba Language', term: 'first', academicYear: '2024/2025', ca1: 14, ca2: 16, exam: 44, total: 74, grade: 'B2', remark: 'Very Good', createdAt: '', updatedAt: '' },
      { id: '9', studentId: 'student-1', subjectId: 'Agricultural Science', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 15, exam: 47, total: 78, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      { id: '10', studentId: 'student-1', subjectId: 'Cultural & Creative Arts', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 17, exam: 53, total: 88, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
    ],
    behavioralAssessment: {
      id: 'ba-1',
      studentId: 'student-1',
      term: 'first',
      academicYear: '2024/2025',
      ratings: {
        'Punctuality': 5,
        'Attentiveness': 5,
        'Neatness': 4,
        'Politeness': 5,
        'Honesty': 5,
        'Leadership': 4,
        'Cooperation': 5,
        'Initiative': 4,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    comment: {
      id: 'comment-1',
      studentId: 'student-1',
      term: 'first',
      academicYear: '2024/2025',
      teacherComment: 'Oluwaseun is an exceptional student who consistently demonstrates strong academic performance across all subjects. His dedication to learning and excellent behavior make him a role model for his peers. Keep up the excellent work!',
      principalComment: 'An outstanding performance. Continue to maintain this high standard. Well done!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    totalScore: 829,
    totalPossible: 1000,
    percentage: 82.9,
    position: 2,
    totalStudents: 35,
    classHighest: 85.4,
    term: 'first',
    academicYear: '2024/2025',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-skora border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white font-display">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Skora RMS</h1>
                <p className="text-sm text-neutral-600">Result Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/login" className="btn-outline">Sign In</a>
              <a href="/signup" className="btn-primary">Get Started</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showPreview ? (
          /* Landing Page */
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-neutral-900 mb-4 animate-slide-up font-display">
                Welcome to Skora RMS
              </h2>
              <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-100">
                A modern result management system built for Nigerian schools. 
                Automate score calculation, ranking, and generate professional result sheets.
              </p>
              <button 
                onClick={() => setShowPreview(true)}
                className="btn-primary btn-lg shadow-skora-lg animate-slide-up animation-delay-200"
              >
                View Result Sheet Demo
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="card card-hover animate-slide-up animation-delay-100">
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Auto Calculations</h3>
                <p className="text-neutral-600">
                  Automatic calculation of totals, percentages, class positions, and grades. 
                  No manual math required.
                </p>
              </div>

              <div className="card card-hover animate-slide-up animation-delay-200">
                <div className="w-14 h-14 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Nigerian Grading</h3>
                <p className="text-neutral-600">
                  Built-in support for the Nigerian grading system (A1-F9) with customizable grading scales.
                </p>
              </div>

              <div className="card card-hover animate-slide-up animation-delay-300">
                <div className="w-14 h-14 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Professional PDFs</h3>
                <p className="text-neutral-600">
                  Generate print-ready A4 result sheets with three beautiful template designs to choose from.
                </p>
              </div>

              <div className="card card-hover animate-slide-up animation-delay-100">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Multi-User Roles</h3>
                <p className="text-neutral-600">
                  Separate dashboards for teachers, principals, and admins with role-based permissions.
                </p>
              </div>

              <div className="card card-hover animate-slide-up animation-delay-200">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">3-Term System</h3>
                <p className="text-neutral-600">
                  Handles all three terms with automatic annual result calculation based on term averages.
                </p>
              </div>

              <div className="card card-hover animate-slide-up animation-delay-300">
                <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Bulk Downloads</h3>
                <p className="text-neutral-600">
                  Download entire class results as a ZIP file with one click. Save hours of work.
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="card bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Built With Modern Tech</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">⚛️</div>
                  <div className="font-semibold">React 18</div>
                  <div className="text-sm text-neutral-400">UI Framework</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">📘</div>
                  <div className="font-semibold">TypeScript</div>
                  <div className="text-sm text-neutral-400">Type Safety</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="font-semibold">Tailwind CSS</div>
                  <div className="text-sm text-neutral-400">Styling</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold">Vite</div>
                  <div className="text-sm text-neutral-400">Build Tool</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Result Sheet Preview */
          <div className="animate-fade-in">
            {/* Controls */}
            <div className="mb-8 flex items-center justify-between">
              <button 
                onClick={() => setShowPreview(false)}
                className="btn-ghost"
              >
                ← Back to Home
              </button>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-neutral-700">Select Template:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTemplate('classic')}
                    className={selectedTemplate === 'classic' ? 'btn-primary' : 'btn-outline'}
                  >
                    Classic
                  </button>
                  <button
                    onClick={() => setSelectedTemplate('modern')}
                    className={selectedTemplate === 'modern' ? 'btn-primary' : 'btn-outline'}
                  >
                    Modern
                  </button>
                </div>
              </div>
            </div>

            {/* Result Sheet Display */}
            <div className="bg-neutral-100 p-8 rounded-xl shadow-skora-xl">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {selectedTemplate === 'classic' ? 'Classic Template' : 'Modern Template'}
                </h3>
                <p className="text-neutral-600">
                  {selectedTemplate === 'classic' 
                    ? 'Traditional serif design with formal borders and black & white styling'
                    : 'Contemporary sans-serif with gradient headers and modern card layouts'
                  }
                </p>
              </div>

              {selectedTemplate === 'classic' ? (
                <ClassicResultSheet result={demoResult} school={demoSchool} />
              ) : (
                <ModernResultSheet result={demoResult} school={demoSchool} />
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button className="btn-secondary">
                📄 Download as PDF
              </button>
              <button className="btn-outline">
                🖨️ Print Result Sheet
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-neutral-600">
            <p className="mb-2">Built for Nigerian schools with ❤️</p>
            <p className="text-sm">Skora RMS © 2026 - Result Management Made Easy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
