// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin
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

// Operator
import OperatorLayout from './components/Operator/Layout';
import OperatorDashboard from './components/Operator/Dashboard';
import OperatorComplaints from './components/Operator/Complaints';
import OperatorProgressRegister from './components/Operator/ProgressRegister';
import OperatorSearchReports from './components/Operator/SearchReports';
import OperatorViewComplaints from './components/Operator/ViewComplaints';
import OperatorEditComplaints from './components/Operator/EditComplaints';
import OperatorAllComplaits from './components/Operator/AllComplaits';
import OperatorPendingComplaints from './components/Operator/PendingComplaints/';
import OperatorApprovedComplaints from './components/Operator/ApprovedComplaints';

// Supervisor
import SupervisorLayout from './components/Supervisor/Layout';
import SupervisorDashboard from './components/Supervisor/Dashboard';
import SupervisorComplaints from './components/Supervisor/Complaints';
import SupervisorProgressRegister from './components/Supervisor/ProgressRegister';
import SupervisorSearchReports from './components/Supervisor/SearchReports';

//Lok-ayukt
import LokayuktLayout from './components/Supervisor/Layout';
import LokayuktDashboard from './components/Supervisor/Dashboard';
import LokayuktComplaints from './components/Supervisor/Complaints';
import LokayuktProgressRegister from './components/Supervisor/ProgressRegister';
import LokayuktSearchReports from './components/Supervisor/SearchReports';

//Uplokayukt
import UplokayuktLayout from './components/Supervisor/Layout';
import UplokayuktDashboard from './components/Supervisor/Dashboard';
import UplokayuktComplaints from './components/Supervisor/Complaints';
import UplokayuktProgressRegister from './components/Supervisor/ProgressRegister';
import UplokayuktSearchReports from './components/Supervisor/SearchReports';


import Login from './components/Login';

function App() {
  const role = localStorage.getItem("role");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/*  Admin Routes */}
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

      {/*  Operator Routes */}
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
      
       {/* Supervisor  Routes */}
      {role === 'supervisor' && (
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="complaints" element={<SupervisorComplaints />} />
          <Route path="progress-register" element={<SupervisorProgressRegister />} />
          <Route path="search-reports" element={<SupervisorSearchReports />} />
         
        </Route>
      )}

        {/* Lok-ayukt  Routes */}
      {role === 'lok-ayukt' && (
        <Route path="/lok-ayukt" element={<LokayuktLayout />}>
          <Route path="dashboard" element={<LokayuktDashboard />} />
          <Route path="complaints" element={<LokayuktComplaints />} />
          <Route path="progress-register" element={<LokayuktProgressRegister />} />
          <Route path="search-reports" element={<LokayuktSearchReports />} />
         
        </Route>
      )}

        {/* UPLok-ayukt  Routes */}
      {role === 'uplokayukt' && (
        <Route path="/uplokayukt" element={<UplokayuktLayout />}>
          <Route path="dashboard" element={<UplokayuktDashboard />} />
          <Route path="complaints" element={<UplokayuktComplaints />} />
          <Route path="progress-register" element={<UplokayuktProgressRegister />} />
          <Route path="search-reports" element={<UplokayuktSearchReports />} />
         
        </Route>
      )}

    </Routes>
  );
}

export default App;
