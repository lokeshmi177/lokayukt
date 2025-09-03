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
import Login from './components/Login';  // <-- login component import
import AddUserManagement from './components/AddUserManagement';

function App() {
  return (
    <Routes>
      {/* Root / pe login page */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Layout ke andar wale routes */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="progress-register" element={<ProgressRegister />} />
        <Route path="search-reports" element={<SearchReports />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="user-management/add" element={<AddUserManagement />} />
        <Route path="master-data" element={<MasterData />} />
      </Route>
    </Routes>
  );
}

export default App;
