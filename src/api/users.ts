import axios from './axios';

// Define the User type to match the interface in users.tsx
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'free' | 'paid';
  pageCount: number;
  isBanned: boolean;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
