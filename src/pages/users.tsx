import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { FaUser, FaBan, FaCrown, FaLock, FaUnlock } from 'react-icons/fa';
import { fetchUsers, User } from '../api/users';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const handleResetPassword = (userId: number) => {
    // Implement password reset logic
    console.log(`Reset password for user ${userId}`);
  };

  const handleToggleRole = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, role: user.role === 'user' ? 'admin' : 'user' }
        : user
    ) as User[];
    setUsers(updatedUsers);
  };

  const handleBanUser = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, isBanned: !user.isBanned }
        : user
    ) as User[];
    setUsers(updatedUsers);
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

  return (
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
                <th className="p-3 text-center">Page Count</th>
                <th className="p-3 text-center">Actions</th>
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
                    {user.pageCount} / {user.subscriptionStatus === 'free' ? '10' : 'Unlimited'}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleResetPassword(user.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Reset Password"
                      >
                        <FaLock />
                      </button>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleToggleRole(user.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Promote to Super Admin"
                        >
                          <FaCrown />
                        </button>
                      )}
                      <button 
                        onClick={() => handleBanUser(user.id)}
                        className={`${user.isBanned ? 'text-green-500' : 'text-red-500'} hover:opacity-75`}
                        title={user.isBanned ? 'Unban User' : 'Ban User'}
                      >
                        {user.isBanned ? <FaUnlock /> : <FaBan />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
