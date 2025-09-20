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
import AdminEditComplaint from './components/Admin/EditComplaint';

// Operator
import OperatorLayout from './components/Operator/Layout';
import OperatorDashboard from './components/Operator/Dashboard';
import OperatorComplaints from './components/Operator/Complaints';
import OperatorProgressRegister from './components/Operator/ProgressRegister';
import OperatorSearchReports from './components/Operator/SearchReports';
import OperatorViewComplaints from './components/Operator/ViewComplaints';
import OperatorEditComplaints from './components/Operator/EditComplaints';
import OperatorAllComplaits from './components/Operator/All-complaints/AllComplaits';
import OperatorViewAllComplaint from './components/Operator/All-complaints/ViewAllComplaint';
import OperatorAllComplaintsEdit from './components/Operator/All-complaints/EditAllComplaints';
import OperatorApprovedComplaints from './components/Operator/Approved-complaints/ApprovedComplaints';
import OperatorViewApprovedComplaints from './components/Operator/Approved-complaints/ViewApprovedComplaints';
import OperatorEditApprovedCoplaints from './components/Operator/Approved-complaints/EditApprovedCoplaints';
import OperatorPendingComplaints from './components/Operator/Pending-complaints/PendingComplaints/';
import OperatorViewPendingComplaint from './components/Operator/Pending-complaints/ViewPendingComplaint';
import OperatorEditPendingComplaints from './components/Operator/Pending-complaints/EditPendingComplaints';



// Supervisor 
// SubRole -> so-us
import SupervisorLayout from './components/Supervisor/so-us/Layout';
import SupervisorDashboard from './components/Supervisor/so-us/Dashboard';
import SupervisorComplaints from './components/Supervisor/so-us/Complaints';
import SupervisorProgressRegister from './components/Supervisor/so-us/ProgressRegister';
import SupervisorSearchReports from './components/Supervisor/so-us/SearchReports';
import SupervisorViewComplaints from './components/Supervisor/so-us/ViewComplaints';
import SupervisorPendingComplaints from './components/Supervisor/so-us/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaints from './components/Supervisor/so-us/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaints from './components/Supervisor/so-us/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaints from './components/Supervisor/so-us/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaints from './components/Supervisor/so-us/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaints from './components/Supervisor/so-us/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaits from './components/Supervisor/so-us/All-complaints/AllComplaits';
import SupervisorViewAllComplaint from './components/Supervisor/so-us/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaints from './components/Supervisor/so-us/All-complaints/EditAllComplaints';

// Supervisor 
// SubRole -> ds-js
import SupervisorLayoutds from './components/Supervisor/ds-js/Layout';
import SupervisorDashboardds from './components/Supervisor/ds-js/Dashboard';
import SupervisorComplaintsds from './components/Supervisor/ds-js/Complaints';
import SupervisorProgressRegisterds from './components/Supervisor/ds-js/ProgressRegister';
import SupervisorSearchReportsds from './components/Supervisor/ds-js/SearchReports';
import SupervisorViewComplaintsds from './components/Supervisor/ds-js/ViewComplaints';
import SupervisorPendingComplaintsds from './components/Supervisor/ds-js/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsds from './components/Supervisor/ds-js/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsds from './components/Supervisor/ds-js/Pending-complaints/ViewPendingComplaints';


import SupervisorApprovedComplaintsds from './components/Supervisor/ds-js/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintds from './components/Supervisor/ds-js/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintds from './components/Supervisor/ds-js/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsds from './components/Supervisor/ds-js/All-complaints/AllComplaits';
import SupervisorViewAllComplaintds from './components/Supervisor/ds-js/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsds from './components/Supervisor/ds-js/All-complaints/EditAllComplaints';

// Supervisor 
// SubRole -> sec
import SupervisorLayoutsec from './components/Supervisor/sec/Layout';
import SupervisorDashboardsec from './components/Supervisor/sec/Dashboard';
import SupervisorComplaintssec from './components/Supervisor/sec/Complaints';
import SupervisorProgressRegistersec from './components/Supervisor/sec/ProgressRegister';
import SupervisorSearchReportssec from './components/Supervisor/sec/SearchReports';
import SupervisorViewComplaintssec from './components/Supervisor/sec/ViewComplaints';
import SupervisorPendingComplaintssec from './components/Supervisor/sec/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintssec from './components/Supervisor/sec/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintssec from './components/Supervisor/sec/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintssec from './components/Supervisor/sec/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintssec from './components/Supervisor/sec/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintssec from './components/Supervisor/sec/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitssec from './components/Supervisor/sec/All-complaints/AllComplaits';
import SupervisorViewAllComplaintsec from './components/Supervisor/sec/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintssec from './components/Supervisor/sec/All-complaints/EditAllComplaints';

