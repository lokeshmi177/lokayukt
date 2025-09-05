// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/Admin/Layout';
import AdminDashboard from './components/Admin/Dashboard';
import AdminComplaints from './components/Admin/Complaints';
import AdminProgressRegister from './components/Admin/ProgressRegister';
import AdminSearchReports from './components/Admin/SearchReports';
import AdminUserManagement from './components/Admin/UserManagement';
import AdminMasterData from './components/Admin/MasterData';
import AdminAddUserManagement from './components/Admin/AddUserManagement';
import Login from './components/Login';  // 

function App() {
    // const roleId = localStorage.getItem("roleId");
  return (
    <Routes>
      {/* Root / pe login page */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />


 {/* {roleId === "1" && (

   )} */}
      
      {/* Admin */}
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="progress-register" element={<AdminProgressRegister />} />
        <Route path="search-reports" element={<AdminSearchReports />} />
        <Route path="user-management" element={<AdminUserManagement />} />
        <Route path="user-management/add" element={<AdminAddUserManagement />} />
        <Route path="master-data" element={<AdminMasterData />} />
      </Route>
      

       {/* Operator */}
      {/* <Route path="/" element={<OperatorLayout />}>
        <Route path="dashboard" element={<OperatorDashboard />} />
        <Route path="complaints" element={<OperatorComplaints />} />
        <Route path="progress-register" element={<OperatorProgressRegister />} />
        <Route path="search-reports" element={<OperatorSearchReports />} />
        <Route path="user-management" element={<OperatorUserManagement />} />
        <Route path="user-management/add" element={<OperatorAddUserManagement />} />
        <Route path="master-data" element={<OperatorMasterData />} />
      </Route> */}
    </Routes>
  );
}

export default App;
