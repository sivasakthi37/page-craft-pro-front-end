import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { format } from 'date-fns';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaCrown, 
  FaUserCircle,
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaGithub 
} from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth() || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb pageName="Profile" />

      <div className="bg-white dark:bg-boxdark shadow-lg rounded-lg overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-48 md:h-64">
          <img
            src={CoverOne}
            alt="Profile Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Details Section */}
        <div className="px-6 py-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Profile Image */}
            <div className="relative -mt-16 md:-mt-24 mb-4 md:mb-0 md:mr-8">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white dark:border-strokedark overflow-hidden flex items-center justify-center">
                <FaUserCircle 
                  className="text-gray-400 dark:text-gray-600" 
                  size={150} 
                />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white flex items-center justify-center md:justify-start">
                <FaUser className="mr-3 text-primary" />
                {user?.username || 'User Name'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                <span className="font-semibold mr-2">Role:</span>
                {user?.role 
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() 
                  : 'User Role'}
              </p>
            </div>
          </div>

          {/* User Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-strokedark p-4 rounded-lg text-center">
              <FaEnvelope className="mx-auto text-primary mb-2" />
              <h4 className="font-semibold">Email</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-strokedark p-4 rounded-lg text-center">
              <FaCalendar className="mx-auto text-primary mb-2" />
              <h4 className="font-semibold">Joined</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.createdAt 
                  ? format(new Date(user.createdAt), 'MMM dd, yyyy') 
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-strokedark p-4 rounded-lg text-center">
              <FaCrown className="mx-auto text-primary mb-2" />
              <h4 className="font-semibold">Subscription</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.subscriptionStatus || 'Free'}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8 text-center">
            <h4 className="text-xl font-semibold mb-4">Connect with Me</h4>
            <div className="flex justify-center space-x-6">
              <Link to="#" className="text-gray-600 hover:text-primary">
                <FaFacebook size={24} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary">
                <FaTwitter size={24} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary">
                <FaLinkedin size={24} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary">
                <FaGithub size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
