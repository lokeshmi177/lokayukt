// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaSearch,
  FaUsers,
  FaDatabase,
  FaBell,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ onToggle }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close mobile menu when switching to desktop
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Function to check if current route is active
  const isActive = (href) => {
    if (href === '/dashboard' || href === '/') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Toggle sidebar collapse (desktop only)
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) {
      onToggle(!isCollapsed);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when clicking link
  const handleLinkClick = () => {
    if (isMobile) {
      closeMobileMenu();
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && !mobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-[60] p-3 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        >
          <FaBars className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Close Button */}
      {isMobile && mobileMenuOpen && (
        <button
          onClick={closeMobileMenu}
          className="fixed top-4 left-4 z-[60] p-3 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Full Height from Top */}
      <div
        className={`fixed left-0 top-0 h-full min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-xl transition-all duration-300 flex flex-col z-30 ${
          isMobile
            ? `w-72 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `${isCollapsed ? 'w-16' : 'w-72'}`
        }`}
      >
        
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`absolute bg-white text-slate-600 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 z-10 ${
              isCollapsed 
                ? '-right-3 top-6 p-2' 
                : '-right-4 top-6 p-3'
            }`}
          >
            {isCollapsed ? (
              <FaChevronRight className="w-4 h-4" />
            ) : (
              <FaChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Header Section */}
        <div className={`border-b border-slate-700 transition-all duration-300 flex-shrink-0 ${
          (!isMobile && isCollapsed) ? 'p-3' : 'p-6'
        }`}>
          {/* Logo */}
          <div className={`flex items-center mb-4 transition-all duration-300 ${
            (!isMobile && isCollapsed) ? 'justify-center gap-0' : 'gap-3'
          }`}>
            <div className={`transition-all duration-300 ${
              (!isMobile && isCollapsed) ? 'text-2xl' : 'text-3xl'
            }`}>⚖️</div>
            {(isMobile || !isCollapsed) && (
              <div className="transition-all duration-300">
                <h3 className="text-xl font-bold text-white">LokAyukta</h3>
                <h4 className="text-lg font-semibold text-slate-200">CRMS</h4>
                <span className="text-xs text-slate-400">Complaint Management</span>
              </div>
            )}
          </div>
          
          {/* Admin Badge */}
          {(isMobile || !isCollapsed) && (
            <div className="mb-3 transition-all duration-300">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Admin
              </span>
            </div>
          )}
          
          {/* Header Actions */}
          {(isMobile || !isCollapsed) && (
            <div className="flex gap-2 transition-all duration-300">
              <button className="flex items-center gap-1 px-2 py-1 border border-slate-600 rounded text-xs hover:bg-slate-700 transition-colors">
                <FaGlobe className="w-3 h-3" />
                हि
              </button>
              <button className="relative flex items-center px-2 py-1 border border-slate-600 rounded text-xs hover:bg-slate-700 transition-colors">
                <FaBell className="w-3 h-3" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              </button>
            </div>
          )}
          
          {/* Collapsed Header Actions */}
          {!isMobile && isCollapsed && (
            <div className="flex flex-col gap-2 items-center transition-all duration-300">
              <button className="p-1.5 border border-slate-600 rounded hover:bg-slate-700 transition-colors">
                <FaGlobe className="w-3 h-3" />
              </button>
              <button className="relative p-1.5 border border-slate-600 rounded hover:bg-slate-700 transition-colors">
                <FaBell className="w-3 h-3" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className={`flex-1 transition-all duration-300 overflow-y-auto ${
          (!isMobile && isCollapsed) ? 'py-4' : 'py-6'
        }`}>
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } ${
                  (!isMobile && isCollapsed)
                    ? 'justify-center px-2 py-3 mx-2 rounded-lg' 
                    : 'gap-3 px-6 py-3 rounded-r-3xl mr-5'
                }`}
                title={(!isMobile && isCollapsed) ? 'Dashboard' : ''}
              >
                <FaHome className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && <span className="transition-all duration-300">Dashboard</span>}
              </Link>
            </li>

            {/* Complaints */}
            <li>
              <Link
                to="/complaints"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive('/complaints')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } ${
                  (!isMobile && isCollapsed)
                    ? 'justify-center px-2 py-3 mx-2 rounded-lg' 
                    : 'gap-3 px-6 py-3 rounded-r-3xl mr-5'
                }`}
                title={(!isMobile && isCollapsed) ? 'Complaints' : ''}
              >
                <FaFileAlt className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && <span className="transition-all duration-300">Complaints</span>}
              </Link>
            </li>

            {/* Progress Register */}
            <li>
              <Link
                to="/Progress-register"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive('/Progress-register')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } ${
                  (!isMobile && isCollapsed)
                    ? 'justify-center px-2 py-3 mx-2 rounded-lg' 
                    : 'gap-3 px-6 py-3 rounded-r-3xl mr-5'
                }`}
                title={(!isMobile && isCollapsed) ? 'Progress Register' : ''}
              >
                <FaChartBar className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && <span className="transition-all duration-300">Progress Register</span>}
              </Link>
            </li>

            {/* Search & Reports */}
            <li>
              <Link
                to="/search-reports"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive('/search-reports')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } ${
                  (!isMobile && isCollapsed)
                    ? 'justify-center px-2 py-3 mx-2 rounded-lg' 
                    : 'gap-3 px-6 py-3 rounded-r-3xl mr-5'
                }`}
                title={(!isMobile && isCollapsed) ? 'Search & Reports' : ''}
              >
                <FaSearch className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && <span className="transition-all duration-300">Search & Reports</span>}
              </Link>
            </li>

            {/* User Management */}
            <li>
              <Link
                to="/user-management"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive('/user-management')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } ${
                  (!isMobile && isCollapsed)
                    ? 'justify-center px-2 py-3 mx-2 rounded-lg' 
                    : 'gap-3 px-6 py-3 rounded-r-3xl mr-5'
                }`}
                title={(!isMobile && isCollapsed) ? 'User Management' : ''}
              >
                <FaUsers className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && <span className="transition-all duration-300">User Management</span>}
              </Link>
            </li>

            {/* Master Data */}
            <li>
              <Link
                to="/master-data"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive('/master-data')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                } ${
                  (!isMobile && isCollapsed)
                    ? 'justify-center px-2 py-3 mx-2 rounded-lg' 
                    : 'gap-3 px-6 py-3 rounded-r-3xl mr-5'
                }`}
                title={(!isMobile && isCollapsed) ? 'Master Data' : ''}
              >
                <FaDatabase className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && <span className="transition-all duration-300">Master Data</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        {(isMobile || !isCollapsed) && (
          <div className="p-6 border-t border-slate-700 text-center transition-all duration-300 flex-shrink-0 mt-auto">
            <p className="text-xs text-slate-400">© 2025 LokAyukta Office</p>
            <p className="text-xs text-slate-500">v1.0.0</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
