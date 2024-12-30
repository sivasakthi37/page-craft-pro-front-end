import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { getUserSubscriptionData, updateSubscription } from '../../api/subscription';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  pageLimit: number | null;
}

const plans: SubscriptionPlan[] = [
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
    id: 'paid',
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

const SubscriptionPage: React.FC = () => {
  const { user, updateUserData } = useAuth() || {};
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSubscriptionData = async () => {
      if (!user?.id) {
        toast.error('Please log in to view subscription details');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const subscriptionData = await getUserSubscriptionData(user.id);
        console.log("subscriptionData",subscriptionData);
        
        setCurrentPlan(subscriptionData.user.subscriptionStatus || 'free');
      } catch (err) {
        console.error('Failed to fetch subscription data:', err);
        toast.error('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscriptionData();
  }, [user?.id]);

  const handleUpgrade = async (planId: string) => {
    if (!user?.id) {
      toast.error('Please log in to upgrade your subscription');
      return;
    }

    try {
      setLoading(true);
      console.log('planid',planId);
      
      const updatedSubscription = await updateSubscription(user.id, planId);
      console.log('Upgrade response:', updatedSubscription);
      
      // Update current plan based on the response
      setCurrentPlan(updatedSubscription.user.subscriptionStatus || planId);
      
      // Update AuthContext user data if the ID matches
      if (updateUserData) {
        updateUserData(updatedSubscription.user);
      }
      
      toast.success('Subscription upgraded successfully!');
      
      // Optionally refresh user data or redirect
      // navigate('/dashboard');
    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      toast.error('Failed to upgrade subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
        </div>
      </div>
    );
  }
console.log("currentPlan === plan.id ",currentPlan);

  return (
    <>
      <Breadcrumb pageName="Subscription Plans" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-sm border border-stroke bg-white p-7 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-2xl font-bold text-black dark:text-white">
                {plan.name}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xl font-medium text-black dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-sm font-medium">/month</span>
              </span>
            </div>

            <div className="mb-8 border-b border-stroke pb-8 dark:border-strokedark">
              <h4 className="mb-3 font-medium text-black dark:text-white">
                Features
              </h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              key={plan.id}
              onClick={() => handleUpgrade(plan.id)}
              disabled={currentPlan === plan.id}
              className={`w-full py-3 rounded-lg transition-colors duration-300 ${
                currentPlan === plan.id 
                  ? 'bg-green-500 text-white cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
            >
              {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SubscriptionPage;