// Supervisor 
// SubRole -> cio - io
import SupervisorLayoutcio from './components/Supervisor/cio-io/Layout';
import SupervisorDashboardcio from './components/Supervisor/cio-io/Dashboard';
import SupervisorComplaintscio from './components/Supervisor/cio-io/Complaints';
import SupervisorProgressRegistercio from './components/Supervisor/cio-io/ProgressRegister';
import SupervisorSearchReportscio from './components/Supervisor/cio-io/SearchReports';
import SupervisorViewComplaintscio from './components/Supervisor/cio-io/ViewComplaints';
// import SupervisorPendingComplaintscio from './components/Supervisors/cio-io/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintscio from './components/Supervisor/cio-io/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintscio from './components/Supervisor/cio-io/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintscio from './components/Supervisor/cio-io/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintscio from './components/Supervisor/cio-io/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintscio from './components/Supervisor/cio-io/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitscio from './components/Supervisor/cio-io/All-complaints/AllComplaits';
import SupervisorViewAllComplaintcio from './components/Supervisor/cio-io/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintscio from './components/Supervisor/cio-io/All-complaints/EditAllComplaints';

// Supervisor 
// SubRole -> dea-assis
import SupervisorLayoutdea from './components/Supervisor/so-us/Layout';
import SupervisorDashboarddea from './components/Supervisor/so-us/Dashboard';
import SupervisorComplaintsdea from './components/Supervisor/so-us/Complaints';
import SupervisorProgressRegisterdea from './components/Supervisor/so-us/ProgressRegister';
import SupervisorSearchReportsdea from './components/Supervisor/so-us/SearchReports';
import SupervisorViewComplaintsdea from './components/Supervisor/so-us/ViewComplaints';
import SupervisorPendingComplaintsdea from './components/Supervisor/so-us/Pending-complaints/PendingComplaints';
import SupervisorEditPendingComplaintsdea from './components/Supervisor/so-us/Pending-complaints/EditPendingComplaints';
import SupervisorViewPendingComplaintsdea from './components/Supervisor/so-us/Pending-complaints/ViewPendingComplaints';

import SupervisorApprovedComplaintsdea from './components/Supervisor/so-us/Approved-complaints/ApprovedComplaints';
import SupervisorViewApprovedComplaintsdea from './components/Supervisor/so-us/Approved-complaints/ViewApprovedComplaints';
import SupervisorEditApprovedComplaintsdea from './components/Supervisor/so-us/Approved-complaints/EditApprovedComplaints';

import SupervisorAllComplaitsdea from './components/Supervisor/so-us/All-complaints/AllComplaits';
import SupervisorViewAllComplaintdea from './components/Supervisor/so-us/All-complaints/ViewwAllComplaint';
import SupervisorEditComplaintsdea from './components/Supervisor/so-us/All-complaints/EditAllComplaints';

// //Lok-ayukt
// import LokayuktLayout from './components/Supervisor/Layout';
// import LokayuktDashboard from './components/Supervisor/Dashboard';
// import LokayuktComplaints from './components/Supervisor/Complaints';
// import LokayuktProgressRegister from './components/Supervisor/ProgressRegister';
// import LokayuktSearchReports from './components/Supervisor/SearchReports';

// //Uplokayukt
// import UplokayuktLayout from './components/Supervisor/Layout';
// import UplokayuktDashboard from './components/Supervisor/Dashboard';
// import UplokayuktComplaints from './components/Supervisor/Complaints';
// import UplokayuktProgressRegister from './components/Supervisor/ProgressRegister';
// import UplokayuktSearchReports from './components/Supervisor/SearchReports';


import Login from './components/Login';





