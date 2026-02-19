import React from 'react';
import { StudentResult, School, GradingScale, DEFAULT_NIGERIAN_GRADING } from '@/types';
import { formatFullName, formatPosition, getTermName, getBehavioralRatingLabel } from '@/lib/utils';

interface ModernResultSheetProps {
  result: StudentResult;
  school: School;
  gradingScale?: GradingScale[];
}

export const ModernResultSheet: React.FC<ModernResultSheetProps> = ({
  result,
  school,
  gradingScale = DEFAULT_NIGERIAN_GRADING.map((g, i) => ({ ...g, id: `${i}`, schoolId: school.id })),
}) => {
  const { student, scores, behavioralAssessment, comment, totalScore, totalPossible, percentage, position, totalStudents, classHighest, term, academicYear } = result;

  const studentFullName = formatFullName(student.firstName, student.lastName, student.middleName);

  return (
    <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-[12mm] font-sans text-neutral-900 print-no-break">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-t-lg mb-6 text-center">
        <div className="flex items-center justify-center gap-5 mb-4">
          <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center shadow-lg">
            {school.logo ? (
              <img src={school.logo} alt="School Logo" className="max-w-[60px] max-h-[60px]" />
            ) : (
              <span className="text-3xl font-bold text-purple-600">S</span>
            )}
          </div>
          <div className="text-left">
            <h1 className="text-[26px] font-bold mb-2 drop-shadow-md">{school.name}</h1>
            <p className="text-xs opacity-95">{school.address}</p>
            <p className="text-xs opacity-95">Tel: {school.phoneNumber} | Email: {school.email}</p>
            {school.motto && (
              <p className="text-[13px] italic mt-2 border-t border-white/30 pt-2 opacity-90">"{school.motto}"</p>
            )}
          </div>
        </div>
        <h2 className="text-base font-semibold tracking-[2px] uppercase mt-2.5">Terminal Report Card</h2>
      </div>

      {/* Student Info Card */}
      <div className="bg-neutral-50 rounded-lg p-5 mb-6 border-l-4 border-purple-600">
        <div className="grid grid-cols-[1fr_auto] gap-6">
          <div className="grid grid-cols-[160px_1fr] gap-3 text-[13px]">
            <div className="font-semibold text-neutral-600">Student Name:</div>
            <div className="text-neutral-900">{studentFullName}</div>

            <div className="font-semibold text-neutral-600">Admission Number:</div>
            <div className="text-neutral-900">{student.admissionNumber}</div>

            <div className="font-semibold text-neutral-600">Class:</div>
            <div className="text-neutral-900">{result.student.classId}</div>

            <div className="font-semibold text-neutral-600">Term:</div>
            <div className="text-neutral-900">{getTermName(term)}</div>

            <div className="font-semibold text-neutral-600">Academic Session:</div>
            <div className="text-neutral-900">{academicYear}</div>

            <div className="font-semibold text-neutral-600">Total Students:</div>
            <div className="text-neutral-900">{totalStudents}</div>
          </div>
          <div className="w-[90px] h-[110px] rounded-lg overflow-hidden shadow-md bg-white flex items-center justify-center">
            {student.passportPhoto ? (
              <img src={student.passportPhoto} alt="Student" className="max-w-full max-h-full object-cover" />
            ) : (
              <span className="text-5xl text-neutral-300">👤</span>
            )}
          </div>
        </div>
      </div>

      {/* Academic Performance */}
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-purple-600 mb-3 pb-1.5 border-b-2 border-purple-600">
          Academic Performance
        </h3>
        <table className="w-full border-collapse text-xs shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3 text-left font-semibold text-[11px]">SUBJECT</th>
              <th className="p-3 text-center font-semibold text-[11px]">1ST CA<br />(20)</th>
              <th className="p-3 text-center font-semibold text-[11px]">2ND CA<br />(20)</th>
              <th className="p-3 text-center font-semibold text-[11px]">EXAM<br />(60)</th>
              <th className="p-3 text-center font-semibold text-[11px]">TOTAL<br />(100)</th>
              <th className="p-3 text-center font-semibold text-[11px]">GRADE</th>
              <th className="p-3 text-center font-semibold text-[11px]">REMARK</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, idx) => (
              <tr key={idx} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="p-2.5 text-left font-medium pl-4">{score.subjectId}</td>
                <td className="p-2.5 text-center">{score.ca1}</td>
                <td className="p-2.5 text-center">{score.ca2}</td>
                <td className="p-2.5 text-center">{score.exam}</td>
                <td className="p-2.5 text-center">{score.total}</td>
                <td className="p-2.5 text-center">{score.grade}</td>
                <td className="p-2.5 text-center">{score.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="bg-neutral-50 rounded-lg p-4 mt-4 grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center p-2.5 bg-white rounded-md shadow-sm">
            <span className="text-xs font-semibold text-neutral-600">Total Score</span>
            <span className="text-[15px] font-bold text-purple-600">{totalScore}/{totalPossible}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-white rounded-md shadow-sm">
            <span className="text-xs font-semibold text-neutral-600">Percentage</span>
            <span className="text-[15px] font-bold text-purple-600">{percentage}%</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-white rounded-md shadow-sm">
            <span className="text-xs font-semibold text-neutral-600">Position in Class</span>
            <span className="text-[15px] font-bold text-purple-600">{formatPosition(position)} of {totalStudents}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-white rounded-md shadow-sm">
            <span className="text-xs font-semibold text-neutral-600">Class Highest</span>
            <span className="text-[15px] font-bold text-purple-600">{classHighest}%</span>
          </div>
        </div>
      </div>

      {/* Grading Scale */}
      <div className="bg-neutral-50 rounded-lg p-4 mb-6">
        <h4 className="text-[13px] mb-2.5 text-neutral-700 font-semibold">Grading Scale</h4>
        <div className="grid grid-cols-5 gap-2">
          {gradingScale.map((grade, idx) => (
            <div key={idx} className="bg-white p-2 rounded-md text-center text-[11px] font-semibold shadow-sm">
              {grade.grade}: {grade.minPercentage}-{grade.maxPercentage}
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Assessment */}
      {behavioralAssessment && (
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-purple-600 mb-3 pb-1.5 border-b-2 border-purple-600">
            Behavioral Assessment
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(behavioralAssessment.ratings).map(([metric, rating], idx) => (
              <div key={idx} className="bg-neutral-50 p-3 rounded-md flex justify-between items-center">
                <span className="text-xs font-semibold text-neutral-600">{metric}</span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-purple-600 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    {rating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {comment && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-neutral-50 rounded-lg p-4 border-l-4 border-purple-600">
            <h4 className="text-xs text-purple-600 mb-2.5 font-semibold uppercase">Class Teacher's Comment</h4>
            <p className="text-xs leading-relaxed text-neutral-700">{comment.teacherComment}</p>
          </div>

          {comment.principalComment && (
            <div className="bg-neutral-50 rounded-lg p-4 border-l-4 border-purple-600">
              <h4 className="text-xs text-purple-600 mb-2.5 font-semibold uppercase">Principal's Comment</h4>
              <p className="text-xs leading-relaxed text-neutral-700">{comment.principalComment}</p>
            </div>
          )}
        </div>
      )}

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="text-center">
          <div className="h-12 border-b-2 border-purple-600 mb-2"></div>
          <p className="text-[11px] text-neutral-600 font-semibold">Class Teacher's Signature & Date</p>
        </div>
        <div className="text-center">
          <div className="h-12 border-b-2 border-purple-600 mb-2"></div>
          <p className="text-[11px] text-neutral-600 font-semibold">Principal's Signature & Stamp</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t-2 border-neutral-200 text-[11px] text-neutral-500">
        <p>Next Term Begins: [Date]</p>
        <p className="mt-1.5">Generated by Skora RMS | www.skora.edu.ng</p>
      </div>
    </div>
  );
};
