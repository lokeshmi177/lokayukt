// components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Import separate Header
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Full Height from Top */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main Content Area with Header */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          window.innerWidth >= 768 
            ? sidebarCollapsed 
              ? 'ml-16' 
              : 'ml-72'
            : 'ml-0'
        }`}
      >
        {/* Header - Only in Content Area */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
