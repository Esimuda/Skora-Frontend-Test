// User Roles
export type UserRole = 'admin' | 'school_admin' | 'teacher';

// Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// School
export interface School {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  motto?: string;
  logo?: string;
  templateId: 'classic' | 'modern' | 'hybrid';
  createdAt: string;
  updatedAt: string;
}

// Grading System
export interface GradingScale {
  id: string;
  schoolId: string;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  remark: string;
}

export const DEFAULT_NIGERIAN_GRADING: Omit<GradingScale, 'id' | 'schoolId'>[] = [
  { grade: 'A1', minPercentage: 75, maxPercentage: 100, remark: 'Excellent' },
  { grade: 'B2', minPercentage: 70, maxPercentage: 74, remark: 'Very Good' },
  { grade: 'B3', minPercentage: 65, maxPercentage: 69, remark: 'Good' },
  { grade: 'C4', minPercentage: 60, maxPercentage: 64, remark: 'Credit' },
  { grade: 'C5', minPercentage: 55, maxPercentage: 59, remark: 'Credit' },
  { grade: 'C6', minPercentage: 50, maxPercentage: 54, remark: 'Credit' },
  { grade: 'D7', minPercentage: 45, maxPercentage: 49, remark: 'Pass' },
  { grade: 'E8', minPercentage: 40, maxPercentage: 44, remark: 'Pass' },
  { grade: 'F9', minPercentage: 0, maxPercentage: 39, remark: 'Fail' },
];

// Class
export interface Class {
  id: string;
  schoolId: string;
  name: string;
  academicYear: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

// Teacher
export interface Teacher {
  id: string;
  userId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  classes: string[];
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Student
export interface Student {
  id: string;
  classId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female';
  passportPhoto?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Subject
export interface Subject {
  id: string;
  classId: string;
  name: string;
  code?: string;
  weight: number; // For weighted average calculation
  createdAt: string;
  updatedAt: string;
}

// Academic Term
export type Term = 'first' | 'second' | 'third';

export interface AcademicSession {
  id: string;
  schoolId: string;
  year: string; // e.g., "2024/2025"
  currentTerm: Term;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Scores
export interface Score {
  id: string;
  studentId: string;
  subjectId: string;
  term: Term;
  academicYear: string;
  ca1: number; // Continuous Assessment 1 (max 20)
  ca2: number; // Continuous Assessment 2 (max 20)
  exam: number; // Exam score (max 60)
  total: number; // Auto-calculated: ca1 + ca2 + exam
  grade: string; // Auto-calculated based on grading scale
  remark: string; // Auto-calculated based on grading scale
  createdAt: string;
  updatedAt: string;
}

// Behavioral Assessment
export interface BehavioralMetric {
  id: string;
  name: string;
  description?: string;
}

export const DEFAULT_BEHAVIORAL_METRICS: BehavioralMetric[] = [
  { id: '1', name: 'Punctuality', description: 'Student arrives on time' },
  { id: '2', name: 'Attentiveness', description: 'Student pays attention in class' },
  { id: '3', name: 'Neatness', description: 'Student maintains personal hygiene and neatness' },
  { id: '4', name: 'Politeness', description: 'Student shows respect and courtesy' },
  { id: '5', name: 'Honesty', description: 'Student demonstrates truthfulness' },
  { id: '6', name: 'Leadership', description: 'Student shows leadership qualities' },
  { id: '7', name: 'Cooperation', description: 'Student works well with others' },
  { id: '8', name: 'Initiative', description: 'Student shows self-motivation' },
];

export interface BehavioralAssessment {
  id: string;
  studentId: string;
  term: Term;
  academicYear: string;
  ratings: Record<string, number>; // metricId: rating (1-5)
  createdAt: string;
  updatedAt: string;
}

// Comments
export interface ResultComment {
  id: string;
  studentId: string;
  term: Term;
  academicYear: string;
  teacherComment: string;
  principalComment?: string;
  createdAt: string;
  updatedAt: string;
}

// Result Status
export type ResultStatus = 'draft' | 'submitted' | 'approved' | 'locked';

export interface ClassResult {
  id: string;
  classId: string;
  term: Term;
  academicYear: string;
  status: ResultStatus;
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Calculated Result (for display)
export interface StudentResult {
  student: Student;
  scores: Score[];
  behavioralAssessment?: BehavioralAssessment;
  comment?: ResultComment;
  totalScore: number;
  totalPossible: number;
  percentage: number;
  position: number;
  totalStudents: number;
  classHighest: number;
  term: Term;
  academicYear: string;
}

// Annual Result (average of 3 terms)
export interface AnnualResult {
  student: Student;
  termResults: {
    first?: StudentResult;
    second?: StudentResult;
    third?: StudentResult;
  };
  annualAverages: {
    subjectId: string;
    subjectName: string;
    average: number;
    grade: string;
  }[];
  overallPercentage: number;
  annualPosition: number;
  totalStudents: number;
  academicYear: string;
}

// PDF Generation
export interface PDFGenerationOptions {
  template: 'classic' | 'modern' | 'hybrid';
  watermark?: string;
  includeSignature?: boolean;
}

export interface BulkPDFJob {
  id: string;
  classId: string;
  term: Term;
  academicYear: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalStudents: number;
  processedStudents: number;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SchoolSignupForm {
  schoolName: string;
  schoolAddress: string;
  schoolEmail: string;
  phoneNumber: string;
  motto?: string;
  logo?: File;
  templateId: 'classic' | 'modern' | 'hybrid';
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface TeacherInviteForm {
  email: string;
  firstName: string;
  lastName: string;
  classId?: string;
}

export interface StudentForm {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female';
  passportPhoto?: File;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
}

export interface SubjectForm {
  name: string;
  code?: string;
  weight: number;
}

export interface ScoreEntryForm {
  studentId: string;
  subjectId: string;
  ca1: number;
  ca2: number;
  exam: number;
}

export interface BehavioralRatingForm {
  studentId: string;
  ratings: Record<string, number>;
}

export interface CommentForm {
  studentId: string;
  teacherComment: string;
  principalComment?: string;
}
