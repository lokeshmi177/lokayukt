// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  FaTimes,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const Sidebar = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  // Simple translation object with updated route names
  const translations = {
    english: {
      title: "LokAyukta",
      subtitle: "CRMS",
      description: "Complaint Management",
      supervisor: "supervisor",
      dashboard: "Dashboard",
      complaints: "New Complaints",
      allComplaints: "All Complaints",
      // pendingComplaints: "Pending Complaints",
      // approvedComplaints: "Approved Complaints",
      progressRegister: "Progress Register",
      searchReports: "Search & Reports",
      userManagement: "User Management",
      masterData: "Master Data",
      copyright: "© 2025 LokAyukta Office",
      version: "v1.0.0",
    },
    hindi: {
      title: "लोकायुक्त",
      subtitle: "CRMS",
      description: "शिकायत प्रबंधन",
      supervisor: "व्यवस्थापक",
      dashboard: "डैशबोर्ड",
      complaints: "शिकायतें",
      allComplaints: "सभी शिकायतें",
      // pendingComplaints: "लंबित शिकायतें",
      // approvedComplaints: "स्वीकृत शिकायतें",
      progressRegister: "प्रगति रजिस्टर",
      searchReports: "खोज और रिपोर्ट",
      userManagement: "उपयोगकर्ता प्रबंधन",
      masterData: "मुख्य डेटा",
      copyright: "© 2025 लोकायुक्त कार्यालय",
      version: "v1.0.0",
    },
  };

  // Get current translations
  const t = isHindi ? translations.hindi : translations.english;

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Toggle language function
  const toggleLanguage = () => {
    setIsHindi(!isHindi);
  };

  // ✅ Simple isActive function for supervisor routes
  const isActive = (href) => {
    const fullPath = `/supervisor${href}`;

    if (href === "/dashboard") {
      return location.pathname === fullPath;
    }
    return location.pathname.startsWith(fullPath);
  };

  // Close mobile menu when clicking link
  const handleLinkClick = () => {
    if (isMobile) {
      toggleMobileMenu();
    }
  };

  // Custom Scrollbar CSS
  const scrollbarStyles = `
    .sidebar-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb {
      background-color: #475569;
      border-radius: 10px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #64748b;
    }
    /* For Firefox */
    .sidebar-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #475569 transparent;
    }
  `;

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style>{scrollbarStyles}</style>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-xl transition-all duration-300 flex flex-col z-40 ${
          isMobile
            ? `w-72 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${isCollapsed ? "w-16" : "w-72"}`
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && isMobileMenuOpen && (
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 p-2 text-white hover:bg-slate-700 rounded-lg transition-colors z-50"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`absolute bg-white text-slate-600 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 z-10 ${
              isCollapsed ? "-right-3 top-6 p-2" : "-right-4 top-6 p-3"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FaChevronRight className="w-4 h-4" />
            ) : (
              <FaChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Header Section */}
        <div
          className={`border-b border-slate-700 transition-all duration-300 flex-shrink-0 ${
            !isMobile && isCollapsed ? "p-3" : "p-6"
          }`}
        >
          {/* Logo */}
          <div
            className={`flex items-center mb-4 transition-all duration-300 ${
              !isMobile && isCollapsed ? "justify-center gap-0" : "gap-3"
            }`}
          >
            <div
              className={`transition-all duration-300 ${
                !isMobile && isCollapsed ? "text-2xl" : "text-3xl"
              }`}
            >
              ⚖️
            </div>
            {(isMobile || !isCollapsed) && (
              <div className="transition-all duration-300">
                <h3 className="text-xl font-bold text-white">{t.title}</h3>
                <h4 className="text-lg font-semibold text-slate-200">
                  {t.subtitle}
                </h4>
                <span className="text-xs text-slate-400">{t.description}</span>
              </div>
            )}
          </div>

          {/* ✅ supervisor Badge (Fixed) */}
          {(isMobile || !isCollapsed) && (
            <div className="mb-3 transition-all duration-300">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                {t.supervisor}
              </span>
            </div>
          )}

          {/* Header Actions */}
          {(isMobile || !isCollapsed) && (
            <div className="flex gap-2 transition-all duration-300">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1 border border-slate-600 rounded text-xs hover:bg-slate-700 transition-colors"
              >
                <FaGlobe className="w-3 h-3" />
                {isHindi ? "EN" : "हि"}
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
              <button
                onClick={toggleLanguage}
                className="p-1.5 border border-slate-600 rounded hover:bg-slate-700 transition-colors"
              >
                <FaGlobe className="w-3 h-3" />
              </button>
              <button className="relative p-1.5 border border-slate-600 rounded hover:bg-slate-700 transition-colors">
                <FaBell className="w-3 h-3" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              </button>
            </div>
          )}
        </div>

        {/* ✅ Navigation Menu - Updated with sidebar-scrollbar */}
        <nav
          className={`flex-1 transition-all duration-300 overflow-y-auto sidebar-scrollbar ${
            !isMobile && isCollapsed ? "py-4" : "py-6"
          }`}
        >
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                to="/supervisor/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.dashboard : ""}
              >
                <FaHome className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.dashboard}
                  </span>
                )}
              </Link>
            </li>

            {/* Complaints */}
            <li>
              <Link
                to="/supervisor/complaints"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/complaints")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.complaints : ""}
              >
                <FaFileAlt className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.complaints}
                  </span>
                )}
              </Link>
            </li>

            {/* All Complaints */}
            <li>
              <Link
                to="/supervisor/all-complaints"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/all-complaints")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.allComplaints : ""}
              >
                <FaFileAlt className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.allComplaints}
                  </span>
                )}
              </Link>
            </li>

            {/* ✅ UPDATED: Pending Complaints */}
            {/* <li>
              <Link
                to="/supervisor/pending-complaints"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/pending")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.pendingComplaints : ""}
              >
                <FaClock className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.pendingComplaints}
                  </span>
                )}
              </Link>
            </li> */}

            {/* ✅ UPDATED: Approved Complaints */}
            {/* <li>
              <Link
                to="/supervisor/approved-complaints"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/approved")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.approvedComplaints : ""}
              >
                <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.approvedComplaints}
                  </span>
                )}
              </Link>
            </li> */}

            {/* Progress Register */}
            <li>
              <Link
                to="/supervisor/progress-register"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/progress-register")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.progressRegister : ""}
              >
                <FaChartBar className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.progressRegister}
                  </span>
                )}
              </Link>
            </li>

            {/* Search & Reports */}
            <li>
              <Link
                to="/supervisor/search-reports"
                onClick={handleLinkClick}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isActive("/search-reports")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                } ${
                  !isMobile && isCollapsed
                    ? "justify-center px-2 py-3 mx-2 rounded-lg"
                    : "gap-3 px-6 py-3 rounded-r-3xl mr-5"
                }`}
                title={!isMobile && isCollapsed ? t.searchReports : ""}
              >
                <FaSearch className="w-5 h-5 flex-shrink-0" />
                {(isMobile || !isCollapsed) && (
                  <span className="transition-all duration-300">
                    {t.searchReports}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        {(isMobile || !isCollapsed) && (
          <div className="p-6 border-t border-slate-700 text-center transition-all duration-300 flex-shrink-0 mt-auto">
            <p className="text-xs text-slate-400">{t.copyright}</p>
            <p className="text-xs text-slate-500">{t.version}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
