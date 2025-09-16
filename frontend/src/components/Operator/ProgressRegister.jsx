// pages/ProgressRegister.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileAlt,
  FaClock,
  FaArrowRight,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa";
import Pagination from "../Pagination"; // ✅ Import Pagination component

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ProgressRegister = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("movements");
  const [complaintsData, setComplaintsData] = useState([]);
  const [currentReportData, setCurrentReportData] = useState([]); // ✅ NEW: State for current report data
  const [error, setError] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch complaints data from API for movements tab
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/operator/progress-register");
        if (response.data.status && response.data.data) {
          setComplaintsData(response.data.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch complaints data");
      }
    };

    fetchComplaints();
  }, []);

  // ✅ NEW: Fetch current report data for status tab
  useEffect(() => {
    const fetchCurrentReport = async () => {
      try {
        const response = await api.get("/operator/current-report");
        if (response.data.status && response.data.data) {
          setCurrentReportData(response.data.data);
        } else {
          console.log("No current report data available");
          setCurrentReportData([]);
        }
      } catch (err) {
        console.error("Current Report API Error:", err);
        setCurrentReportData([]);
      }
    };

    fetchCurrentReport();
  }, []);

  // ✅ Function to determine movement flow based on API data
  const getMovementFlow = (complaint) => {
    // RO to Section Officer
    if (complaint.approved_rejected_by_ro == 1 && complaint.approved_rejected_by_so_us == 0) {
      return {
        from: "RO",
        to: "Section Officer", 
        status: "pending",
        icon: <FaArrowRight className="w-3 h-3 text-blue-600" />
      };
    }
    
    // Section Officer to DS/JS
    if (complaint.approved_rejected_by_so_us == 1 && complaint.approved_rejected_by_ds_js == 0) {
      return {
        from: "Section Officer",
        to: "DS/JS",
        status: "pending", 
        icon: <FaArrowRight className="w-3 h-3 text-green-600" />
      };
    }

    // DS/JS to Secretary
    if (complaint.approved_rejected_by_ds_js == 1 && complaint.status_sec == 0) {
      return {
        from: "DS/JS",
        to: "Secretary",
        status: "pending",
        icon: <FaArrowRight className="w-3 h-3 text-yellow-600" />
      };
    }

    // Forwarded to Lokayukt
    if (complaint.forward_to_lokayukt == 1 && complaint.status_lokayukt == 1) {
      return {
        from: "System",
        to: "Lokayukt",
        status: "completed",
        icon: <FaArrowRight className="w-3 h-3 text-purple-600" />
      };
    }

    // Forwarded to Up-Lokayukt  
    if (complaint.forward_to_uplokayukt == 1 && complaint.status_uplokayukt == 1) {
      return {
        from: "System", 
        to: "Up-Lokayukt",
        status: "completed",
        icon: <FaArrowRight className="w-3 h-3 text-indigo-600" />
      };
    }

    // Case Rejected
    if (complaint.status === "Rejected") {
      return {
        from: "Officer",
        to: "Rejected",
        status: "overdue", 
        icon: <FaArrowRight className="w-3 h-3 text-red-600" />
      };
    }

    // Default case
    return {
      from: "Initial",
      to: "Processing",
      status: "pending",
      icon: <FaArrowRight className="w-3 h-3 text-gray-600" />
    };
  };

  // ✅ Transform API data to file movements format with proper movement logic
  const transformToFileMovements = (data) => {
    return data.map((complaint, index) => {
      const movement = getMovementFlow(complaint);
      return {
        id: complaint.id,
        complaintNo: complaint.complain_no,
        complainant: complaint.name,
        fromRole: movement.from,
        toRole: movement.to,
        movementIcon: movement.icon,
        note: complaint.remarks || `N/A`,
        timestamp: formatDate(complaint.created_at),
        status: movement.status,
      };
    });
  };

  // ✅ NEW: Transform current report data to complaint status format
  const transformCurrentReportToStatus = (data) => {
    if (!data || data.length === 0) return [];
    
    return data.map((report) => ({
      complaintNo: report.complain_no || 'N/A',
      complainant: report.name || 'N/A',
      subject: `${report.complaintype_name || 'N/A'} - ${report.subject_name || 'N/A'}`,
      currentStage: getCurrentStageFromCurrentReport(report),
      assignedTo: `${report.department_name || 'N/A'} - ${report.officer_name || 'N/A'}`,
      receivedDate: formatDateOnly(report.created_at),
      targetDate: getTargetDate(report.created_at),
      status: getStatusTypeFromCurrentReport(report),
      daysElapsed: getDaysElapsed(report.created_at),
    }));
  };

  // ✅ NEW: Helper function to get current stage from current report data
  const getCurrentStageFromCurrentReport = (report) => {
    if (report.approved_rejected_by_ro == 1 && report.approved_rejected_by_so_us == 0) {
      return "At Section Officer";
    }
    if (report.approved_rejected_by_so_us == 1 && report.approved_rejected_by_ds_js == 0) {
      return "At DS/JS";
    }
    if (report.approved_rejected_by_ds_js == 1 && report.status_sec == 0) {
      return "At Secretary";
    }
    if (report.forward_to_lokayukt == 1) {
      return "At Lokayukt";
    }
    if (report.forward_to_uplokayukt == 1) {
      return "At Up-Lokayukt";
    }
    if (report.status === "Rejected") {
      return "Case Rejected";
    }
    if (report.status === "In Progress") {
      return "Under Investigation";
    }
    if (report.status === "Disposed - Accepted") {
      return "Case Disposed";
    }
    return "Initial Stage";
  };

  // ✅ NEW: Helper function to get status type from current report data
  const getStatusTypeFromCurrentReport = (report) => {
    if (report.status === "In Progress") return "on-track";
    if (report.status === "Disposed - Accepted") return "on-track";
    if (report.status === "Rejected") return "critical";
    if (getDaysElapsed(report.created_at) > 30) return "critical";
    return "delayed";
  };

  // ✅ UPDATED: Helper function to get current stage based on API data (for backward compatibility)
  const getCurrentStage = (complaint) => {
    if (complaint.approved_rejected_by_ro == 1 && complaint.approved_rejected_by_so_us == 0) {
      return "At Section Officer";
    }
    if (complaint.approved_rejected_by_so_us == 1 && complaint.approved_rejected_by_ds_js == 0) {
      return "At DS/JS";
    }
    if (complaint.forward_to_lokayukt == 1) {
      return "At Lokayukt";
    }
    if (complaint.forward_to_uplokayukt == 1) {
      return "At Up-Lokayukt";
    }
    if (complaint.status === "Rejected") {
      return "Case Rejected";
    }
    if (complaint.status === "In Progress") {
      return "Under Investigation";
    }
    return "Verification";
  };

  const getStatusType = (status) => {
    if (status === "In Progress") return "on-track";
    if (status === "Disposed - Accepted") return "on-track";
    if (status === "Rejected") return "critical";
    return "delayed";
  };

  // ✅ NEW: Helper function to get readable status text
  const getStatusText = (status) => {
    switch (status) {
      case "on-track":
        return "On Track";
      case "delayed":
        return "Delayed";
      case "critical":
        return "Critical";
      case "overdue":
        return "Overdue";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
  };

  const getTargetDate = (createdDate) => {
    if (!createdDate) return 'N/A';
    const date = new Date(createdDate);
    date.setDate(date.getDate() + 30); // Add 30 days as target
    return date.toLocaleDateString("en-CA");
  };

  const getDaysElapsed = (createdDate) => {
    if (!createdDate) return 0;
    const created = new Date(createdDate);
    const today = new Date();
    const diffTime = Math.abs(today - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "on-track":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "delayed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get transformed data
  const fileMovements = transformToFileMovements(complaintsData);
  
  // ✅ UPDATED: Use current report data for status tab
  const complaintStatus = transformCurrentReportToStatus(currentReportData);

  // Filter data based on search term
  const filteredMovements = fileMovements.filter(
    (movement) =>
      movement.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStatus = complaintStatus.filter(
    (status) =>
      status.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // ✅ Calculate pagination for current active tab
  const getCurrentData = () => {
    if (activeTab === "movements") return filteredMovements;
    if (activeTab === "status") return filteredStatus;
    return [];
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ UPDATED: Calculate analytics using both datasets
  const analytics = {
    avgProcessingTime:
      complaintsData.length > 0
        ? Math.round(
            complaintsData.reduce(
              (acc, complaint) => acc + getDaysElapsed(complaint.created_at),
              0
            ) / complaintsData.length
          )
        : 0,
    filesInTransit: complaintsData.filter((c) => c.status === "In Progress")
      .length,
    overdueFiles: complaintsData.filter(
      (c) => getDaysElapsed(c.created_at) > 30
    ).length,
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            Error loading data
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Progress Register / प्रगति रजिस्टर
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Track complaint progress and file movements
            </p>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-shrink-0">
              File Tracking & Movement
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
              <label
                htmlFor="search"
                className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block flex-shrink-0"
              >
                Search:
              </label>
              <div className="relative flex-1 sm:flex-initial min-w-0">
                <input
                  id="search"
                  type="text"
                  placeholder="Complaint No. or Complainant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 lg:w-64 px-3 py-2 pl-8 sm:pl-10 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <FaSearch className="absolute left-2.5 sm:left-3 top-2.5 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Tabs Component */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex h-auto sm:h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full">
              <div className="grid grid-cols-1 sm:flex w-full gap-1">
                <button
                  onClick={() => setActiveTab("movements")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "movements"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  File Movements
                </button>
                <button
                  onClick={() => setActiveTab("status")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "status"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Current Status
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "analytics"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-6 overflow-hidden">
              {/* File Movements Tab */}
              {activeTab === "movements" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                        Recent File Movements
                      </h3>
                    </div>

                    <div className="flow-root">
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <table className="min-w-full table-auto text-[11px] sm:text-xs">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                  Complaint No.
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                  Complainant
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                  Movement
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap hidden lg:table-cell">
                                  Note
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                  Timestamp
                                </th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {paginatedData.length > 0 ? (
                                paginatedData.map((movement) => (
                                  <tr
                                    key={movement.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                      {movement.complaintNo}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 whitespace-nowrap">
                                      {movement.complainant}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-gray-700 text-xs">{movement.fromRole}</span>
                                        {movement.movementIcon}
                                        <span className="text-gray-700 text-xs">{movement.toRole}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 max-w-[14rem] truncate hidden lg:table-cell">
                                      {movement.note || NA}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-600 whitespace-nowrap">
                                      {movement.timestamp}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-3 whitespace-nowrap">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(
                                          movement.status
                                        )}`}
                                      >
                                        {movement.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="6"
                                    className="py-8 text-center text-gray-500"
                                  >
                                    No file movements found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={currentData.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          showInfo={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ UPDATED: Current Status Tab with new API data */}
              {activeTab === "status" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                        Current Complaint Status ({currentReportData.length} records)
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <div className="min-w-full">
                        <table className="w-full text-[11px] sm:text-xs">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                Complaint No.
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                Complainant
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                Current Stage
                              </th>
                              {/* <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap hidden xl:table-cell">
                                Assigned To
                              </th> */}
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                Days
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap hidden lg:table-cell">
                                Target Date
                              </th>
                              <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {paginatedData.length > 0 ? (
                              paginatedData.map((complaint, index) => (
                                <tr
                                  key={complaint.complaintNo || index}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900">
                                    {complaint.complaintNo || 'N/A'}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700">
                                    {complaint.complainant || 'N/A'}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700">
                                    {complaint.currentStage || 'N/A'}
                                  </td>
                                  {/* <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 hidden xl:table-cell">
                                    {complaint.assignedTo || 'N/A'}
                                  </td> */}
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-600">
                                    {complaint.daysElapsed || 0}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-600 hidden lg:table-cell">
                                    {complaint.targetDate || 'N/A'}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(
                                        complaint.status
                                      )}`}
                                    >
                                      {getStatusText(complaint.status)}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="7"
                                  className="py-8 text-center text-gray-500"
                                >
                                  {currentReportData.length === 0 
                                    ? "No current report data available from API." 
                                    : "No complaint status found matching search criteria."
                                  }
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={currentData.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          showInfo={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                            Average Processing Time
                          </h3>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                          {analytics.avgProcessingTime} days
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          From entry to disposal
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                            Files in Transit
                          </h3>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-yellow-700 mb-1">
                          {analytics.filesInTransit}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Currently moving between roles
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-lg border border-red-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                            Overdue Files
                          </h3>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">
                          {analytics.overdueFiles}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Past target date
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRegister;
