# Skora Frontend - Complete Implementation Guide

## Project Structure Created ✅

```
skora-frontend/
├── package.json               # Dependencies configured
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite with path aliases
├── tailwind.config.js        # Custom Skora design system
├── postcss.config.js         # PostCSS for Tailwind
├── public/                   # Static assets
└── src/
    ├── index.css            # Global styles with custom components ✅
    ├── main.tsx             # App entry point (TO CREATE)
    ├── App.tsx              # Main app component (TO CREATE)
    ├── types/
    │   └── index.ts         # All TypeScript interfaces ✅
    ├── lib/
    │   └── utils.ts         # Calculation engine & utilities ✅
    ├── templates/
    │   ├── ClassicResultSheet.tsx     # Classic template ✅
    │   ├── ModernResultSheet.tsx      # Modern template (TO CREATE)
    │   └── HybridResultSheet.tsx      # Hybrid template (TO CREATE)
    ├── components/
    │   ├── ui/              # Reusable UI components
    │   ├── layout/          # Layout components
    │   ├── forms/           # Form components
    │   └── results/         # Result-specific components
    ├── pages/
    │   ├── auth/            # Login, signup pages
    │   ├── dashboard/       # Dashboard pages
    │   ├── teacher/         # Teacher-specific pages
    │   ├── principal/       # Principal-specific pages
    │   └── admin/           # Admin pages
    ├── hooks/               # Custom React hooks
    ├── store/               # Zustand state management
    └── assets/              # Images, fonts, etc.
```

## Completed Components ✅

1. **Project Configuration**
   - package.json with all dependencies
   - TypeScript config with path aliases
   - Vite config
   - TailwindCSS with custom Skora design system (Teal + Amber theme)
   - PostCSS config

2. **Type System** (`src/types/index.ts`)
   - Complete TypeScript interfaces for all entities
   - User roles, School, Class, Student, Subject, Score, etc.
   - Result calculation types
   - Form types
   - API response types

3. **Utilities** (`src/lib/utils.ts`)
   - Calculation engine functions:
     - `calculateTotalScore()` - Sum CA1 + CA2 + Exam
     - `calculatePercentage()` - Convert to percentage
     - `getGradeInfo()` - Determine grade and remark
     - `calculateRankings()` - Rank students by percentage
     - `formatPosition()` - Add ordinal suffix (1st, 2nd, etc.)
   - Validation functions
   - Formatting helpers
   - File utilities

4. **Global Styles** (`src/index.css`)
   - Custom font imports (Outfit, DM Sans, JetBrains Mono)
   - Utility classes for buttons, inputs, cards, badges
   - Print styles for A4 result sheets
   - Animations and transitions
   - Custom scrollbar styling

5. **Result Sheet Templates**
   - ClassicResultSheet component created ✅
   - ModernResultSheet (needs creation)
   - HybridResultSheet (needs creation)

## Next Steps - Components to Create

### 1. Complete Result Sheet Templates

**ModernResultSheet.tsx** - Convert modern HTML template to React
**HybridResultSheet.tsx** - Convert hybrid HTML template to React

Both should follow the same prop structure as ClassicResultSheet.

### 2. PDF Generation Service (`src/lib/pdf.ts`)

```typescript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

export async function generatePDF(
  element: HTMLElement,
  filename: string
): Promise<Blob> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf.output('blob');
}

export async function generateBulkPDFs(
  results: StudentResult[],
  school: School,
  template: 'classic' | 'modern' | 'hybrid'
): Promise<Blob> {
  const zip = new JSZip();
  
  for (const result of results) {
    // Generate PDF for each student
    const pdfBlob = await generatePDF(/* ... */);
    const studentName = formatFullName(
      result.student.firstName,
      result.student.lastName
    );
    zip.file(`${studentName}_Result.pdf`, pdfBlob);
  }
  
  return await zip.generateAsync({ type: 'blob' });
}
```

### 3. State Management (`src/store/`)

**authStore.ts** - Authentication state
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().token,
    }),
    { name: 'skora-auth' }
  )
);
```

**resultStore.ts** - Result data cache
**classStore.ts** - Class management
**studentStore.ts** - Student data

### 4. API Service (`src/lib/api.ts`)

```typescript
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  signup: (data: SchoolSignupForm) => 
    api.post('/auth/school-signup', data),
  inviteTeacher: (data: TeacherInviteForm) => 
    api.post('/auth/invite-teacher', data),
};

// Class endpoints
export const classApi = {
  getAll: (schoolId: string) => api.get(`/schools/${schoolId}/classes`),
  create: (data: any) => api.post('/classes', data),
  getStudents: (classId: string) => api.get(`/classes/${classId}/students`),
  addStudent: (classId: string, data: StudentForm) => 
    api.post(`/classes/${classId}/students`, data),
};

