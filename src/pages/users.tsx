import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { FaUser, FaBan, FaCrown, FaLock, FaUnlock, FaFileAlt,FaUserEdit } from 'react-icons/fa';
import { fetchUsers, updateUserStatus, updateUserRole, resetUserPassword, User } from '../api/users';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Super Admin Actions
  const handleResetPassword = async (userId: number) => {
    setSelectedUserId(userId);
    setIsPasswordResetModalOpen(true);
  };

  const confirmPasswordReset = async () => {
    if (!selectedUserId) return;

    try {
      await resetUserPassword(selectedUserId, newPassword);
      toast.success('Password reset successfully');
      setIsPasswordResetModalOpen(false);
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleToggleRole = async (userId: number, currentRole: 'user' | 'admin') => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const updatedUser = await updateUserRole(userId, newRole);

      const updatedUsers = users.map(user => 
        user.id === userId ? updatedUser : user
      );

      console.log("updatedUsers", updatedUsers);
      
      setUsers(updatedUsers);

      // Show success toast
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error toggling user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleBanUser = async (userId: number) => {
    try {
      // Determine the new status based on current status
      const userToUpdate = users.find(user => user.id === userId);
      const newStatus = userToUpdate?.status === 'active' ? 'banned' : 'active';

      // Call API to update user status
      const updatedUser = await updateUserStatus(userId, newStatus);

      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? updatedUser : user
      );

      console.log("updatedUsers",updatedUsers);
      
      setUsers(updatedUsers);

      // Show success toast
      toast.success(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      // Show error toast
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const handleViewUserPages = (userId: number) => {
    navigate(`/pages/${userId}`);
  };

  console.log('usersssss' ,users);

  const filteredUsers = users.filter(user => 
    (filterRole === 'all' || user.role === filterRole) &&
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log('filteredUsers',filteredUsers);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
console.log("user.role === 'admin' && authUser?.id && Number(authUser.id) === user.id",authUser?.id);
  return (
    <>
      <div className="dark:bg-boxdark dark:text-bodydark">
        <Breadcrumb pageName="User Management" />
        
        <div className="container mx-auto p-4">
          {/* Search and Filter */}
          <div className="mb-4 flex space-x-4">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded dark:bg-strokedark dark:border-strokedark"
            />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'user' | 'admin')}
              className="p-2 border rounded dark:bg-strokedark dark:border-strokedark"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Role</th>
                  <th className="p-3 text-center">Subscription</th>
                  <th className="p-3 text-center">Ban/Unban</th>
                  <th className="p-3 text-center">Reset Password</th>
                  <th className="p-3 text-center">promate/demote</th>
                  <th className="p-3 text-center">View Pages</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b dark:border-strokedark">
                    <td className="p-3 flex items-center">
                      <FaUser className="mr-2" />
                      {user.username}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 text-center">
                      {user.role === 'admin' ? (
                        <span className="flex items-center justify-center text-yellow-500">
                          <FaCrown className="mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="text-blue-500">User</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {user.subscriptionStatus === 'paid' ? 
                        <span className="text-green-500">Paid</span> : 
                        <span className="text-gray-500">Free</span>
                      }
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleBanUser(user.id)}
                        className={`${user.status === 'active' ? 'text-green-500' : 'text-red-500'} hover:opacity-75`}
                        title={user.status === 'active' ? 'Unban User' : 'Ban User'}
                      >
                        {user.status === 'active' ?  <FaUnlock /> : <FaBan />}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleResetPassword(user.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Reset Password"
                      >
                        <FaLock />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      {(user.role === 'admin' && authUser?.id && authUser.id === user.id) ? null : (
                        <button 
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className={`${user.role === 'admin' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                          title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {user.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleViewUserPages(user.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View User Pages"
                      >
                        <FaFileAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isPasswordResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <input 
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsPasswordResetModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPasswordReset}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
