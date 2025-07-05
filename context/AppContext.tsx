/**
 * @fileoverview This file defines the main React Context for the application.
 * It provides a centralized state management system for user data, authentication,
 * progress, navigation, and quiz state, all powered by Supabase.
 */
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User, Role, ProgressData, View, QuizSettings, QuizSummary, StudentProgress, UserData } from '../types';

/**
 * Defines the shape of the context object that will be provided to consumers.
 */
interface AppContextType {
  // State properties
  isLoading: boolean;
  users: User[];
  currentUser: User | null;
  progressData: ProgressData;
  view: View;
  quizSettings: QuizSettings | null;
  quizResults: QuizSummary | null;

  // Methods to manipulate state
  setView: (view: View) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  signUp: (data: UserData) => Promise<{ success: boolean; message: string }>;
  addUser: (data: UserData) => Promise<{ success: boolean; message: string }>;
  updateUser: (user: User) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<void>;
  startQuiz: (settings: QuizSettings) => void;
  finishQuiz: (summary: QuizSummary) => void;
}

/**
 * The React Context object. Components will consume this to access the state and methods.
 */
export const AppContext = createContext<AppContextType | undefined>(undefined);


/**
 * The provider component that wraps the application and supplies the context value.
 * It manages all the global state and logic.
 * @param {{ children: ReactNode }} props The child components to be rendered within the provider.
 * @returns {React.ReactElement} The context provider component.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [progressData, setProgressData] = useState<ProgressData>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [quizResults, setQuizResults] = useState<QuizSummary | null>(null);

  /**
   * Fetches all user profiles from the database.
   */
  const fetchAllUsers = useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data as User[]);
    }
  }, []);

  /**
   * Fetches all progress data and transforms it into the nested structure
   * the application UI expects.
   */
  const fetchAllProgressData = useCallback(async () => {
    const { data, error } = await supabase.from('progress').select('*');
    if (error) {
      console.error('Error fetching progress data:', error);
      return;
    }
    // Transforms a flat list of progress records from Supabase into a nested object
    // structured by student ID, then by operation, for easier lookup in the UI.
    // e.g., { 'student-uuid': { 'addition': { 'stage1': 90 } } }
    const transformedData: ProgressData = {};
    for (const record of data) {
        const studentId = record.user_id;
        if (!transformedData[studentId]) {
            transformedData[studentId] = {};
        }
        const studentProgress: StudentProgress = transformedData[studentId];
        const { operation, stage, score } = record;
        if (!studentProgress[operation]) {
            studentProgress[operation] = {};
        }
        studentProgress[operation][`stage${stage}`] = score;
    }
    setProgressData(transformedData);
  }, []);

  // Effect to manage user authentication state changes.
  useEffect(() => {
    setIsLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          // User is signed in. Fetch their profile.
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
              const userWithEmail: User = { ...profile, email: session.user.email! };
              setCurrentUser(userWithEmail);
              setView('dashboard');
              // Fetch all data needed for the app
              await fetchAllUsers();
              await fetchAllProgressData();
          }
        } else {
          // User is signed out.
          setCurrentUser(null);
          setView('login');
          setUsers([]);
          setProgressData({});
        }
        setIsLoading(false);
      }
    );
    // Cleanup subscription on unmount
    return () => subscription?.unsubscribe();
  }, [fetchAllUsers, fetchAllProgressData]);

  /** Handles user login. */
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { success: false, message: error.message };
    }
    return { success: true, message: 'Login successful!' };
  };

  /** Handles user logout. */
  const logout = async () => {
    await supabase.auth.signOut();
  };

  /** Handles new user registration. */
  const signUp = async (data: UserData): Promise<{ success: boolean; message: string; }> => {
    // Supabase trigger will create the profile, but we need to pass the metadata.
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password!,
      options: {
        data: {
          name: data.name,
          role: data.role
        }
      }
    });

    if (error) return { success: false, message: error.message };

    // If a parent is created, link their child in a second step.
    if (signUpData.user && data.role === 'parent' && data.childId) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ child_id: data.childId })
            .eq('id', signUpData.user.id);
        
        if (profileError) {
            // Note: In a real app, you might want a more robust transaction here.
            return { success: false, message: `User created, but failed to link child: ${profileError.message}` };
        }
    }
    
    return { success: true, message: 'Sign up successful! Please check your email for a confirmation link.' };
  };
  
  /** Adds a new user (admin action). */
  const addUser = async (data: UserData): Promise<{ success: boolean; message: string; }> => {
      // NOTE: Admin adding a user uses the same signUp flow.
      // This has the side-effect of logging the admin out and logging the new user in.
      // This is a limitation of client-side-only admin actions.
      const result = await signUp(data);
      if (result.success) {
          await fetchAllUsers(); // Refresh user list
          return { success: true, message: 'User added successfully. Admin will be logged out.' };
      }
      return result;
  };

  /** Updates an existing user's details (admin action). */
  const updateUser = async (updatedUser: User): Promise<{ success: boolean; message: string; }> => {
      // Admins can only update non-auth data from the client-side.
      const { error } = await supabase
        .from('profiles')
        .update({
            name: updatedUser.name,
            role: updatedUser.role,
            child_id: updatedUser.childId
        })
        .eq('id', updatedUser.id);

      if (error) return { success: false, message: error.message };
      
      await fetchAllUsers(); // Refresh user list
      return { success: true, message: 'User updated successfully.' };
  };

  /** Deletes a user (admin action). */
  const deleteUser = async (userId: string) => {
    // Note: This only deletes the user's public profile and progress data.
    // The actual authentication user cannot be deleted from the client-side for security.
    // This requires a server-side (Edge Function) call with admin privileges.
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
    if(profileError) console.error("Error deleting profile:", profileError.message);

    const { error: progressError } = await supabase.from('progress').delete().eq('user_id', userId);
    if(progressError) console.error("Error deleting progress:", progressError.message);

    await fetchAllUsers();
    await fetchAllProgressData();
  };

  /** Sets quiz settings and navigates to the quiz screen. */
  const startQuiz = (settings: QuizSettings) => {
    setQuizSettings(settings);
    setView('quiz');
  };

  /** Processes quiz results, updates progress data, and navigates to the results screen. */
  const finishQuiz = useCallback(async (summary: QuizSummary) => {
    if (!currentUser || currentUser.role !== 'student') return;

    setQuizResults(summary);
    
    // Save the result to the Supabase `progress` table.
    const { error } = await supabase.from('progress').insert({
        user_id: currentUser.id,
        operation: summary.settings.operation,
        stage: summary.settings.stage,
        score: summary.score,
        total_time: summary.totalTime,
    });

    if (error) {
        console.error("Failed to save quiz progress:", error);
    } else {
        // Refresh progress data after successful save
        await fetchAllProgressData();
    }
    
    setView('results');
  }, [currentUser, fetchAllProgressData]);

  // The value object provided to context consumers.
  const value = {
    isLoading,
    users,
    currentUser,
    progressData,
    view,
    quizSettings,
    quizResults,
    setView,
    login,
    logout,
    signUp,
    addUser,
    updateUser,
    deleteUser,
    startQuiz,
    finishQuiz,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};