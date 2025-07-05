/**
 * @fileoverview A screen that allows students to select the settings for their quiz.
 */
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { OPERATIONS, TIMER_OPTIONS } from '../../constants';
import type { Operation } from '../../types';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

/**
 * The quiz selection screen where users choose the operation,
 * difficulty stage, and time limit for their next quiz.
 * @returns {React.ReactElement} The quiz selection form component.
 */
const SelectQuizScreen: React.FC = () => {
  const { startQuiz, setView } = useAppContext();
  const [operation, setOperation] = useState<Operation>('addition');
  const [stage, setStage] = useState(1);
  const [timer, setTimer] = useState(8);
  
  // Get the details of the currently selected operation.
  const selectedOperation = OPERATIONS[operation];

  /**
   * Finalizes the settings and calls the context function to start the quiz.
   */
  const handleStartQuiz = () => {
    startQuiz({ operation, stage, timer });
  };

  return (
    <div className="max-w-2xl mx-auto">
       <Card>
            <CardHeader>
                <CardTitle>Setup Your Challenge</CardTitle>
                <p className="text-slate-500 mt-1">Choose an operation, stage, and timer to begin.</p>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* 1. Operation Selection */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">1. Select Operation</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(OPERATIONS).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setOperation(key as Operation);
                                    setStage(1); // Reset stage to 1 when operation changes
                                }}
                                className={`p-4 rounded-lg text-white font-bold text-center transition-transform duration-200 ${value.color} ${operation === key ? 'ring-4 ring-offset-2 ring-indigo-500' : 'hover:scale-105'}`}
                            >
                                {value.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Stage Selection */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">2. Select Stage</h3>
                    <div className="flex flex-wrap gap-3">
                        {Array.from({ length: selectedOperation.stages }, (_, i) => i + 1).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStage(s)}
                                className={`px-5 py-2 rounded-full font-medium transition-colors ${stage === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
                            >
                                Stage {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Timer Selection */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">3. Select Timer (per question)</h3>
                     <div className="flex flex-wrap gap-3">
                        {TIMER_OPTIONS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimer(t)}
                                className={`px-5 py-2 rounded-full font-medium transition-colors ${timer === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
                            >
                                {t} seconds
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                    <Button variant="secondary" onClick={() => setView('dashboard')}>
                        Back to Dashboard
                    </Button>
                    <Button onClick={handleStartQuiz} className="text-lg px-8">
                        Start Quiz
                    </Button>
                </div>
            </CardContent>
       </Card>
    </div>
  );
};

export default SelectQuizScreen;
