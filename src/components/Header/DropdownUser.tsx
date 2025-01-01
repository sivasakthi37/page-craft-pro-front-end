import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../AuthContext';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user?.username || 'User'}
          </span>
          <span className="block text-xs">{user?.email || 'Role'}</span>
        </span>

        <span className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <FaUser className="text-gray-500 dark:text-gray-300 text-2xl" />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499C8.42189 9.62499 6.35938 7.56248 6.35938 4.98436C6.35938 2.40623 8.42189 0.343723 11 0.343723C13.5781 0.343723 15.6406 2.40623 15.6406 4.98436C15.6406 7.56248 13.5781 9.62499 11 9.62499ZM11 2.15936C9.28438 2.15936 7.875 3.56873 7.875 5.28436C7.875 6.99999 9.28438 8.40936 11 8.40936C12.7156 8.40936 14.125 6.99999 14.125 5.28436C14.125 3.56873 12.7156 2.15936 11 2.15936Z"
                    fill=""
                  />
                  <path
                    d="M17.7719 21.4953H4.23438C3.44688 21.4953 2.70625 21.1641 2.175 20.5641C1.64375 19.9641 1.40625 19.1484 1.47188 18.3094C1.68438 15.8172 3.56246 13.8891 5.98438 13.8891H16.0156C18.4375 13.8891 20.3156 15.8172 20.5281 18.3094C20.5938 19.1484 20.3563 19.9641 19.825 20.5641C19.2937 21.1641 18.5531 21.4953 17.7656 21.4953H17.7719ZM5.98438 15.1141C4.40625 15.1141 3.09375 16.2516 2.975 17.8297C2.93437 18.3422 3.09375 18.8109 3.4125 19.1859C3.73125 19.5609 4.18438 19.7734 4.69688 19.7734H17.7656C18.2781 19.7734 18.7313 19.5609 19.05 19.1859C19.3688 18.8109 19.5281 18.3422 19.4875 17.8297C19.3688 16.2516 18.0562 15.1141 16.4781 15.1141H5.98438Z"
                    fill=""
                  />
                </svg>
                My Profile
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5375 0.618744H11.6531C10.025 0.618744 8.77502 1.99374 8.77502 3.69374V6.54374H11.8125V3.77499C11.8125 3.36874 12.1625 2.98749 12.5688 2.98749H15.5375C15.9438 2.98749 16.2937 3.36874 16.2937 3.77499V18.2125C16.2937 18.6188 15.9437 18.9688 15.5375 18.9688H11.8125V21.3688H15.5375C17.2156 21.3688 18.4625 20.0125 18.4625 18.2125V3.77499C18.4625 1.99374 17.2156 0.618744 15.5375 0.618744Z"
                fill=""
              />
              <path
                d="M10.1906 8.38249L7.38436 5.57624L4.57811 8.38249C4.30061 8.65999 4.30061 9.08687 4.57811 9.36437C4.85561 9.64187 5.28248 9.64187 5.55998 9.36437L7.08123 7.84312V14.8906C7.08123 15.2406 7.35873 15.5181 7.70873 15.5181C8.05873 15.5181 8.33623 15.2406 8.33623 14.8906V7.84312L9.85748 9.36437C10.0131 9.51999 10.2131 9.59999 10.4131 9.59999C10.6131 9.59999 10.8131 9.51999 10.9687 9.36437C11.2462 9.08687 11.2462 8.65999 10.9687 8.38249L8.16248 5.57624L10.9687 2.76999C11.2462 2.49249 11.2462 2.06562 10.9687 1.78812C10.6912 1.51062 10.2643 1.51062 9.98686 1.78812L7.08123 4.69374L4.17561 1.78812C3.89811 1.51062 3.47123 1.51062 3.19373 1.78812C2.91623 2.06562 2.91623 2.49249 3.19373 2.76999L5.99998 5.57624L3.19373 8.38249C2.91623 8.65999 2.91623 9.08687 3.19373 9.36437C3.47123 9.64187 3.89811 9.64187 4.17561 9.36437L6.69686 6.84312V14.8906C6.69686 15.2406 6.97436 15.5181 7.32436 15.5181C7.67436 15.5181 7.95186 15.2406 7.95186 14.8906V6.84312L9.47311 8.36437C9.62873 8.51999 9.82873 8.59999 10.0287 8.59999C10.2287 8.59999 10.4287 8.51999 10.5843 8.36437C10.8618 8.08687 10.8618 7.65999 10.5843 8.38249Z"
                fill=""
              />
            </svg>
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
