// pages/SearchReports.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaDownload,
  FaFileAlt,
  FaChartBar,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Pagination from '../Pagination';

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

const SearchReports = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  // ✅ NEW STATES FOR NEW APIS
  const [overallStats, setOverallStats] = useState(null);
  const [districtWiseStats, setDistrictWiseStats] = useState(null);
  const [departmentWiseStats, setDepartmentWiseStats] = useState(null);
  
  const [isSearching, setIsSearching] = useState(false);
  
  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Helper function to ensure array
  const ensureArray = (data) => Array.isArray(data) ? data : [];

  // Fetch initial data when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Existing API calls
        const districtsResponse = await api.get("/all-district");
        
        if (districtsResponse.data.status === "success") {
          const districtsArray = ensureArray(districtsResponse.data.data);
          setDistricts(districtsArray);
        }

        const reportsResponse = await api.get("/complain-report");
        
        if (reportsResponse.data.status === true) {
          const dataArray = ensureArray(reportsResponse.data.data);
          setSearchResults(dataArray);
        }

        // ✅ NEW API CALLS
        // Fetch overall stats
        try {
          const overallResponse = await api.get("/all-complains");
          if (overallResponse.data.status === true) {
            setOverallStats(overallResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching overall stats:", error);
        }

        // Fetch district-wise stats
        try {
          const districtWiseResponse = await api.get("/district-wise-complaint");
          if (districtWiseResponse.data.status === true) {
            setDistrictWiseStats(districtWiseResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching district-wise stats:", error);
        }

        // Fetch department-wise stats
        try {
          const departmentWiseResponse = await api.get("/department-wise-complaint");
          if (departmentWiseResponse.data.status === true) {
            setDepartmentWiseStats(departmentWiseResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching department-wise stats:", error);
        }

      } catch (error) {
        setSearchResults([]);
        setDistricts([]);
        toast.error("Error loading data");
      }
    };

    fetchInitialData();
  }, []);

  // Handle refresh data
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await api.get("/complain-report");
      
      if (response.data.status === true) {
        const dataArray = ensureArray(response.data.data);
        setSearchResults(dataArray);
        setCurrentPage(1);
      } else {
        setSearchResults([]);
        toast.warning("No data found");
      }
    } catch (error) {
      setSearchResults([]);
      toast.error("Error fetching data");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Disposed - Accepted" || status === "Resolved")
      return "bg-green-100 text-green-800 border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-800 border-red-200";
    if (status === "In Progress" || status === "Under Investigation")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status === "Pending")
      return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // ✅ CORRECTED FILTERING LOGIC - Fixed district matching
  const filteredResults = ensureArray(searchResults).filter((result) => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" ||
      (result.complain_no && 
        result.complain_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.application_no && 
        result.application_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.name && 
        result.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.officer_name && 
        result.officer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.department_name && 
        result.department_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.district_name && 
        result.district_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // ✅ FIXED: District filtering - Properly scoped variable
    let matchesDistrict = true;
    if (selectedDistrict !== "all") {
      const selectedDistrictObj = districts.find(d => d.id.toString() === selectedDistrict);
      if (selectedDistrictObj) {
        matchesDistrict = result.district_id.toString() === selectedDistrictObj.district_code;
      } else {
        matchesDistrict = false;
      }
    }

    // Status filter
    const matchesStatus = selectedStatus === "all" || result.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ✅ UPDATED Report stats calculation using new API data
  const reportStats = {
    total: overallStats?.total_complaints || ensureArray(searchResults).length,
    disposed: ensureArray(searchResults).filter(
      (r) => r.status === "Disposed - Accepted" || r.status === "Resolved"
    ).length,
    rejected: overallStats?.total_rejected || ensureArray(searchResults).filter((r) => r.status === "Rejected").length,
    inProgress: overallStats?.total_pending || ensureArray(searchResults).filter(
      (r) =>
        r.status === "In Progress" ||
        r.status === "Under Investigation" ||
        r.status === "Pending"
    ).length,
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <div className="max-w-full px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Search & Reports / खोज और रिपोर्ट
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Advanced search and detailed reports ({ensureArray(searchResults).length} total records loaded)
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0">
            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export All</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

      

        {/* Tabs Component */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="space-y-6">
            <div className="inline-flex h-auto sm:h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full">
              <div className="grid grid-cols-1 sm:flex w-full gap-1">
                <button
                  onClick={() => setActiveTab("search")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "search"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Advanced Search
                </button>
                <button
                  onClick={() => setActiveTab("general")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "general"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  General Reports
                </button>
                <button
                  onClick={() => setActiveTab("statistical")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "statistical"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Statistical Reports
                </button>
                <button
                  onClick={() => setActiveTab("compliance")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-1 ${
                    activeTab === "compliance"
                      ? "bg-white text-gray-900 shadow-sm"
                      : ""
                  }`}
                >
                  Compliance Reports
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="overflow-hidden">
              {/* Advanced Search Tab */}
              {activeTab === "search" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="space-y-3 sm:space-y-4 overflow-hidden">
                    {/* Search Criteria */}
                    <div className="bg-white p-3 sm:p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <FaSearch className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                          Search & Filter
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {/* Search Term */}
                        <div className="w-full">
                          <input
                            id="search-term"
                            type="text"
                            placeholder="Search by Application No., Name, Officer, Department, District..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <select
                              id="district"
                              value={selectedDistrict}
                              onChange={(e) => setSelectedDistrict(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs sm:text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="all">All Districts ({ensureArray(districts).length} total)</option>
                              {ensureArray(districts).map((district) => (
                                <option key={district.id} value={district.id.toString()}>
                                  {district.district_name} - {district.dist_name_hi}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <select
                              id="status"
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs sm:text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="all">All Status</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Disposed - Accepted">Disposed - Accepted</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Under Investigation">Under Investigation</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1">
                            <button
                              onClick={handleSearch}
                              disabled={isSearching}
                              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                                isSearching
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {isSearching ? (
                                <>
                                  <FaSpinner className="w-3 h-3 animate-spin" />
                                  <span>Refreshing...</span>
                                </>
                              ) : (
                                <>
                                  <FaSearch className="w-3 h-3" />
                                  <span>Refresh</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Results */}
                    <div className="bg-white p-3 sm:p-4 border-gray-200 shadow-sm overflow-hidden">
                      {/* Table wrapper */}
                      <div className="w-full overflow-hidden rounded-md border border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-[11px] sm:text-xs">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Application No.
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Complainant
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">
                                  Department
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  District
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Nature
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Status
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Entry Date
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {paginatedResults.length > 0 ? (
                                paginatedResults.map((result, index) => (
                                  <tr key={result.id || index} className="hover:bg-gray-50">
                                    <td className="py-2 px-2 sm:px-3 font-medium text-gray-900">
                                      {result.complain_no || result.application_no || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700">
                                      {result.name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700 hidden lg:table-cell">
                                      {result.department_name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700">
                                      <span 
                                        className="font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-md text-xs" 
                                        title={`District Code: ${result.district_id}`}
                                      >
                                        {result.district_name || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${
                                          result.complaintype_name === "Allegation"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {result.complaintype_name || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${getStatusColor(
                                          result.status
                                        )}`}
                                      >
                                        {result.status || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span className="text-xs text-gray-600">
                                        {result.created_at || "N/A"}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-[10px] hover:bg-gray-50 transition-colors">
                                        <FaFileAlt className="w-3 h-3" />
                                        <span className="hidden sm:inline">View</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="8" className="py-8 text-center text-gray-500">
                                    {searchTerm || selectedDistrict !== "all" || selectedStatus !== "all"
                                      ? "No results match your filter criteria. Try adjusting your filters."
                                      : "No data available. Click Refresh to load data."}
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
                            totalItems={filteredResults.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            showInfo={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* General Reports Tab */}
              {activeTab === "general" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="w-full max-w-7xl mx-auto space-y-4 p-2 sm:space-y-6 overflow-hidden">
                    {/* KPI cards - Using new API data */}
                    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Total Complaints
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-gray-900">
                          {overallStats?.total_complaints || reportStats.total}
                        </div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Approved
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-green-600">
                          {overallStats?.total_approved || 0}
                        </div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Rejected
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-red-600">
                          {overallStats?.total_rejected || reportStats.rejected}
                        </div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Pending
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                          {overallStats?.total_pending || reportStats.inProgress}
                        </div>
                      </div>
                    </div>

                    {/* ✅ NEW REPORTS USING NEW API DATA */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* District-wise Report using new API */}
                      <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                           District-wise Report 
                        </h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {districtWiseStats ? (
                            Object.entries(districtWiseStats).map(([districtName, count]) => (
                              <div key={districtName} className="flex justify-between items-center">
                                <span className="truncate text-sm sm:text-base text-gray-700">
                                  {districtName}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                  {count}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              Loading district-wise data...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Department-wise Report using new API */}
                      <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                           Department-wise Report 
                        </h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {departmentWiseStats ? (
                            Object.entries(departmentWiseStats).map(([departmentName, count]) => (
                              <div key={departmentName} className="flex justify-between items-center">
                                <span className="truncate text-sm sm:text-base text-gray-700">
                                  {departmentName}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  {count}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              Loading department-wise data...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistical Reports Tab */}
              {activeTab === "statistical" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          Status Distribution
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">Approved</span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {overallStats?.total_approved || 0} Cases
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">Pending</span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {overallStats?.total_pending || 0} Cases
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">Rejected</span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {overallStats?.total_rejected || 0} Cases
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                         Live Statistics Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-700">Total Districts with Complaints</span>
                          <span className="font-medium text-gray-900">
                            {districtWiseStats ? Object.keys(districtWiseStats).length : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-700">Total Departments Involved</span>
                          <span className="font-medium text-gray-900">
                            {departmentWiseStats ? Object.keys(departmentWiseStats).length : 0}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium text-gray-900">Total Complaints (Live)</span>
                          <span className="font-bold text-gray-900">{overallStats?.total_complaints || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Reports Tab */}
              {activeTab === "compliance" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="space-y-4 sm:space-y-6 overflow-hidden">
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                        📈 Compliance Report 
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                            {overallStats?.total_complaints > 0 ? Math.round((Number(overallStats?.total_approved || 0) / Number(overallStats?.total_complaints)) * 100) : 0}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Approved Cases</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">
                            {overallStats?.total_complaints > 0 ? Math.round((Number(overallStats?.total_pending || 0) / Number(overallStats?.total_complaints)) * 100) : 0}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Pending Cases</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                            {overallStats?.total_complaints > 0 ? Math.round((Number(overallStats?.total_rejected || 0) / Number(overallStats?.total_complaints)) * 100) : 0}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">Rejected Cases</div>
                        </div>
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

export default SearchReports;
