/**
 * @fileoverview A screen to display the results and summary of a completed quiz.
 */
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import ProgressTracker from '../ui/ProgressTracker';

/**
 * The results screen, which summarizes the user's performance on the quiz they just finished.
 * @returns {React.ReactElement} The results summary component.
 */
const ResultsScreen: React.FC = () => {
  const { quizResults, setView } = useAppContext();

  // If there are no results in the context, show a fallback message.
  if (!quizResults) {
    return (
        <div className="text-center">
            <p>No results to display.</p>
            <Button onClick={() => setView('dashboard')}>Go to Dashboard</Button>
        </div>
    );
  }

  // Destructure the results for easier access.
  const { settings, results, score, totalTime } = quizResults;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const incorrectAnswers = results.length - correctAnswers;
  const averageTime = totalTime / results.length;

  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-4xl">Quiz Complete!</CardTitle>
                <p className="text-slate-500 mt-2">Here's how you did on {settings.operation} (Stage {settings.stage})</p>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Top section with summary stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <Card className="!p-6">
                        <ProgressTracker percentage={score} label="Your Score" size={150} strokeWidth={12} />
                    </Card>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="!p-6 flex flex-col justify-center items-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mb-2"/>
                            <p className="text-4xl font-bold">{correctAnswers}</p>
                            <p className="text-slate-500">Correct Answers</p>
                        </Card>
                         <Card className="!p-6 flex flex-col justify-center items-center">
                            <XCircle className="h-12 w-12 text-red-500 mb-2"/>
                            <p className="text-4xl font-bold">{incorrectAnswers}</p>
                            <p className="text-slate-500">Incorrect Answers</p>
                        </Card>
                         <Card className="!p-6 flex flex-col justify-center items-center sm:col-span-2">
                            <Clock className="h-12 w-12 text-blue-500 mb-2"/>
                            <p className="text-4xl font-bold">{averageTime.toFixed(2)}s</p>
                            <p className="text-slate-500">Average Time per Question</p>
                        </Card>
                    </div>
                </div>

                {/* Detailed results table */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Question</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Your Answer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Correct Answer</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Result</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {results.map((r, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 font-mono">{r.question.text}</td>
                                        <td className={`px-4 py-3 font-mono ${!r.isCorrect && 'text-red-600'}`}>{r.userAnswer ?? 'N/A'}</td>
                                        <td className="px-4 py-3 font-mono text-green-600">{r.question.answer}</td>
                                        <td className="px-4 py-3 text-center">
                                            {r.isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-4 pt-6 border-t">
                    <Button variant="secondary" onClick={() => setView('selectQuiz')}>Play Again</Button>
                    <Button onClick={() => setView('dashboard')}>Back to Dashboard</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default ResultsScreen;
