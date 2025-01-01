import axios from './axios';

export interface UserDetails {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'super_admin';
  subscriptionStatus: 'free' | 'paid';
  subscriptionExpiry: string | null;
  createdAt: string;
  disabled?: boolean;
  disableReason?: string;
}

// User Management
export const getAllUsers = async () => {
  const response = await axios.get('/api/admin/users');
  return response.data;
};

export const getUserDetails = async (userId: string) => {
  const response = await axios.get(`/users/${userId}/details`);
  return response.data;
};

// export const updateUserRole = async (userId: string, role: 'user' | 'super_admin') => {
//   const response = await axios.patch(`/api/admin/users/${userId}/role`, { role });
//   return response.data;
// };

// export const resetUserPassword = async (userId: string) => {
//   const response = await axios.post(`/api/admin/users/${userId}/reset-password`);
//   return response.data;
// };

// export const disableUser = async (userId: string, reason: string) => {
//   const response = await axios.post(`/api/admin/users/${userId}/disable`, { reason });
//   return response.data;
// };

// export const enableUser = async (userId: string) => {
//   const response = await axios.post(`/api/admin/users/${userId}/enable`);
//   return response.data;
// };

// // Content Moderation
// export const getFlaggedUsers = async () => {
//   const response = await axios.get('/api/admin/moderation/users');
//   return response.data;
// };

// export const getFlaggedPages = async () => {
//   const response = await axios.get('/api/admin/moderation/pages');
//   return response.data;
// };

// export const getFlaggedBlocks = async () => {
//   const response = await axios.get('/api/admin/moderation/blocks');
//   return response.data;
// };

// export const reviewFlaggedContent = async (
//   type: 'user' | 'page' | 'block',
//   id: string,
//   action: 'approve' | 'reject',
//   reason?: string
// ) => {
//   const response = await axios.post(`/api/admin/moderation/${type}s/${id}/review`, {
//     action,
//     reason,
//   });
//   return response.data;
// };

// // Analytics and Reports
// export const getUserStats = async () => {
//   const response = await axios.get('/api/admin/stats/users');
//   return response.data;
// };

// export const getContentStats = async () => {
//   const response = await axios.get('/api/admin/stats/content');
//   return response.data;
// };

// export const getModerationStats = async () => {
//   const response = await axios.get('/api/admin/stats/moderation');
//   return response.data;
// };
