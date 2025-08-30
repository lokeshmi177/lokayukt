// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Complaints from './components/Complaints';
import ProgressRegister from './components/ProgressRegister';
import SearchReports from './components/SearchReports';
import UserManagement from './components/UserManagement';
import MasterData from './components/MasterData';
// import Dashboard from './components/Dashboard';
// import Complaints from './pages/Complaints';
// import Progress from './pages/Progress';
// import Reports from './pages/Reports';
// import Users from './pages/Users';
// import MasterData from './pages/MasterData';

function App() {
  return (
   
      <Routes>
        {/* Main Layout Route with Outlet */}
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/Progress-register" element={<ProgressRegister />} />
          <Route path="/search-reports" element={<SearchReports />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/master-data" element={<MasterData />} />
    
        </Route>
      </Routes>
   
  );
}

export default App;
