// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaSync, FaBars, FaUser, FaEnvelope, FaPhone, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const Header = ({ toggleMobileMenu, toggleSidebar, isCollapsed }) => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Create axios instance with token
  const getApiInstance = () => {
    const token = localStorage.getItem("access_token");
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDateTime = () => {
    const now = currentDateTime;
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${day} ${month} ${year}, ${time}`;
  };

  // Logout function with API call
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const api = getApiInstance();
      const response = await api.post('/logout');

      if (response.data.status === 'success') {
        toast.success('Logout Successfully');
        
        setTimeout(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('role'); 
          window.open("/login", "_self");
        }, 1500);
       
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error during logout. Please try again.');
      }
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1500);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ✅ Safe user data parsing with error handling
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      return null;
    }
  };

  // ✅ Safe role parsing from localStorage
  const getUserRole = () => {
    try {
      const role = localStorage.getItem('role');
      return role || 'Supervisor';
    } catch (error) {
      return 'Supervisor';
    }
  };

  const user = getUserData();
  const userRole = getUserRole();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <header 
        className="bg-white border-b border-gray-200 px-4 sm:px-6 transition-all duration-300 sm:py-5 md:py-5 lg:py-5 py-3"
        style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '18rem') : '0',
          width: !isMobile ? (isCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 18rem)') : '100%'
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          {/* Left side - Mobile menu button, Date & Time with orange dot */}
          <div className="flex items-center gap-3">
            {isMobile ? (
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 sm:hidden md:hidden lg:hidden hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 sm:hidden md:hidden lg:hidden hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              <span className="font-medium">{formatDateTime()}</span>
            </div>
          </div>

          {/* Right side - Simple User Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
            {/* User Name and Role */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {user?.name || 'Relief Commissioner'}
              </span>
              {/* ✅ Fixed: Safe role rendering */}
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded font-medium">
                {typeof user?.role === 'object' ? user.role.name : userRole}
              </span>
            </div>

            {/* Contact Info and Actions */}
            <div className="flex items-center gap-3">
              {/* Email */}
              <p
                href={`mailto:${user?.email || 'test@gmail.com'}`}
                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                title="Send Email"
              >
                <FaEnvelope className="w-3 h-3" />
                <span className="hidden sm:inline">{user?.email || 'test@gmail.com'}</span>
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  className={`p-1.5 text-gray-500 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100 flex items-center gap-1 ${
                    isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Logout"
                >
                  <FaSignOutAlt className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                  <span className="text-xs hidden sm:inline">
                    {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
