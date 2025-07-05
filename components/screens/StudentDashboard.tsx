/**
 * @fileoverview The dashboard for the 'student' user role.
 * It shows the student's personal progress and allows them to start new quizzes.
 */
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import ProgressTracker from '../ui/ProgressTracker';
import { OPERATIONS } from '../../constants';
import { PlusCircle } from 'lucide-react';
import type { Operation } from '../../types';

/**
 * The main dashboard for students.
 * It visualizes their own progress and provides a call to action to start a new quiz.
 * @returns {React.ReactElement | null} The student dashboard component, or null if no user is logged in.
 */
const StudentDashboard: React.FC = () => {
  const { currentUser, progressData, setView } = useAppContext();

  if (!currentUser) return null;

  // Get the progress data for the currently logged-in student.
  const studentProgress = progressData[currentUser.id] || {};

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Your Dashboard</h1>
            <p className="text-lg text-slate-600">Track your progress and start a new challenge!</p>
        </div>
        {/* Button to navigate to the quiz selection screen */}
        <Button onClick={() => setView('selectQuiz')} size="lg">
          <PlusCircle size={20} className="mr-2" />
          Start New Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(studentProgress).length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Object.keys(OPERATIONS).map((opKey) => {
                    const operation = opKey as Operation;
                    const opDetails = OPERATIONS[operation];
                    const opProgress = studentProgress[operation];

                    // If there's no progress for an operation, show a placeholder.
                    if (!opProgress) {
                       return (
                         <div key={opKey} className="flex flex-col items-center p-4 border border-dashed rounded-lg">
                            <ProgressTracker percentage={0} label={opDetails.name} colorClass="text-slate-400" />
                            <p className="text-xs text-slate-500 mt-2">No attempts yet</p>
                         </div>
                       );
                    }

                    // Calculate the average score for the operation.
                    const totalScore = Object.values(opProgress).reduce((sum, score) => sum + score, 0);
                    const stagesCompleted = Object.keys(opProgress).length;
                    const averageScore = stagesCompleted > 0 ? totalScore / stagesCompleted : 0;

                    return (
                        <div key={opKey} className="flex flex-col items-center">
                            <ProgressTracker percentage={averageScore} label={opDetails.name} colorClass={opDetails.color.replace('bg-', 'text-')}/>
                            {/* Display detailed scores for each stage */}
                            <div className="text-xs mt-2 space-y-1 text-center">
                                {Object.entries(opProgress).map(([stage, score]) => (
                                    <p key={stage} className="text-slate-500 capitalize">{stage.replace('stage', 'Stage ')}: <span className="font-semibold">{score}%</span></p>
                                ))}
                            </div>
                        </div>
                    );
                })}
             </div>
          ) : (
            // Message to show if the student has not completed any quizzes yet.
            <div className="text-center py-10">
              <p className="text-slate-500">You haven't completed any quizzes yet.</p>
              <p className="text-slate-500">Click "Start New Quiz" to begin!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
