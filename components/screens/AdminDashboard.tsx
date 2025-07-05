/**
 * @fileoverview The dashboard for the 'admin' user role.
 * It provides tools to manage all user accounts in the system.
 */
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import type { User } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import UserManagementForm from '../UserManagementForm';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { UserPlus, Edit, Trash2, ShieldCheck, User as UserIcon, GraduationCap, HeartHandshake } from 'lucide-react';

// A map of roles to corresponding icons for visual representation.
const roleIcons: { [key in User['role']]: React.ReactNode } = {
  admin: <ShieldCheck className="h-5 w-5 text-red-500" />,
  teacher: <GraduationCap className="h-5 w-5 text-blue-500" />,
  student: <UserIcon className="h-5 w-5 text-green-500" />,
  parent: <HeartHandshake className="h-5 w-5 text-purple-500" />,
};

/**
 * The main dashboard for administrators.
 * It displays a table of all users and provides controls to add, edit, and delete them.
 * @returns {React.ReactElement} The admin dashboard component.
 */
const AdminDashboard: React.FC = () => {
  const { users, deleteUser, currentUser } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to hold the user being edited. If null, the modal is for adding a new user.
  const [editingUser, setEditingUser] = useState<User | null>(null);

  /** Opens the modal in 'add user' mode. */
  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  /** Opens the modal in 'edit user' mode, pre-filling it with the user's data. */
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  /** Closes the modal and resets the editing state. */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  /**
   * Handles the deletion of a user after a confirmation prompt.
   * @param {string} userId The ID of the user to delete.
   * @param {string} userName The name of the user for the confirmation message.
   */
  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
      await deleteUser(userId);
    }
  };

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle>User Management</CardTitle>
          <Button onClick={openAddModal} className="mt-4 sm:mt-0">
            <UserPlus size={18} className="mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">
                        <div className="flex items-center gap-2">
                           {roleIcons[user.role]}
                           <span>{user.role}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(user)} aria-label={`Edit ${user.name}`}>
                          <Edit size={16} />
                        </Button>
                        {/* The current admin user cannot be deleted. */}
                        {user.id !== currentUser?.id && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id, user.name)} aria-label={`Delete ${user.name}`}>
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* The modal for adding or editing users. */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add New User'}>
        <UserManagementForm userToEdit={editingUser} onComplete={closeModal} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;