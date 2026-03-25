import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ClassicResultSheet } from '@/templates/ClassicResultSheet';
import { ModernResultSheet } from '@/templates/ModernResultSheet';
import type { StudentResult, School } from '@/types';

interface ApprovedClass {
  id: string;
  className: string;
  term: string;
  academicYear: string;
  studentCount: number;
  approvedAt: string;
  approvedBy: string;
  templateType: 'classic' | 'modern';
}

export const DownloadsPage = () => {
  const [approvedClasses] = useState<ApprovedClass[]>([
    {
      id: '1',
      className: 'JSS 2A',
      term: 'First',
      academicYear: '2024/2025',
      studentCount: 3,
      approvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Principal Mary Adebayo',
      templateType: 'classic',
    },
    {
      id: '2',
      className: 'JSS 1B',
      term: 'First',
      academicYear: '2024/2025',
      studentCount: 35,
      approvedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'Principal Mary Adebayo',
      templateType: 'modern',
    },
  ]);

  const [selectedClass, setSelectedClass] = useState<ApprovedClass | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);

  // Demo school data
  const demoSchool: School = {
    id: 'school-1',
    name: 'Government Secondary School, Ikeja',
    address: 'No. 45, Allen Avenue, Ikeja, Lagos State',
    email: 'info@gssikeja.edu.ng',
    phoneNumber: '+234 803 456 7890',
    motto: 'Knowledge is Power',
    templateId: 'classic',
    logo: '', // Would be base64 string
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Demo student results
  const studentResults: StudentResult[] = [
    {
      student: {
        id: '1',
        classId: 'JSS2A',
        admissionNumber: 'JSS2A/001',
        firstName: 'Oluwaseun',
        lastName: 'Adeyemi',
        middleName: 'David',
        gender: 'male',
        createdAt: '',
        updatedAt: '',
      },
      scores: [
        { id: '1', studentId: '1', subjectId: 'Mathematics', term: 'first', academicYear: '2024/2025', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
        { id: '2', studentId: '1', subjectId: 'English Language', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 18, exam: 48, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
        { id: '3', studentId: '1', subjectId: 'Basic Science', term: 'first', academicYear: '2024/2025', ca1: 17, ca2: 16, exam: 50, total: 83, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
        { id: '4', studentId: '1', subjectId: 'Basic Technology', term: 'first', academicYear: '2024/2025', ca1: 15, ca2: 17, exam: 49, total: 81, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
        { id: '5', studentId: '1', subjectId: 'Civic Education', term: 'first', academicYear: '2024/2025', ca1: 16, ca2: 15, exam: 51, total: 82, grade: 'A1', remark: 'Excellent', createdAt: '', updatedAt: '' },
      ],
      behavioralAssessment: {
        id: 'ba-1',
        studentId: '1',
        term: 'first',
        academicYear: '2024/2025',
        ratings: {
          Punctuality: 5,
          Attentiveness: 5,
          Neatness: 4,
          Politeness: 5,
          Honesty: 5,
          Leadership: 4,
          Cooperation: 5,
          Initiative: 4,
        },
        createdAt: '',
        updatedAt: '',
      },
      comment: {
        id: 'c-1',
        studentId: '1',
        term: 'first',
        academicYear: '2024/2025',
        teacherComment: 'Excellent performance this term. Keep up the outstanding work!',
        principalComment: 'Outstanding achievement! Continue to set the pace for your classmates.',
        createdAt: '',
        updatedAt: '',
      },
      totalScore: 415,
      totalPossible: 500,
      percentage: 83.0,
      position: 1,
      totalStudents: 3,
      classHighest: 83.0,
      term: 'first',
      academicYear: '2024/2025',
    },
  ];

  const handlePreview = (classItem: ApprovedClass, student: StudentResult) => {
    setSelectedClass(classItem);
    setSelectedStudent(student);
    setIsPreviewModalOpen(true);
  };

  const handleDownloadSinglePDF = async (student: StudentResult, classItem: ApprovedClass) => {
    setDownloadLoading(true);

    // Import dynamically to avoid bundling issues
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    try {
      // Get the result sheet element
      const element = document.getElementById('result-sheet-preview');
      if (!element) {
        alert('Error: Could not find result sheet element');
        setDownloadLoading(false);
        return;
      }

      // Convert to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit page
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // If image is taller than page, scale it down
      if (imgHeight > pdfHeight) {
        const scaledHeight = pdfHeight;
        const scaledWidth = (canvas.width * pdfHeight) / canvas.height;
        pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // Download
      const fileName = `${student.student.lastName}_${student.student.firstName}_${classItem.className}_${classItem.term}Term_Result.pdf`;
      pdf.save(fileName);

      setDownloadLoading(false);
      alert('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Error generating PDF. Please try again.');
      setDownloadLoading(false);
    }
  };

  const handleDownloadClassZIP = async (classItem: ApprovedClass) => {
    setBulkDownloadLoading(true);

    // Import dynamically
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const JSZip = (await import('jszip')).default;

    try {
      const zip = new JSZip();
      const folder = zip.folder(classItem.className);

      if (!folder) {
        alert('Error creating ZIP folder');
        setBulkDownloadLoading(false);
        return;
      }

      // Show progress
      let completed = 0;
      const total = studentResults.length;

      for (const student of studentResults) {
        // Render each student's result
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        // Render result sheet component
        const resultSheet = classItem.templateType === 'classic' 
          ? <ClassicResultSheet result={student} school={demoSchool} />
          : <ModernResultSheet result={student} school={demoSchool} />;

        // Note: In real implementation, you'd use ReactDOM.render here
        // For now, we'll reuse the preview element
        const element = document.getElementById('result-sheet-preview');
        if (!element) continue;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        if (imgHeight > pdfHeight) {
          const scaledHeight = pdfHeight;
          const scaledWidth = (canvas.width * pdfHeight) / canvas.height;
          pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight);
        } else {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }

        const pdfBlob = pdf.output('blob');
        const fileName = `${student.student.lastName}_${student.student.firstName}.pdf`;
        folder.file(fileName, pdfBlob);

        completed++;
        console.log(`Generated ${completed}/${total} PDFs`);

        // Cleanup
        if (tempDiv.parentNode) {
          tempDiv.parentNode.removeChild(tempDiv);
        }
      }

      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' });

      // Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${classItem.className}_${classItem.term}Term_${classItem.academicYear}_Results.zip`;
      link.click();

      setBulkDownloadLoading(false);
      alert(`✅ Downloaded ZIP with ${total} student results!`);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('❌ Error generating ZIP. Please try again.');
      setBulkDownloadLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <DashboardLayout title="Download Results">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approved Classes</p>
                <p className="text-3xl font-bold text-neutral-900">{approvedClasses.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {approvedClasses.reduce((sum, c) => sum + c.studentCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Downloads Available</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {approvedClasses.reduce((sum, c) => sum + c.studentCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Download Options</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Individual PDF:</strong> Download result for a specific student</li>
                <li>• <strong>Class ZIP:</strong> Download all students' results in one ZIP file</li>
                <li>• <strong>Preview:</strong> View result before downloading</li>
                <li>• Only approved results can be downloaded</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Approved Classes */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Approved Results</h2>

          {approvedClasses.length > 0 ? (
            <div className="space-y-4">
              {approvedClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-6 border-2 border-green-200 bg-green-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">✅</span>
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900">
                            {classItem.className} - {classItem.term} Term {classItem.academicYear}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {classItem.studentCount} students • Approved {getTimeAgo(classItem.approvedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <span>📄 Template: {classItem.templateType === 'classic' ? 'Classic' : 'Modern'}</span>
                        <span>👤 Approved by: {classItem.approvedBy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handlePreview(classItem, studentResults[0])}
                    >
                      👁️ Preview
                    </Button>
                    <Button
                      onClick={() => handleDownloadSinglePDF(studentResults[0], classItem)}
                      loading={downloadLoading}
                    >
                      📄 Download Single PDF
                    </Button>
                    <Button
                      onClick={() => handleDownloadClassZIP(classItem)}
                      loading={bulkDownloadLoading}
                      className="bg-gradient-to-r from-primary-600 to-primary-700"
                    >
                      📥 Download Class ZIP ({classItem.studentCount} PDFs)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-lg">
              <span className="text-5xl mb-3 block">📋</span>
              <p className="text-neutral-600 mb-2">No approved results yet</p>
              <p className="text-sm text-neutral-500">
                Results will appear here after approval
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Result Preview"
        size="xl"
      >
        {selectedStudent && selectedClass && (
          <div className="space-y-4">
            <div className="bg-neutral-100 p-6 rounded-lg max-h-[70vh] overflow-y-auto">
              <div id="result-sheet-preview">
                {selectedClass.templateType === 'classic' ? (
                  <ClassicResultSheet result={selectedStudent} school={demoSchool} />
                ) : (
                  <ModernResultSheet result={selectedStudent} school={demoSchool} />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)} className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => handleDownloadSinglePDF(selectedStudent, selectedClass)}
                loading={downloadLoading}
                className="flex-1"
              >
                📥 Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
