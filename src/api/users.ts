import axiosInstance from './axios';

// Define the User type to match the interface in users.tsx
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'free' | 'paid';
  pageCount: number;
  status: 'active' | 'banned';
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, status: 'active' | 'banned'): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/status/${userId}`, { status });
    return response.data.user;
  } catch (error) {
    console.error(`Error updating user ${userId} status:`, error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/role/${userId}`, { role });
    return response.data.user;
  } catch (error) {
    console.error(`Error updating user ${userId} role:`, error);
    throw error;
  }
};

export const resetUserPassword = async (userId: string, newPassword: string): Promise<User> => {
  try {
    const response = await axiosInstance.post(`users/reset-password/${userId}`, { newPassword });
    return response.data.user;
  } catch (error) {
    console.error(`Error resetting password for user ${userId}:`, error);
    throw error;
  }
};