// Result endpoints
export const resultApi = {
  submitScores: (classId: string, data: ScoreEntryForm[]) =>
    api.post(`/classes/${classId}/results/submit`, data),
  approveResults: (classId: string, term: string, year: string) =>
    api.post(`/classes/${classId}/results/approve`, { term, year }),
  getClassResults: (classId: string, term: string, year: string) =>
    api.get(`/classes/${classId}/results`, { params: { term, year } }),
};
```

### 5. Key Page Components

**Teacher Dashboard** (`src/pages/teacher/Dashboard.tsx`)
- List of assigned classes
- Quick stats (students, subjects, pending submissions)
- Recent activity

**Student Management** (`src/pages/teacher/Students.tsx`)
- Add/edit students
- Upload passport photos
- Bulk import via CSV (future)

**Score Entry** (`src/pages/teacher/ScoreEntry.tsx`)
- Subject-wise score entry
- Real-time validation
- Bulk save
- Preview calculations

**Behavioral Assessment** (`src/pages/teacher/BehavioralAssessment.tsx`)
- Rate each student on 8 metrics
- Save ratings per term

**Result Submission** (`src/pages/teacher/ResultSubmission.tsx`)
- Review all scores before submission
- Add teacher comments
- Submit for principal approval

**Principal Dashboard** (`src/pages/principal/Dashboard.tsx`)
- School overview
- Teacher management
- Pending approvals

**Result Approval** (`src/pages/principal/ResultApproval.tsx`)
- Review submitted results
- Add principal comments
- Approve/reject submissions
- Download PDFs (single or bulk ZIP)

### 6. UI Components (`src/components/ui/`)

**Button.tsx**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200';
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };
  
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

**Input.tsx**, **Select.tsx**, **Table.tsx**, **Modal.tsx**, **Card.tsx**, etc.

### 7. Form Components (`src/components/forms/`)

**StudentForm.tsx** - Add/edit student
**SubjectForm.tsx** - Add subject
**ScoreEntryRow.tsx** - Single row for score entry
**BehavioralRatingCard.tsx** - Rate behavioral metrics

### 8. Result Components (`src/components/results/`)

**ResultPreview.tsx** - Preview result before PDF generation
```tsx
interface ResultPreviewProps {
  result: StudentResult;
  school: School;
  template: 'classic' | 'modern' | 'hybrid';
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  result,
  school,
  template,
}) => {
  const TemplateComponent = {
    classic: ClassicResultSheet,
    modern: ModernResultSheet,
    hybrid: HybridResultSheet,
  }[template];
  
  return (
    <div className="result-preview">
      <TemplateComponent result={result} school={school} />
    </div>
  );
};
```

**ResultDownloadButton.tsx** - Download single PDF
**BulkDownloadButton.tsx** - Download class ZIP
**ResultStatsCard.tsx** - Show class statistics

### 9. Router Setup (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Import pages...

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {user?.role === 'teacher' && (
            <>
              <Route path="/dashboard" element={<TeacherDashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/scores" element={<ScoreEntryPage />} />
              <Route path="/behavioral" element={<BehavioralPage />} />
              <Route path="/submit" element={<SubmitResultsPage />} />
            </>
          )}
          
          {user?.role === 'school_admin' && (
            <>
              <Route path="/dashboard" element={<PrincipalDashboard />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
            </>
          )}
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 10. Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Skora RMS
```

## Design System Usage

### Colors
- **Primary (Teal)**: `bg-primary-500`, `text-primary-600`, `border-primary-400`
- **Secondary (Amber)**: `bg-secondary-500`, `text-secondary-600`
- **Accent (Red)**: For alerts/errors
- **Neutral**: Grays for text and backgrounds

### Typography
- **Headings**: `font-display` (Outfit)
- **Body**: `font-body` (DM Sans)
- **Numbers**: `font-mono` (JetBrains Mono)

### Components
- Buttons: Use `btn-primary`, `btn-secondary`, etc.
- Inputs: Use `input-field` class
- Cards: Use `card` and `card-hover` classes
- Badges: Use `badge` with variants

### Animations
- `animate-slide-up`, `animate-fade-in`, `animate-scale-in`
- Delays: `animation-delay-100` through `animation-delay-400`

## Testing Checklist

- [ ] Score calculation accuracy
- [ ] Ranking with ties
- [ ] PDF generation quality
- [ ] Bulk ZIP download
- [ ] Print styles on different browsers
- [ ] Mobile responsiveness
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Role-based access control

## Deployment

1. **Build**: `npm run build`
2. **Preview**: `npm run preview`
3. **Deploy to Vercel**: Connect GitHub repo
4. **Environment**: Set VITE_API_URL in Vercel dashboard

## Backend Integration Points

The frontend expects these API endpoints (from specification):
- `POST /api/auth/school-signup`
- `POST /api/auth/invite-teacher`
- `POST /api/auth/complete-invite`
- `POST /api/class/:id/students`
- `POST /api/class/:id/subjects`
- `POST /api/class/:id/results/submit`
- `POST /api/class/:id/results/approve`
- `GET /api/class/:id/results/pdf`

## Next Immediate Tasks

1. Create ModernResultSheet and HybridResultSheet components
2. Build PDF generation service
3. Set up Zustand stores
4. Create API service layer
5. Build auth pages (Login/Signup)
6. Build teacher dashboard and score entry pages
7. Build principal approval flow
8. Implement download functionality

Would you like me to continue creating any of these specific components?
