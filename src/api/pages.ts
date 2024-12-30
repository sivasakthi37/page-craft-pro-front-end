import axios from './axios';

export interface Block {
  _id?: string;
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

export interface Page {
  _id?: string;
  id: string;
  title: string;
  userId: string;
  blocks: Block[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Page Management
export const createPage = async (page: Page) => {
  try {
    const response = await axios.post('/pages', page);
    return {
      ...response.data,
      id: response.data._id // Ensure compatibility with existing code
    };
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

export const getPages = async (userId?: string) => {
  try {
    const response = await axios.get('/pages', { 
      params: { userId } 
    });
    return response.data.map((page: Page) => ({
      ...page,
      id: page._id // Ensure compatibility with existing code
    }));
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
};

export const updatePage = async (pageId: string, page: Page) => {
  try {
    const response = await axios.put(`/pages/${pageId}`, page);
    return {
      ...response.data,
      id: response.data._id // Ensure compatibility with existing code
    };
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

export const deletePage = async (pageId: string) => {
  const response = await axios.delete(`/pages/${pageId}`);
  return response.data;
};

// Block Management
export const addBlock = async (pageId: string, block: Omit<Block, 'id'>) => {
  const response = await axios.post(`/api/pages/${pageId}/blocks`, block);
  return response.data;
};

export const updateBlock = async (
  pageId: string,
  blockId: string,
  updates: Partial<Block>
) => {
  const response = await axios.patch(
    `/api/pages/${pageId}/blocks/${blockId}`,
    updates
  );
  return response.data;
};

export const deleteBlock = async (pageId: string, blockId: string) => {
  const response = await axios.delete(`/api/pages/${pageId}/blocks/${blockId}`);
  return response.data;
};

export const reorderBlocks = async (
  pageId: string,
  blockIds: { id: string; order: number }[]
) => {
  const response = await axios.patch(`/api/pages/${pageId}/blocks/reorder`, {
    blocks: blockIds,
  });
  return response.data;
};

// Image Upload
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post('/pages/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Admin Functions
export const flagContent = async (
  type: 'page' | 'block',
  id: string,
  reason: string
) => {
  const response = await axios.post(`/api/${type}s/${id}/flag`, { reason });
  return response.data;
};

export const getFlaggedContent = async () => {
  const response = await axios.get('/api/moderation/flagged');
  return response.data;
};

export const searchContent = async (query: string) => {
  const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
  return response.data;
};
