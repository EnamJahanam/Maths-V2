/**
 * @fileoverview This file defines a custom hook, `useAppContext`,
 * which simplifies the process of accessing the `AppContext`.
 */
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * A custom hook to consume the AppContext.
 * It provides a convenient way to access the global state and methods
 * without having to import `useContext` and `AppContext` in every component.
 * It also includes a check to ensure the hook is used within an `AppProvider`,
 * preventing common runtime errors.
 * @throws {Error} If the hook is used outside of an `AppProvider`.
 * @returns The context value, containing the application's state and actions.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
