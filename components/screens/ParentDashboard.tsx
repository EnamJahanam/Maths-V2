/**
 * @fileoverview The dashboard for the 'parent' user role.
 * It displays the progress of their linked child.
 */
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import ProgressTracker from '../ui/ProgressTracker';
import { OPERATIONS } from '../../constants';
import type { Operation } from '../../types';

/**
 * The main dashboard for parents.
 * It finds the parent's linked child and displays their academic progress.
 * @returns {React.ReactElement} The parent dashboard component.
 */
const ParentDashboard: React.FC = () => {
  const { currentUser, users, progressData } = useAppContext();

  // Handle case where the parent is not linked to a child.
  if (!currentUser || !currentUser.childId) {
    return (
        <Card>
            <CardContent>
                <p className="text-center text-red-600">No child is linked to this account. Please contact an administrator.</p>
            </CardContent>
        </Card>
    );
  }

  // Find the child's user object from the list of all users.
  const child = users.find(user => user.id === currentUser.childId);
  
  // Handle case where the linked child's account cannot be found.
  if (!child) {
     return (
        <Card>
            <CardContent>
                <p className="text-center text-red-600">Could not find the linked child's account. Please contact an administrator.</p>
            </CardContent>
        </Card>
    );
  }

  // Get the progress data for the linked child.
  const childProgress = progressData[child.id] || {};

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Parent Dashboard</h1>
      <p className="text-lg text-slate-600">Viewing progress for <span className="font-semibold text-indigo-600">{child.name}</span>.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>{child.name}'s Progress Report</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(childProgress).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {Object.keys(OPERATIONS).map((opKey) => {
                const operation = opKey as Operation;
                const opDetails = OPERATIONS[operation];
                const opProgress = childProgress[operation];

                // If no progress for an operation, show a placeholder.
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
                    <ProgressTracker percentage={averageScore} label={opDetails.name} colorClass={opDetails.color.replace('bg-', 'text-')} />
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
            // Message to show if the child has not completed any quizzes.
            <div className="text-center py-10">
              <p className="text-slate-500">{child.name} hasn't completed any quizzes yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;
