/**
 * @fileoverview The dashboard for the 'teacher' user role.
 * It displays an overview of the progress of all students in the system.
 */
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import type { StudentProgress } from '../../types';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import ProgressTracker from '../ui/ProgressTracker';
import { OPERATIONS } from '../../constants';

/**
 * A component that displays a single student's progress card.
 * @param {{ studentName: string, progress: StudentProgress }} props The component props.
 * @returns {React.ReactElement} A card showing the student's progress.
 */
const StudentProgressCard: React.FC<{ studentName: string, progress: StudentProgress }> = ({ studentName, progress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{studentName}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(progress).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(OPERATIONS).map(([opKey, opDetails]) => {
              const opProgress = progress[opKey as keyof typeof OPERATIONS];
              if (!opProgress) return null; // Don't display if there's no progress for this operation.

              // Calculate the average score for the operation across all completed stages.
              const totalScore = Object.values(opProgress).reduce((sum, score) => sum + score, 0);
              const stagesCompleted = Object.values(opProgress).filter(score => score > 0).length;
              const averageScore = stagesCompleted > 0 ? totalScore / stagesCompleted : 0;
              
              return (
                <div key={opKey} className="flex flex-col items-center">
                  <ProgressTracker percentage={averageScore} label={opDetails.name} colorClass={opDetails.color.replace('bg-', 'text-')} />
                  {/* Display detailed scores for each stage */}
                  <div className="text-xs mt-2 space-y-1">
                      {Object.entries(opProgress).map(([stage, score]) => (
                          <p key={stage} className="text-slate-500">{stage}: <span className="font-semibold">{score}%</span></p>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-center">No quiz data available for this student yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * The main dashboard for teachers.
 * It lists all registered students and their overall progress in different math operations.
 * @returns {React.ReactElement} The teacher dashboard component.
 */
const TeacherDashboard: React.FC = () => {
  const { users, progressData } = useAppContext();
  const students = users.filter(user => user.role === 'student');

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Teacher Dashboard</h1>
      <p className="text-lg text-slate-600">Overview of student performance.</p>
      
      {students.length > 0 ? (
        <div className="space-y-6">
          {students.map(student => (
            <StudentProgressCard key={student.id} studentName={student.name} progress={progressData[student.id] || {}} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <p className="text-center text-slate-500">There are no students registered in the system yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
