/**
 * @fileoverview The main interface for taking a quiz.
 * It displays questions, handles user input, and tracks progress.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { generateQuestion } from '../../services/quizService';
import type { Question, QuizResult } from '../../types';
import Timer from '../ui/Timer';
import Input from '../ui/Input';
import Button from '../ui/Button';

// The fixed number of questions per quiz session.
const TOTAL_QUESTIONS = 10;

/**
 * The main quiz-taking component.
 * It manages the flow of the quiz from start to finish.
 * @returns {React.ReactElement} The quiz interface component.
 */
const QuizScreen: React.FC = () => {
  const { quizSettings, finishQuiz, setView } = useAppContext();
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatically focus the input field when a new question is displayed.
  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, [question]);

  /**
   * A memoized function to advance to the next question or finish the quiz.
   */
  const nextQuestion = useCallback(() => {
    if (!quizSettings) return;

    // If all questions have been answered, finalize and finish the quiz.
    if (questionIndex >= TOTAL_QUESTIONS) {
      const totalTime = results.reduce((sum, r) => sum + r.timeTaken, 0);
      const score = (results.filter(r => r.isCorrect).length / TOTAL_QUESTIONS) * 100;
      finishQuiz({ settings: quizSettings, results, score, totalTime });
      return;
    }

    // Reset state for the new question.
    setIsAnswered(false);
    setFeedback('');
    setUserAnswer('');
    setQuestion(generateQuestion(quizSettings.operation, quizSettings.stage));
    setQuestionIndex(prev => prev + 1);
    setStartTime(Date.now());
  }, [quizSettings, questionIndex, results, finishQuiz]);

  // Effect to load the first question when the component mounts.
  useEffect(() => {
    nextQuestion();
    // This effect should only run once at the beginning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Processes the user's answer, provides feedback, and records the result.
   */
  const handleAnswerSubmit = useCallback((answerStr: string) => {
    if (isAnswered || !question) return;

    setIsAnswered(true);
    const timeTaken = (Date.now() - startTime) / 1000;
    const answerNum = answerStr === '' ? null : parseInt(answerStr, 10);
    const isCorrect = answerNum === question.answer;

    setFeedback(isCorrect ? 'Correct!' : `Oops! The correct answer was ${question.answer}.`);

    setResults(prev => [...prev, {
      question,
      userAnswer: answerNum,
      isCorrect,
      timeTaken
    }]);

    // Wait for a short period before showing the next question.
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [isAnswered, question, startTime, nextQuestion]);

  /** Handles form submission via the Enter key. */
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnswerSubmit(userAnswer);
  };
  
  /** Callback for the Timer component when time runs out. */
  const handleTimeUp = useCallback(() => {
     handleAnswerSubmit(''); // Submit an empty answer.
  }, [handleAnswerSubmit]);

  // Loading state while the first question is being generated.
  if (!quizSettings || !question) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-2xl font-semibold">Loading quiz...</div>
        </div>
    );
  }
  
  const feedbackColor = feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-xl shadow-lg border">
            <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-lg font-semibold text-slate-600">Question {questionIndex} / {TOTAL_QUESTIONS}</h2>
                <Button variant="secondary" size="sm" onClick={() => { if(window.confirm('Are you sure you want to exit the quiz?')) setView('dashboard')}}>Exit</Button>
            </div>
            
            <Timer initialTime={quizSettings.timer} onTimeUp={handleTimeUp} timerKey={questionIndex} />

            <div className="text-center my-10">
                <p className="text-6xl font-bold text-slate-800 tracking-wider">{question.text.split('=')[0]}=</p>
            </div>
            
            <form onSubmit={handleSubmitForm}>
                <Input
                    ref={inputRef}
                    id="answer"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="text-center text-3xl font-bold h-16"
                    disabled={isAnswered}
                    autoFocus
                />
            </form>
            
            {isAnswered && (
                <div className={`text-center mt-6 text-2xl font-bold ${feedbackColor}`}>
                    {feedback}
                </div>
            )}
        </div>
    </div>
  );
};

export default QuizScreen;
