/**
 * @fileoverview The main header component for the application.
 * It displays the app title, a welcome message for the user, and a logout button.
 */
import React from 'react';
import { LogOut, BrainCircuit } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from './Button';

/**
 * A header component that is displayed at the top of the page for authenticated users.
 * It allows navigation back to the dashboard and provides a logout function.
 * @returns {React.ReactElement | null} The header component, or null if no user is logged in.
 */
const Header: React.FC = () => {
  const { currentUser, logout, setView } = useAppContext();

  // Do not render the header if there is no logged-in user.
  if (!currentUser) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* App logo and title, clickable to return to the dashboard */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <BrainCircuit className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800">Math Trainer</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Welcome message, hidden on small screens */}
            <span className="text-slate-600 hidden sm:block">
              Welcome, <strong className="font-medium">{currentUser.name}</strong>!
            </span>
            {/* Logout button */}
            <Button onClick={logout} variant="ghost" className="px-2">
              <LogOut size={20} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