function App() {
  const role = localStorage.getItem("role");
  const subrole = localStorage.getItem("subrole")

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
          <Route path="search-reports/edit/:id" element={<AdminEditComplaint />} />
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
             <Route path="approved-complaints/edit/:id" element={<OperatorEditApprovedCoplaints />} />
             <Route path="pending-complaints/edit/:id" element={<OperatorEditPendingComplaints />} />
             <Route path="all-complaints/edit/:id" element={<OperatorAllComplaintsEdit />} />
             <Route path="all-complaints" element={<OperatorAllComplaits />} />
            <Route path="all-complaints/view/:id" element={<OperatorViewAllComplaint />} />
            <Route path="pending-complaints/view/:id" element={<OperatorViewPendingComplaint />} />
            <Route path="approved-complaints/view/:id" element={<OperatorViewApprovedComplaints />} />
             <Route path="pending-complaints" element={<OperatorPendingComplaints />} />
             <Route path="approved-complaints" element={<OperatorApprovedComplaints />} />
             {/* <Route path="/operator/complaints/Cheekdublicate" element={<Cheekdublicate />} /> */}

        </Route>
      )}
      
       {/* Supervisor  Routes */}
       {/* so-us */}
      {role === 'supervisor' && subrole === 'so-us' &&(
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="complaints" element={<SupervisorComplaints />} />
          <Route path="progress-register" element={<SupervisorProgressRegister />} />
          <Route path="search-reports" element={<SupervisorSearchReports />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaints />} />

          <Route path="all-complaints" element={<SupervisorAllComplaits />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaint />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaints />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaints />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaints />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaints />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaints />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaints />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaints />} /> 
        </Route>
      )}


       {/* Supervisor  Routes */}
       {/* ds-js */}
      {role === 'supervisor' && subrole === 'ds-js' && (
        <Route path="/supervisor" element={<SupervisorLayoutds />}>
          <Route path="dashboard" element={<SupervisorDashboardds />} />
          <Route path="complaints" element={<SupervisorComplaintsds />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterds />} />
          <Route path="search-reports" element={<SupervisorSearchReportsds />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsds />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsds />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintds />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsds />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsds />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsds />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsds />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsds />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintds/>} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintds />} /> 
        </Route>
      )}


   {/* Supervisor  Routes */}
       {/* sec */}
       {role === 'supervisor' && subrole === 'sec' && (
        <Route path="/supervisor" element={<SupervisorLayoutsec />}>
          <Route path="dashboard" element={<SupervisorDashboardsec />} />
          <Route path="complaints" element={<SupervisorComplaintssec />} />
          <Route path="progress-register" element={<SupervisorProgressRegistersec />} />
          <Route path="search-reports" element={<SupervisorSearchReportssec />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintssec />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitssec />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintsec />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintssec />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintssec />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintssec />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintssec />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintssec />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintssec />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintssec />} /> 
        </Route>
      )}


   {/* Supervisor  Routes */}
       {/*cio-io*/}
      
     {role === 'supervisor' && subrole === 'cio-io' && (
        <Route path="/supervisor" element={<SupervisorLayoutcio />}>
          <Route path="dashboard" element={<SupervisorDashboardcio />} />
          <Route path="complaints" element={<SupervisorComplaintscio />} />
          <Route path="progress-register" element={<SupervisorProgressRegistercio />} />
          <Route path="search-reports" element={<SupervisorSearchReportscio />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintscio />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitscio />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintcio />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintscio />} />

          <Route path="pending-complaints" element={<cio />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintscio />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintscio />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintscio />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintscio />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintscio/>} /> 
        </Route>
      )} 


   {/* Supervisor  Routes */}
       {/* dea-assis*/}
    
     {role === 'supervisor' && subrole === 'dea-assis' && (
        <Route path="/supervisor" element={<SupervisorLayoutdea />}>
          <Route path="dashboard" element={<SupervisorDashboarddea />} />
          <Route path="complaints" element={<SupervisorComplaintsdea />} />
          <Route path="progress-register" element={<SupervisorProgressRegisterdea />} />
          <Route path="search-reports" element={<SupervisorSearchReportsdea />} />
          <Route path="search-reports/view/:id" element={<SupervisorViewComplaintsdea />} />

          <Route path="all-complaints" element={<SupervisorAllComplaitsdea />} />
          <Route path="all-complaints/view/:id" element={<SupervisorViewAllComplaintdea />} />
          <Route path="all-complaints/edit/:id" element={<SupervisorEditComplaintsdea />} />

          <Route path="pending-complaints" element={<SupervisorPendingComplaintsdea />} />
          <Route path="pending-complaints/view/:id" element={<SupervisorViewPendingComplaintsdea />} />
          <Route path="pending-complaints/edit/:id" element={<SupervisorEditPendingComplaintsdea />} />

          <Route path="approved-complaints" element={<SupervisorApprovedComplaintsdea />} />   
          <Route path="approved-complaints/view/:id" element={<SupervisorViewApprovedComplaintsdea />} />
          <Route path="approved-complaints/edit/:id" element={<SupervisorEditApprovedComplaintsdea />} /> 
        </Route>
      )} 

        {/* Lok-ayukt  Routes */}
      {/* {role === 'lok-ayukt' && (
        <Route path="/lok-ayukt" element={<LokayuktLayout />}>
          <Route path="dashboard" element={<LokayuktDashboard />} />
          <Route path="complaints" element={<LokayuktComplaints />} />
          <Route path="progress-register" element={<LokayuktProgressRegister />} />
          <Route path="search-reports" element={<LokayuktSearchReports />} />
         
        </Route>
      )} */}

        {/* UPLok-ayukt  Routes */}
      {/* {role === 'uplokayukt' && (
        <Route path="/uplokayukt" element={<UplokayuktLayout />}>
          <Route path="dashboard" element={<UplokayuktDashboard />} />
          <Route path="complaints" element={<UplokayuktComplaints />} />
          <Route path="progress-register" element={<UplokayuktProgressRegister />} />
          <Route path="search-reports" element={<UplokayuktSearchReports />} />
         
        </Route>
      )} */}

    </Routes>
  );
}

export default App;
