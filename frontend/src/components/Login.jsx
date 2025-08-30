// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
      
      {/* CSS Variable for dynamic margin */}
      <style jsx>{`
        :global(:root) {
          --sidebar-width: 288px;
        }
        :global(.sidebar-collapsed) {
          --sidebar-width: 80px;
        }
      `}</style>
    </div>
  );
};

export default Layout;
