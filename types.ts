/**
 * @fileoverview This file contains all shared TypeScript types and interfaces
 * used across the application to ensure data consistency and type safety.
 */

/**
 * Defines the possible roles a user can have within the system.
 */
export type Role = 'admin' | 'teacher' | 'student' | 'parent';

/**
 * Represents a user profile in the application, mirroring the Supabase `profiles` table.
 * The `password` is no longer stored in the app state.
 */
export interface User {
  id: string; // Unique identifier (UUID from Supabase auth.users)
  updated_at?: string | null; // The timestamp of the last profile update
  name: string; // User's full name
  email: string; // User's email address (from Supabase auth)
  role: Role; // The user's role, determining their permissions
  childId?: string | null; // Optional: Links a parent to a student user's ID
}

/**
 * Defines the mathematical operations available for quizzes.
 */
export type Operation = 'addition' | 'subtraction' | 'multiplication';

/**
 * Represents the configuration for a single quiz session.
 */
export interface QuizSettings {
  operation: Operation; // The mathematical operation for the quiz
  stage: number; // The difficulty stage
  timer: number; // The time limit per question in seconds
}

/**
 * Represents a single question in a quiz.
 */
export interface Question {
  text: string; // The question text, e.g., "5 + 3 = ?"
  answer: number; // The correct numerical answer
}

/**
 * Stores the result of a single answered question.
 */
export interface QuizResult {
  question: Question; // The original question asked
  userAnswer: number | null; // The answer provided by the user (null if unanswered)
  isCorrect: boolean; // Whether the user's answer was correct
  timeTaken: number; // Time taken to answer the question, in seconds
}

/**
 * A summary of a completed quiz session.
 */
export interface QuizSummary {
  settings: QuizSettings; // The settings for the quiz that was taken
  results: QuizResult[]; // An array of results for each question
  score: number; // The final score as a percentage
  totalTime: number; // The total time taken for all questions
}

/**
 * Represents the progress for different stages within a single operation.
 * The key is the stage (e.g., 'stage1') and the value is the score percentage.
 */
export interface Progress {
  [stage: string]: number; // e.g. { stage1: 90, stage2: 70 }
}

/**
 * Represents a student's progress across all mathematical operations.
 * The key is the operation name, and the value is the progress object for that operation.
 */
export interface StudentProgress {
  [operation: string]: Progress; // e.g. { addition: { stage1: 90 }, ... }
}

/**
 * Represents the entire progress data for all students in the system.
 * The key is the student's ID, and the value is their complete progress object.
 */
export interface ProgressData {
  [studentId: string]: StudentProgress;
}

/**
 * Defines the possible views or screens the user can be on.
 * This is used for simple state-based navigation.
 */
export type View = 'login' | 'signUp' | 'dashboard' | 'selectQuiz' | 'quiz' | 'results';

/**
 * Represents the shape of the data that can be passed when creating a new user.
 */
export interface UserData {
    name: string;
    email: string;
    password?: string;
    role: Role;
    childId?: string | null;
}