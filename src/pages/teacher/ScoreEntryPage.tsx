import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { calculateTotalScore, getGradeInfo } from '@/lib/utils';

interface Student {
  id: string;
  admissionNumber: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface ScoreEntry {
  studentId: string;
  subjectId: string;
  ca1: number | '';
  ca2: number | '';
  exam: number | '';
  total: number;
  grade: string;
  remark: string;
}

export const ScoreEntryPage = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Demo data
  const students: Student[] = [
    { id: '1', admissionNumber: 'JSS2A/001', name: 'ADEYEMI OLUWASEUN DAVID' },
    { id: '2', admissionNumber: 'JSS2A/002', name: 'OKAFOR CHIDINMA' },
    { id: '3', admissionNumber: 'JSS2A/003', name: 'MUSA IBRAHIM YAKUBU' },
  ];

  const subjects: Subject[] = [
    { id: '1', name: 'Mathematics', code: 'MTH' },
    { id: '2', name: 'English Language', code: 'ENG' },
    { id: '3', name: 'Basic Science', code: 'BSC' },
    { id: '4', name: 'Basic Technology', code: 'BTC' },
    { id: '5', name: 'Civic Education', code: 'CVC' },
  ];

  // Initialize scores for all students
  const [scores, setScores] = useState<ScoreEntry[]>(
    students.map((student) => ({
      studentId: student.id,
      subjectId: selectedSubject,
      ca1: '',
      ca2: '',
      exam: '',
      total: 0,
      grade: '',
      remark: '',
    }))
  );

  // Update scores when subject changes
  useEffect(() => {
    setScores(
      students.map((student) => ({
        studentId: student.id,
        subjectId: selectedSubject,
        ca1: '',
        ca2: '',
        exam: '',
        total: 0,
        grade: '',
        remark: '',
      }))
    );
  }, [selectedSubject]);

  const handleScoreChange = (
    studentId: string,
    field: 'ca1' | 'ca2' | 'exam',
    value: string
  ) => {
    const numValue = value === '' ? '' : Number(value);

    // Validation
    const maxValues = { ca1: 20, ca2: 20, exam: 60 };
    if (numValue !== '' && (numValue < 0 || numValue > maxValues[field])) {
      return; // Don't update if invalid
    }

    setScores((prev) =>
      prev.map((score) => {
        if (score.studentId !== studentId) return score;

        const updated = { ...score, [field]: numValue };
        
        // Auto-calculate total, grade, and remark
        const ca1 = Number(updated.ca1) || 0;
        const ca2 = Number(updated.ca2) || 0;
        const exam = Number(updated.exam) || 0;
        
        const total = calculateTotalScore(ca1, ca2, exam);
        const percentage = total; // Since max is 100
        const { grade, remark } = getGradeInfo(percentage, null);

        return {
          ...updated,
          total,
          grade,
          remark,
        };
      })
    );
  };

  const handleSaveScores = async () => {
    if (!selectedSubject) {
      alert('Please select a subject first');
      return;
    }

    // Check if all scores are entered
    const hasEmptyScores = scores.some(
      (s) => s.ca1 === '' || s.ca2 === '' || s.exam === ''
    );

    if (hasEmptyScores) {
      if (!confirm('Some scores are empty. Do you want to save anyway?')) {
        return;
      }
    }

    setSaveLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
      alert('Scores saved successfully!');
    }, 1500);
  };

  const getCompletionStats = () => {
    const total = scores.length;
    const completed = scores.filter(
      (s) => s.ca1 !== '' && s.ca2 !== '' && s.exam !== ''
    ).length;
    return { total, completed, percentage: (completed / total) * 100 };
  };

  const stats = getCompletionStats();

  return (
    <DashboardLayout title="Enter Scores">
      <div className="space-y-6">
        {/* Subject Selection */}
        <div className="card">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Select Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSubject === subject.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-bold text-sm text-neutral-900">{subject.name}</h3>
                <p className="text-xs text-neutral-500 font-mono">{subject.code}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedSubject ? (
          <>
            {/* Progress */}
            <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold">
                    {subjects.find((s) => s.id === selectedSubject)?.name}
                  </h3>
                  <p className="text-sm opacity-90">Score Entry Progress</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {stats.completed}/{stats.total}
                  </p>
                  <p className="text-sm opacity-90">Students</p>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-400 transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

            {/* Scores Table */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Enter Scores</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Clear All
                  </Button>
                  <Button onClick={handleSaveScores} loading={saveLoading} size="sm">
                    Save Scores
                  </Button>
                </div>
              </div>

              {/* Legend */}
              <div className="mb-4 p-4 bg-neutral-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-neutral-700">CA 1:</span>
                    <span className="text-neutral-600"> Max 20 marks</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-700">CA 2:</span>
                    <span className="text-neutral-600"> Max 20 marks</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-700">Exam:</span>
                    <span className="text-neutral-600"> Max 60 marks</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-100">
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Admission No.
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700">
                        Student Name
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700">
                        CA 1
                        <br />
                        <span className="text-xs font-normal">(20)</span>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700">
                        CA 2
                        <br />
                        <span className="text-xs font-normal">(20)</span>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700">
                        Exam
                        <br />
                        <span className="text-xs font-normal">(60)</span>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700 bg-primary-50">
                        Total
                        <br />
                        <span className="text-xs font-normal">(100)</span>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700 bg-primary-50">
                        Grade
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-neutral-700 bg-primary-50">
                        Remark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => {
                      const score = scores.find((s) => s.studentId === student.id)!;
                      return (
                        <tr
                          key={student.id}
                          className={`border-b border-neutral-100 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
                          }`}
                        >
                          <td className="py-3 px-4 font-mono text-neutral-600 text-xs">
                            {student.admissionNumber}
                          </td>
                          <td className="py-3 px-4 font-medium text-neutral-900">
                            {student.name}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={score.ca1}
                              onChange={(e) =>
                                handleScoreChange(student.id, 'ca1', e.target.value)
                              }
                              className="w-16 px-2 py-1 text-center border-2 border-neutral-200 rounded focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none font-mono"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={score.ca2}
                              onChange={(e) =>
                                handleScoreChange(student.id, 'ca2', e.target.value)
                              }
                              className="w-16 px-2 py-1 text-center border-2 border-neutral-200 rounded focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none font-mono"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="60"
                              value={score.exam}
                              onChange={(e) =>
                                handleScoreChange(student.id, 'exam', e.target.value)
                              }
                              className="w-16 px-2 py-1 text-center border-2 border-neutral-200 rounded focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none font-mono"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-primary-700 bg-primary-50">
                            {score.total}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-primary-700 bg-primary-50">
                            {score.grade || '-'}
                          </td>
                          <td className="py-3 px-4 text-center text-xs bg-primary-50">
                            {score.remark || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grading Scale Reference */}
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                  Nigerian Grading Scale
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-9 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-bold">A1</div>
                    <div className="text-neutral-600">75-100</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">B2</div>
                    <div className="text-neutral-600">70-74</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">B3</div>
                    <div className="text-neutral-600">65-69</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">C4</div>
                    <div className="text-neutral-600">60-64</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">C5</div>
                    <div className="text-neutral-600">55-59</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">C6</div>
                    <div className="text-neutral-600">50-54</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">D7</div>
                    <div className="text-neutral-600">45-49</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">E8</div>
                    <div className="text-neutral-600">40-44</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">F9</div>
                    <div className="text-neutral-600">0-39</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Select a Subject to Begin
            </h3>
            <p className="text-neutral-600">
              Choose a subject from the cards above to start entering scores
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
