// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaSync, FaBars} from 'react-icons/fa';
import { RxExit } from "react-icons/rx";

const Header = ({ toggleMobileMenu, toggleSidebar, isCollapsed }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

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

  // Format date and time exactly like in image
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

  return (
    <header 
      className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 transition-all duration-300"
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
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <FaBars className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
            
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            <span>{formatDateTime()}</span>
          </div>
        </div>

        {/* Right side - User Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">श्री राजेश कुमार</span>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs">rajesh.kumar@lokayukta.mp.gov.in</span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                <FaSync className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                <RxExit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;