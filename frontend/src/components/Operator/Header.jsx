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


  // Format date and time exactly like in image: "25 Sep 2025, 12:48 am"
  const formatDateTime = () => {
    const now = currentDateTime;
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month} ${year}, ${hours}:${minutesStr} ${ampm}`;
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
      return role || 'operator';
    } catch (error) {
      return 'operator';
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

      {/* Header exactly matching the image with proper spacing */}
      <header 
        className="bg-white border-b border-gray-200 px-6 py-4"
        style={{
          marginLeft: !isMobile ? (isCollapsed ? '4rem' : '18rem') : '0',
          width: !isMobile ? (isCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 18rem)') : '100%'
        }}
      >
        <div className="flex justify-between items-center">
          {/* Left side - Clock icon and Date Time */}
          <div className="flex items-center gap-3">
            {/* Clock Icon */}
            <div className="flex items-center justify-center w-6 h-6">
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-0.5 bg-gray-400 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            
            {/* Date Time Text */}
            <span className="text-sm text-gray-600 font-medium">
              {formatDateTime()}
            </span>
          </div>

          {/* Right side - User Info with reduced spacing */}
          <div className="flex items-center gap-2">
            {/* User Icon */}

            {/* <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
              <FaUser className="w-4 h-4 text-gray-600" />
            </div> */}
            
            {/* User Name and Email - Reduced gap */}
            {/* <div className="flex flex-col">
            <div className="flex">
 <span className="text-sm font-medium text-gray-900">
                {user?.name || 'sahil'}
              </span>

               <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded  font-medium">
              {typeof user?.role === 'object' ? user.role.name : userRole}
            </span>
              <span className="text-xs text-gray-500">
                {user?.email || 'sahil@gmail.com'}
              </span>
            </div>
             
            </div> */}
          <div className="flex flex-col">
  {/* User Name & Role */}
  <div className="flex items-center">
    <FaUser className="w-4 h-4 mr-2 text-gray-600" />
    <span className="text-sm font-medium text-gray-900">
      {user?.name}
    </span>
    <span className="ml-2 px-2 py-0.5 border text-black text-xs rounded font-medium">
      {typeof user?.role === "object" ? user.role.name : userRole}
    </span>
  </div>

  {/* User Email */}
  <div>
    <span className="text-xs text-gray-500">
      {user?.email || "sahil@gmail.com"}
    </span>
  </div>
</div>

            {/* Role Badge - Reduced gap */}
           

            {/* Refresh Icon */}
            <button
              onClick={handleRefresh}
              className="ml-3 p-2 text-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <FaSync className="w-4 h-4" />
            </button>

            {/* Logout Icon */}
            <button 
              className={`p-2  text-red-600 transition-colors rounded-lg hover:bg-gray-100 ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Logout"
            >
              <FaSignOutAlt className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
