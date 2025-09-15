// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './components/Admin/Layout';
import AdminDashboard from './components/Admin/Dashboard';
import AdminComplaints from './components/Admin/Complaints';
import AdminProgressRegister from './components/Admin/ProgressRegister';
import AdminSearchReports from './components/Admin/SearchReports';
import AdminUserManagement from './components/Admin/UserManagement';
import AdminMasterData from './components/Admin/MasterData';
import AdminAddUserManagement from './components/Admin/AddUserManagement';
import AdminEditUserManagment from './components/Admin/EditUserManagment';
import AdminViewComplaints from './components/Admin/ViewComplaints';

import OperatorLayout from './components/Operator/Layout';
import OperatorDashboard from './components/Operator/Dashboard';
import OperatorComplaints from './components/Operator/Complaints';
import OperatorProgressRegister from './components/Operator/ProgressRegister';
import OperatorSearchReports from './components/Operator/SearchReports';
import OperatorViewComplaints from './components/Operator/ViewComplaints';
import OperatorEditComplaints from './components/Operator/EditComplaints';
import OperatorAllComplaits from './components/Operator/AllComplaits';
// import OperatorAllComplaits from './components/Operator/AllComplaits';
import OperatorPendingComplaints from './components/Operator/PendingComplaints/';
import OperatorApprovedComplaints from './components/Operator/ApprovedComplaints';
// import Cheekdublicate from './components/Operator/Cheekdublicate';


import SupervisorLayout from './components/Supervisor/Layout';
import SupervisorDashboard from './components/Supervisor/Dashboard';
import SupervisorComplaints from './components/Supervisor/Complaints';
import SupervisorProgressRegister from './components/Supervisor/ProgressRegister';
import SupervisorSearchReports from './components/Supervisor/SearchReports';

// import SupervisorViewComplaints from './components/Supervisor/ViewComplaints';
// import SupervisorEditComplaints from './components/Supervisor/EditComplaints';


import Login from './components/Login';

function App() {
  const role = localStorage.getItem("role");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Admin Routes - /admin/... */}
      {role === 'admin' && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="search-reports/view/:id" element={<AdminViewComplaints />} />
          <Route path="progress-register" element={<AdminProgressRegister />} />
          <Route path="search-reports" element={<AdminSearchReports />} />
          <Route path="user-management" element={<AdminUserManagement />} />
          <Route path="user-management/add" element={<AdminAddUserManagement />} />
          <Route path="user-management/edit/:id" element={<AdminEditUserManagment />} />
          <Route path="master-data" element={<AdminMasterData />} />
        </Route>
      )}

      {/* ✅ Operator Routes - /operator/... */}
      {role === 'operator' && (
        <Route path="/operator" element={<OperatorLayout />}>
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="complaints" element={<OperatorComplaints />} />
          <Route path="progress-register" element={<OperatorProgressRegister />} />
          <Route path="search-reports" element={<OperatorSearchReports />} />
          <Route path="search-reports/view/:id" element={<OperatorViewComplaints />} />
             <Route path="search-reports/edit/:id" element={<OperatorEditComplaints />} />
             <Route path="all-complaints" element={<OperatorAllComplaits />} />
             <Route path="pending-complaints" element={<OperatorPendingComplaints />} />
             <Route path="approved-complaints" element={<OperatorApprovedComplaints />} />
             {/* <Route path="/operator/complaints/Cheekdublicate" element={<Cheekdublicate />} /> */}

        </Route>
      )}
      
      {role === 'supervisor' && (
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="complaints" element={<SupervisorComplaints />} />
          <Route path="progress-register" element={<SupervisorProgressRegister />} />
          <Route path="search-reports" element={<SupervisorSearchReports />} />
         
        </Route>
      )}

      {/* Default redirect */}
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
}

export default App;
