/**
 * @fileoverview The user registration screen component.
 * It allows new users to create an account by providing their details and selecting a role.
 */
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { supabase } from '../../services/supabaseClient';
import type { Role, User } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BrainCircuit, LoaderCircle } from 'lucide-react';

/**
 * The sign-up screen for new user registration.
 * @returns {React.ReactElement} The sign-up form component.
 */
const SignUpScreen: React.FC = () => {
  const { signUp, setView } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [childId, setChildId] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state to hold the list of students for parent sign-up.
  const [students, setStudents] = useState<User[]>([]);

  // Effect to fetch student profiles when the component mounts.
  useEffect(() => {
    const fetchStudents = async () => {
      // Parents need to see a list of students to link their account.
      // This data is fetched publicly, regardless of auth state.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      
      if (error) {
        console.error("Error fetching students for sign up:", error);
        setMessage("Could not load the list of students. Please try again later.");
        setIsError(true);
      } else if (data) {
        setStudents(data as User[]);
      }
    };
    
    fetchStudents();
  }, []);

  /**
   * Handles the form submission for creating a new account.
   * @param {React.FormEvent} e The form event.
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    // Basic validation for the parent role.
    if (role === 'parent' && !childId) {
        setMessage('Please select your child.');
        setIsError(true);
        setIsLoading(false);
        return;
    }
    if (!password) {
        setMessage('Password is required.');
        setIsError(true);
        setIsLoading(false);
        return;
    }

    // Call the async signUp function from the context.
    const result = await signUp({ name, email, password, role, childId: role === 'parent' ? childId : undefined });
    setMessage(result.message);
    if (!result.success) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 py-12">
      <div className="w-full max-w-md mx-4">
        <div className="flex justify-center mb-6">
            <BrainCircuit className="h-16 w-16 text-indigo-600" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <p className="text-slate-500 text-sm mt-1">Join Math Trainer to start improving your skills.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Display success or error message after submission */}
              {message && <div className={`${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded relative`} role="alert">{message}</div>}
              <Input id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
              <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              {/* Conditionally render the child selection dropdown if the role is 'parent' */}
              {role === 'parent' && (
                 <div>
                    <label htmlFor="childId" className="block text-sm font-medium text-slate-700 mb-1">Select Your Child</label>
                    <select id="childId" value={childId} onChange={(e) => setChildId(e.target.value)} required className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading}>
                      <option value="">-- Select Child --</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
                      ))}
                    </select>
                    {students.length === 0 && <p className="text-xs text-slate-500 mt-1">No students have been registered yet.</p>}
                 </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{' '}
              {/* Button to switch to the login view */}
              <button onClick={() => setView('login')} className="font-medium text-indigo-600 hover:underline" disabled={isLoading}>
                Sign In
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpScreen;