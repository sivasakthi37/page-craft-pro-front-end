import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPages, deletePage, Page } from '../api/pages';
import { getUserDetails } from '../api/admin';
import { useAuth } from '../AuthContext';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Pages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const routes = useParams();
  const userId = routes.userId || user?.id;

  useEffect(() => {
    const fetchPages = async () => {
      try {
        if (userId) {
          const fetchedPages = await getPages(userId);
          setPages(fetchedPages);

          // Only fetch user details if current user is admin
          if (user?.role === 'admin') {
            const details = await getUserDetails(userId);
            setUserDetails(details.user);
          }
        }
      } catch (err) {
        setError('Failed to fetch pages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [userId, user?.role]);

  const handleDeletePage = async (pageId: string) => {
    try {
      console.log("pageId",pageId);
      
      await deletePage(pageId);
      setPages(pages.filter(page => page.id !== pageId));
    } catch (err) {
      setError('Failed to delete page');
      console.error(err);
    }
  };

  const handleEditPage = (pageId: string) => {
    navigate(`/page-builder/${userId}/${pageId}`);
  };

  // Render user details if admin and user details exist
  const renderUserDetails = () => {
    if (!user || user.role !== 'admin' || !userDetails) return null;

    return (
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Viewing pages for: <span className="font-semibold text-gray-800 dark:text-white">{userDetails.username}</span>
        </p>
      </div>
    );
  };

  return (
    <>
      {/* <Breadcrumb pageName="Pages" /> */}

      <div className="container mx-auto px-4 py-8">
        {renderUserDetails()}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {user?.role === 'admin' && userDetails 
              ? `${userDetails.username}'s Pages` 
              : 'My Pages'}
          </h2>
          <Link
            to={`/page-builder/${userId}/new`}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Create New Page</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        ) : pages.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You haven't created any pages yet. Start by creating your first page!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div 
                key={page.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {page.title}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPage(page.id)}
                        className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors duration-200"
                        title="Edit Page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors duration-200"
                        title="Delete Page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {page.blocks.length} blocks
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Pages;
