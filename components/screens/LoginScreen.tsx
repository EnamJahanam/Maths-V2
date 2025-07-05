/**
 * @fileoverview The user login screen component.
 * It provides a form for users to enter their credentials and sign in.
 */
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BrainCircuit, LoaderCircle } from 'lucide-react';

/**
 * The login screen where users can authenticate.
 * @returns {React.ReactElement} The login form component.
 */
const LoginScreen: React.FC = () => {
  const { login, setView } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submission for logging in.
   * @param {React.FormEvent} e The form event.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Attempt to log in using the context's async login function.
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    // If login is successful, the onAuthStateChange listener in context will handle navigation.
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md mx-4">
        <div className="flex justify-center mb-6">
           <BrainCircuit className="h-16 w-16 text-indigo-600" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue to Math Trainer.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Display login error message if any */}
              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <p className="text-center text-sm text-slate-600 mt-6">
              Don't have an account?{' '}
              {/* Button to switch to the sign-up view */}
              <button onClick={() => setView('signUp')} className="font-medium text-indigo-600 hover:underline" disabled={isLoading}>
                Sign Up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;