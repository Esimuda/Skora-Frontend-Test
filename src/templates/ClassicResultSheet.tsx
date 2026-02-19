import React from 'react';
import { StudentResult, School, GradingScale, DEFAULT_NIGERIAN_GRADING } from '@/types';
import { formatFullName, formatPosition, getTermName, getBehavioralRatingLabel } from '@/lib/utils';

interface ClassicResultSheetProps {
  result: StudentResult;
  school: School;
  gradingScale?: GradingScale[];
}

export const ClassicResultSheet: React.FC<ClassicResultSheetProps> = ({
  result,
  school,
  gradingScale = DEFAULT_NIGERIAN_GRADING.map((g, i) => ({ ...g, id: `${i}`, schoolId: school.id })),
}) => {
  const { student, scores, behavioralAssessment, comment, totalScore, totalPossible, percentage, position, totalStudents, classHighest, term, academicYear } = result;

  const studentFullName = formatFullName(student.firstName, student.lastName, student.middleName);

  return (
    <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-[15mm] font-serif text-black print-no-break">
      <div className="border-[3px] border-double border-black p-5">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-5">
          <div className="w-20 h-20 mx-auto mb-2.5 border-2 border-black rounded-full flex items-center justify-center bg-neutral-100">
            {school.logo ? (
              <img src={school.logo} alt="School Logo" className="max-w-[70px] max-h-[70px]" />
            ) : (
              <span className="text-2xl font-bold text-primary-600">S</span>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1.5 uppercase tracking-wide">{school.name}</h1>
          <p className="text-xs mb-0.5">{school.address}</p>
          <p className="text-xs mb-0.5">Tel: {school.phoneNumber} | Email: {school.email}</p>
          {school.motto && <p className="text-[11px] italic mt-1.5 text-neutral-700">"{school.motto}"</p>}
          <h2 className="text-lg font-bold mt-2.5 underline">TERMINAL REPORT SHEET</h2>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-[1fr_auto] gap-5 mb-5 border border-black p-4">
          <div className="grid grid-cols-[140px_1fr] gap-2 text-[13px]">
            <div className="font-bold">Student Name:</div>
            <div>{studentFullName}</div>

            <div className="font-bold">Admission Number:</div>
            <div>{student.admissionNumber}</div>

            <div className="font-bold">Class:</div>
            <div>{result.student.classId}</div>

            <div className="font-bold">Term:</div>
            <div>{getTermName(term)}</div>

            <div className="font-bold">Academic Session:</div>
            <div>{academicYear}</div>

            <div className="font-bold">No. of Students:</div>
            <div>{totalStudents}</div>
          </div>
          <div className="w-[100px] h-[120px] border-2 border-black flex items-center justify-center bg-neutral-100">
            {student.passportPhoto ? (
              <img src={student.passportPhoto} alt="Student" className="max-w-[96px] max-h-[116px]" />
            ) : (
              <span className="text-4xl text-neutral-400">👤</span>
            )}
          </div>
        </div>

        {/* Scores Table */}
        <div className="mb-5">
          <table className="w-full border-collapse mb-4 text-xs">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">SUBJECT</th>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">1ST CA<br />(20)</th>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">2ND CA<br />(20)</th>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">EXAM<br />(60)</th>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">TOTAL<br />(100)</th>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">GRADE</th>
                <th className="border border-black p-2 bg-neutral-200 font-bold text-center">REMARK</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2 text-left pl-2.5">{score.subjectId}</td>
                  <td className="border border-black p-2 text-center">{score.ca1}</td>
                  <td className="border border-black p-2 text-center">{score.ca2}</td>
                  <td className="border border-black p-2 text-center">{score.exam}</td>
                  <td className="border border-black p-2 text-center">{score.total}</td>
                  <td className="border border-black p-2 text-center">{score.grade}</td>
                  <td className="border border-black p-2 text-center">{score.remark}</td>
                </tr>
              ))}
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-2 text-left pl-2.5">TOTAL SCORE</td>
                <td className="border border-black p-2 text-center" colSpan={3}></td>
                <td className="border border-black p-2 text-center">{totalScore}</td>
                <td className="border border-black p-2 text-center" colSpan={2}></td>
              </tr>
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-2 text-left pl-2.5">PERCENTAGE</td>
                <td className="border border-black p-2 text-center" colSpan={3}></td>
                <td className="border border-black p-2 text-center">{percentage}%</td>
                <td className="border border-black p-2 text-center" colSpan={2}></td>
              </tr>
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-2 text-left pl-2.5">POSITION IN CLASS</td>
                <td className="border border-black p-2 text-center" colSpan={3}></td>
                <td className="border border-black p-2 text-center">{formatPosition(position)} out of {totalStudents}</td>
                <td className="border border-black p-2 text-center" colSpan={2}></td>
              </tr>
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-2 text-left pl-2.5">CLASS HIGHEST PERCENTAGE</td>
                <td className="border border-black p-2 text-center" colSpan={3}></td>
                <td className="border border-black p-2 text-center">{classHighest}%</td>
                <td className="border border-black p-2 text-center" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grading Scale */}
        <div className="border border-black p-2.5 mb-5 text-[11px]">
          <h4 className="mb-2 text-xs font-bold">GRADING SCALE</h4>
          <div className="grid grid-cols-5 gap-1.5">
            {gradingScale.map((grade, idx) => (
              <div key={idx} className="text-center">
                {grade.grade}: {grade.minPercentage}-{grade.maxPercentage}
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Assessment */}
        {behavioralAssessment && (
          <div className="mb-5">
            <h4 className="text-[13px] mb-2.5 underline font-bold">BEHAVIORAL ASSESSMENT</h4>
            <div className="grid grid-cols-2 gap-2.5 border border-black p-4">
              {Object.entries(behavioralAssessment.ratings).map(([metric, rating], idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="font-bold">{metric}:</span>
                  <span>{rating}/5 - {getBehavioralRatingLabel(rating)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {comment && (
          <div className="mb-5">
            <div className="border border-black p-3 mb-4 min-h-[60px]">
              <h4 className="text-xs mb-2 underline font-bold">CLASS TEACHER'S COMMENT:</h4>
              <p className="text-xs leading-relaxed">{comment.teacherComment}</p>
            </div>

            {comment.principalComment && (
              <div className="border border-black p-3 min-h-[60px]">
                <h4 className="text-xs mb-2 underline font-bold">PRINCIPAL'S COMMENT:</h4>
                <p className="text-xs leading-relaxed">{comment.principalComment}</p>
              </div>
            )}
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <div className="border-t border-black mt-10 pt-1.5 text-[11px]">Class Teacher's Signature</div>
          </div>
          <div className="text-center">
            <div className="border-t border-black mt-10 pt-1.5 text-[11px]">Principal's Signature & Stamp</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 pt-2.5 border-t border-black text-[10px]">
          <p>Next Term Begins: [Date]</p>
        </div>
      </div>
    </div>
  );
};
