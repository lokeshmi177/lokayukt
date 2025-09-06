// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Components
import AdminLayout from './components/Admin/Layout';
import AdminDashboard from './components/Admin/Dashboard';
import AdminComplaints from './components/Admin/Complaints';
import AdminProgressRegister from './components/Admin/ProgressRegister';
import AdminSearchReports from './components/Admin/SearchReports';
import AdminUserManagement from './components/Admin/UserManagement';
import AdminMasterData from './components/Admin/MasterData';
import AdminAddUserManagement from './components/Admin/AddUserManagement';

// // Operator Components
// import OperatorLayout from './components/Operator/Layout';
// import OperatorDashboard from './components/Operator/Dashboard';
// import OperatorComplaints from './components/Operator/Complaints';
// import OperatorProgressRegister from './components/Operator/ProgressRegister';
// import OperatorSearchReports from './components/Operator/SearchReports';
// import OperatorUserManagement from './components/Operator/UserManagement';
// import OperatorMasterData from './components/Operator/MasterData';
// import OperatorAddUserManagement from './components/Operator/AddUserManagement';

import Login from './components/Login';

function App() {
  const role = localStorage.getItem("role");
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes - केवल admin role के लिए */}
      {role === "admin" && (
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      )}
      
      {role === "admin" && (
        <>
          <Route path="/complaints" element={<AdminLayout />}>
            <Route index element={<AdminComplaints />} />
          </Route>
          <Route path="/progress-register" element={<AdminLayout />}>
            <Route index element={<AdminProgressRegister />} />
          </Route>
          <Route path="/search-reports" element={<AdminLayout />}>
            <Route index element={<AdminSearchReports />} />
          </Route>
          <Route path="/user-management" element={<AdminLayout />}>
            <Route index element={<AdminUserManagement />} />
          </Route>
          <Route path="/user-management/add" element={<AdminLayout />}>
            <Route index element={<AdminAddUserManagement />} />
          </Route>
          <Route path="/master-data" element={<AdminLayout />}>
            <Route index element={<AdminMasterData />} />
          </Route>
        </>
      )}

      {/* Operator Routes - केवल oprter role के लिए */}
      {/* {role === "oprter" && (
        <Route path="/dashboard" element={<OperatorLayout />}>
          <Route index element={<OperatorDashboard />} />
        </Route>
      )}
      
      {role === "oprter" && (
        <>
          <Route path="/complaints" element={<OperatorLayout />}>
            <Route index element={<OperatorComplaints />} />
          </Route>
          <Route path="/progress-register" element={<OperatorLayout />}>
            <Route index element={<OperatorProgressRegister />} />
          </Route>
          <Route path="/search-reports" element={<OperatorLayout />}>
            <Route index element={<OperatorSearchReports />} />
          </Route>
          <Route path="/user-management" element={<OperatorLayout />}>
            <Route index element={<OperatorUserManagement />} />
          </Route>
          <Route path="/user-management/add" element={<OperatorLayout />}>
            <Route index element={<OperatorAddUserManagement />} />
          </Route>
          <Route path="/master-data" element={<OperatorLayout />}>
            <Route index element={<OperatorMasterData />} />
          </Route>
        </>
      )} */}

      {/* Default redirect for unauthorized access */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
