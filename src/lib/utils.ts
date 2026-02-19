import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Score, GradingScale, StudentResult, Student, DEFAULT_NIGERIAN_GRADING } from '@/types';

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate total score from individual components
 */
export function calculateTotalScore(ca1: number, ca2: number, exam: number): number {
  return ca1 + ca2 + exam;
}

/**
 * Calculate percentage from total and max possible score
 */
export function calculatePercentage(total: number, maxPossible: number): number {
  if (maxPossible === 0) return 0;
  return parseFloat(((total / maxPossible) * 100).toFixed(2));
}

/**
 * Get grade and remark based on percentage and grading scale
 */
export function getGradeInfo(
  percentage: number,
  gradingScale: GradingScale[] | null
): { grade: string; remark: string } {
  const scale = gradingScale || DEFAULT_NIGERIAN_GRADING.map((g, i) => ({
    ...g,
    id: `default-${i}`,
    schoolId: 'default',
  }));

  const gradeInfo = scale.find(
    (g) => percentage >= g.minPercentage && percentage <= g.maxPercentage
  );

  return {
    grade: gradeInfo?.grade || 'N/A',
    remark: gradeInfo?.remark || 'N/A',
  };
}

/**
 * Calculate student rankings based on percentage
 * Returns array of student IDs with their positions
 */
export function calculateRankings(
  results: Array<{ studentId: string; percentage: number }>
): Array<{ studentId: string; position: number }> {
  // Sort by percentage (descending)
  const sorted = [...results].sort((a, b) => b.percentage - a.percentage);

  // Assign positions (handle ties)
  const ranked: Array<{ studentId: string; position: number }> = [];
  let currentPosition = 1;

  for (let i = 0; i < sorted.length; i++) {
    // If same percentage as previous, use same position
    if (i > 0 && sorted[i].percentage === sorted[i - 1].percentage) {
      ranked.push({
        studentId: sorted[i].studentId,
        position: ranked[i - 1].position,
      });
    } else {
      ranked.push({
        studentId: sorted[i].studentId,
        position: currentPosition,
      });
    }
    currentPosition++;
  }

  return ranked;
}

/**
 * Get highest percentage in class
 */
export function getClassHighest(percentages: number[]): number {
  if (percentages.length === 0) return 0;
  return Math.max(...percentages);
}

/**
 * Format position with ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export function formatPosition(position: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const value = position % 100;
  return position + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
}

/**
 * Calculate weighted average for a subject across terms
 */
export function calculateTermAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / scores.length).toFixed(2));
}

/**
 * Validate score inputs
 */
export function validateScore(
  ca1: number,
  ca2: number,
  exam: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (ca1 < 0 || ca1 > 20) errors.push('CA1 must be between 0 and 20');
  if (ca2 < 0 || ca2 > 20) errors.push('CA2 must be between 0 and 20');
  if (exam < 0 || exam > 60) errors.push('Exam must be between 0 and 60');

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate behavioral rating
 */
export function validateBehavioralRating(rating: number): boolean {
  return rating >= 1 && rating <= 5;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format academic year
 */
export function formatAcademicYear(year: string): string {
  return year; // Already in format "2024/2025"
}

/**
 * Get current academic year
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Academic year starts in September (month 8)
  if (currentMonth >= 8) {
    return `${currentYear}/${currentYear + 1}`;
  } else {
    return `${currentYear - 1}/${currentYear}`;
  }
}

/**
 * Get term name
 */
export function getTermName(term: 'first' | 'second' | 'third'): string {
  const termMap = {
    first: 'First Term',
    second: 'Second Term',
    third: 'Third Term',
  };
  return termMap[term];
}

/**
 * Format full name
 */
export function formatFullName(
  firstName: string,
  lastName: string,
  middleName?: string
): string {
  if (middleName) {
    return `${lastName.toUpperCase()} ${firstName.toUpperCase()} ${middleName.toUpperCase()}`;
  }
  return `${lastName.toUpperCase()} ${firstName.toUpperCase()}`;
}

/**
 * Generate random ID (for demo purposes - replace with backend UUID)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if all scores are entered for a student
 */
export function hasCompleteScores(scores: Score[], subjectCount: number): boolean {
  return scores.length === subjectCount && scores.every((s) => s.total > 0);
}

/**
 * Calculate class average
 */
export function calculateClassAverage(percentages: number[]): number {
  if (percentages.length === 0) return 0;
  const sum = percentages.reduce((acc, p) => acc + p, 0);
  return parseFloat((sum / percentages.length).toFixed(2));
}

/**
 * Get behavioral rating label
 */
export function getBehavioralRatingLabel(rating: number): string {
  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };
  return labels[rating as keyof typeof labels] || 'N/A';
}

/**
 * Calculate pass rate for a class
 */
export function calculatePassRate(percentages: number[], passMark: number = 40): number {
  if (percentages.length === 0) return 0;
  const passed = percentages.filter((p) => p >= passMark).length;
  return parseFloat(((passed / percentages.length) * 100).toFixed(2));
}

/**
 * Sort students by name
 */
export function sortStudentsByName(students: Student[]): Student[] {
  return [...students].sort((a, b) => {
    const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
    const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

/**
 * Sort students by admission number
 */
export function sortStudentsByAdmission(students: Student[]): Student[] {
  return [...students].sort((a, b) => 
    a.admissionNumber.localeCompare(b.admissionNumber)
  );
}

/**
 * Filter students by search query
 */
export function filterStudents(students: Student[], query: string): Student[] {
  const q = query.toLowerCase().trim();
  if (!q) return students;

  return students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q) ||
      (s.middleName && s.middleName.toLowerCase().includes(q))
  );
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
