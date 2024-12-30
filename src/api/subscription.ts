import axios from './axios';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  pageLimit: number | null;
}

export const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    features: [
      'Up to 10 pages',
      'Basic text editor',
      'Image uploads',
      'Standard support',
    ],
    pageLimit: 10,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 2,
    features: [
      'Unlimited pages',
      'Advanced text editor',
      'Priority image uploads',
      'Priority support',
    ],
    pageLimit: null,
  },
];

export const getCurrentPlan = async () => {
  const response = await axios.get('/api/subscription');
  return response.data;
};

export const upgradePlan = async (planId: string) => {
  // Mock API call - in a real app, this would integrate with a payment provider
  const response = await axios.post('/api/subscription/upgrade', { planId });
  return response.data;
};

export const downgradePlan = async () => {
  const response = await axios.post('/api/subscription/downgrade');
  return response.data;
};

export const checkPageLimit = async (userId:string) => {
  const response = await axios.get('/pages/page/limit',{
    params: { userId },});
  return response.data;
};

export const updateSubscription = async (userId: string, subscriptionStatus: string) => {
  try {
    const response = await axios.put('/users/update-subscription', { 
      userId,
      subscriptionStatus
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const getUserSubscriptionData = async (userId: string) => {
  try {
    const response = await axios.post('/users/subscription/status', {
     userId 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user subscription data:', error);
    throw error;
  }
};
