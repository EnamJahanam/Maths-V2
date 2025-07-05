/**
 * @fileoverview The root component of the application.
 * It wraps the entire app in an `AppProvider` to supply context and
 * determines which screen to display based on the current application state.
 */
import React from 'react';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './hooks/useAppContext';
import LoginScreen from './components/screens/LoginScreen';
import SignUpScreen from './components/screens/SignUpScreen';
import AdminDashboard from './components/screens/AdminDashboard';
import TeacherDashboard from './components/screens/TeacherDashboard';
import StudentDashboard from './components/screens/StudentDashboard';
import ParentDashboard from './components/screens/ParentDashboard';
import SelectQuizScreen from './components/screens/SelectQuizScreen';
import QuizScreen from './components/screens/QuizScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import Header from './components/ui/Header';
import { LoaderCircle } from 'lucide-react';

/**
 * The core content renderer of the application.
 * It consumes the application context and uses a switch statement
 * to render the appropriate screen based on the current user's
 * authentication status and the current `view` state.
 * @returns {React.ReactElement} The component to be rendered.
 */
const AppContent: React.FC = () => {
  const { view, currentUser, quizSettings, quizResults, isLoading } = useAppContext();

  // Show a loading screen while the app is checking the user's session with Supabase.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  /**
   * Renders the main content based on application state.
   * This function implements the primary navigation logic.
   * @returns {React.ReactElement} The currently active screen.
   */
  const renderContent = () => {
    // If no user is logged in, show login or sign-up screen.
    if (!currentUser) {
      if (view === 'signUp') return <SignUpScreen />;
      return <LoginScreen />;
    }

    // If a user is logged in, show authenticated views.
    switch (view) {
      case 'selectQuiz':
        return <SelectQuizScreen />;
      case 'quiz':
        // Fallback to quiz selection if settings are somehow lost.
        if (!quizSettings) return <SelectQuizScreen />;
        return <QuizScreen />;
      case 'results':
        // Fallback to dashboard if results are somehow lost.
        if (!quizResults) return <StudentDashboard />;
        return <ResultsScreen />;
      case 'dashboard':
      default:
        // Render the correct dashboard based on the user's role.
        switch (currentUser.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'teacher':
            return <TeacherDashboard />;
          case 'student':
            return <StudentDashboard />;
          case 'parent':
            return <ParentDashboard />;
          default:
            // Fallback to login screen if role is unrecognized.
            return <LoginScreen />;
        }
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* The header is only shown for authenticated users */}
      {currentUser && <Header />}
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

/**
 * The main App component.
 * It wraps the `AppContent` with the `AppProvider`, making the global state
 * and actions available to all descendant components.
 * @returns {React.ReactElement} The complete application structure.
 */
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;