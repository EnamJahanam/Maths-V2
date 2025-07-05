/**
 * @fileoverview A form component for adding or editing user accounts.
 * This form is typically used within a modal in the Admin Dashboard.
 */
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { User, Role } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import { LoaderCircle } from 'lucide-react';

/**
 * Props for the UserManagementForm component.
 */
interface UserManagementFormProps {
  /** The user object to edit. If null, the form is in 'add' mode. */
  userToEdit: User | null;
  /** A callback function to execute when the form is completed (e.g., to close the modal). */
  onComplete: () => void;
}

/**
 * A form for creating and updating user data.
 * It adapts its behavior based on whether it's editing an existing user or adding a new one.
 * @param {UserManagementFormProps} props The properties for the form.
 * @returns {React.ReactElement} The user management form component.
 */
const UserManagementForm: React.FC<UserManagementFormProps> = ({ userToEdit, onComplete }) => {
  const { addUser, updateUser, users } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [childId, setChildId] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to populate the form fields when `userToEdit` changes.
  useEffect(() => {
    if (userToEdit) {
      // Pre-fill form for editing.
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setPassword(''); // Don't pre-fill password for security reasons.
      setRole(userToEdit.role);
      setChildId(userToEdit.childId || '');
    } else {
      // Reset form for adding a new user.
      setName('');
      setEmail('');
      setPassword('');
      setRole('student');
      setChildId('');
    }
    // Clear any previous messages when the form mode changes.
    setMessage('');
    setIsError(false);
  }, [userToEdit]);
  
  // Get a list of students for the parent-child linking dropdown.
  const students = users.filter(u => u.role === 'student');

  /**
   * Handles the form submission for both adding and editing users.
   * @param {React.FormEvent} e The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);
    
    let result: { success: boolean; message: string; };

    if (userToEdit) { // Logic for editing an existing user.
      result = await updateUser({
        ...userToEdit,
        name,
        email, // Note: email cannot be changed from here due to Supabase client limitations
        role,
        childId: role === 'parent' ? childId : null,
      });

    } else { // Logic for adding a new user.
      if (!password) {
        setMessage('Password is required for new users.');
        setIsError(true);
        setIsLoading(false);
        return;
      }
      result = await addUser({ name, email, password, role, childId: role === 'parent' ? childId : null });
    }

    setMessage(result.message);
    setIsError(!result.success);
    setIsLoading(false);
    if(result.success) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display feedback message */}
      {message && <div className={`${isError ? 'text-red-600' : 'text-green-600'} text-sm`}>{message}</div>}
      <Input id="form-name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
      <Input id="form-email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading || !!userToEdit} />
      { !userToEdit && <Input id="form-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={userToEdit ? 'Leave blank to keep unchanged' : ''} disabled={isLoading} /> }
      <div>
        <label htmlFor="form-role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
        <select id="form-role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {/* Conditional dropdown for linking a parent to a child */}
      {role === 'parent' && (
        <div>
            <label htmlFor="form-childId" className="block text-sm font-medium text-slate-700 mb-1">Link to Child</label>
            <select id="form-childId" value={childId} onChange={(e) => setChildId(e.target.value)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading}>
                <option value="">-- Select Child --</option>
                {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
                ))}
            </select>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onComplete} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
           {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  userToEdit ? 'Save Changes' : 'Add User'
                )}
        </Button>
      </div>
    </form>
  );
};

export default UserManagementForm;