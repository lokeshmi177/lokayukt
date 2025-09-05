// pages/SearchReports.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaFileAlt,
  FaChartBar,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get("/all-district");
        if (response.data.status === "success") {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast.error("Error fetching districts");
      }
    };

    fetchDistricts();
  }, []);

  // Handle search
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await api.get("/complain-report");
      if (response.data.status === true) {
        setSearchResults(response.data.data);
        toast.success(`Found ${response.data.data.length} results`);
      } else {
        setSearchResults([]);
        toast.info("No results found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error fetching complaint reports");
      setSearchResults([]);
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

  const filteredResults = searchResults.filter((result) => {
    const matchesSearch =
      searchTerm === "" ||
      (result.application_no &&
        result.application_no
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.officer_name &&
        result.officer_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict =
      selectedDistrict === "all" ||
      result.district_id.toString() === selectedDistrict;
    const matchesStatus =
      selectedStatus === "all" || result.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const reportStats = {
    total: searchResults.length,
    disposed: searchResults.filter(
      (r) => r.status === "Disposed - Accepted" || r.status === "Resolved"
    ).length,
    rejected: searchResults.filter((r) => r.status === "Rejected").length,
    inProgress: searchResults.filter(
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
              Advanced search and detailed reports
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0">
            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export All</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        {/* Tabs Component with Dashboard-like styling */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation with Dashboard styling */}
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
            <div className="p-3 sm:p-6 overflow-hidden">
              {/* Advanced Search Tab - Fixed Layout */}
              {activeTab === "search" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="space-y-3 sm:space-y-4 overflow-hidden">
                    {/* Search Criteria - Compact */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <FaSearch className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                          Search Criteria
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {/* Search Term */}
                        <div className="w-full">
                          <label
                            htmlFor="search-term"
                            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                          >
                            Search Term
                          </label>
                          <input
                            id="search-term"
                            type="text"
                            placeholder="Application No., Name, etc."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>

                        {/* Filters - Compact grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 cursor-pointer">
                          <div>
                            <label
                              htmlFor="district"
                              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                            >
                              District
                            </label>
                            <select
                              id="district"
                              value={selectedDistrict}
                              onChange={(e) =>
                                setSelectedDistrict(e.target.value)
                              }
                              className="w-full px-2.5 py-2 text-xs sm:text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="all">All Districts</option>
                              {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                  {district.district_name} -{" "}
                                  {district.dist_name_hi}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="status"
                              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              value={selectedStatus}
                              onChange={(e) =>
                                setSelectedStatus(e.target.value)
                              }
                              className="w-full px-2.5 py-2 text-xs sm:text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="all">All Status</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Disposed - Accepted">
                                Disposed - Accepted
                              </option>
                              <option value="Rejected">Rejected</option>
                              <option value="Under Investigation">
                                Under Investigation
                              </option>
                              <option value="Pending">Pending</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              &nbsp;
                            </label>
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
                                  <span>Searching...</span>
                                </>
                              ) : (
                                <>
                                  <FaSearch className="w-3 h-3" />
                                  <span>Search</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Results - Compact */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                        Search Results ({filteredResults.length} found)
                      </h3>

                      {/* Table wrapper to prevent page-level scroll */}
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
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden md:table-cell">
                                  Respondent
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
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden sm:table-cell">
                                  Entry Date
                                </th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {filteredResults.length > 0 ? (
                                filteredResults.map((result) => (
                                  <tr
                                    key={result.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="py-2 px-2 sm:px-3 font-medium text-gray-900">
                                      {result.application_no || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700">
                                      {result.name}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700 hidden md:table-cell">
                                      {result.officer_name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700 hidden lg:table-cell">
                                      {result.department_name || "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-700">
                                      {result.district_name}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <span
                                        className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${
                                          result.complaintype_name ===
                                          "Allegation"
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
                                        {result.status}
                                      </span>
                                    </td>
                                    <td className="py-2 px-2 sm:px-3 text-gray-600 hidden sm:table-cell">
                                      {result.created_at}
                                    </td>
                                    <td className="py-2 px-2 sm:px-3">
                                      <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-[10px] hover:bg-gray-50 transition-colors">
                                        <FaFileAlt className="w-3 h-3" />
                                        <span className="hidden sm:inline">
                                          View
                                        </span>
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="9"
                                    className="py-8 text-center text-gray-500"
                                  >
                                    {isSearching
                                      ? "Searching..."
                                      : "No data available."}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Reports Tab */}
              {activeTab === "general" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 overflow-hidden">
                    {/* KPI cards */}
                    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Total Complaints
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-gray-900">
                          {reportStats.total}
                        </div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Disposed
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-green-600">
                          {reportStats.disposed}
                        </div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          Rejected
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-red-600">
                          {reportStats.rejected}
                        </div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                          In Progress
                        </h3>
                        <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                          {reportStats.inProgress}
                        </div>
                      </div>
                    </div>

                    {/* Reports grids */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                          District-wise Report
                        </h3>
                        <div className="space-y-3 cursor-pointer">
                          {districts.slice(0, 10).map((district) => {
                            const count = searchResults.filter(
                              (r) => r.district_id === district.id
                            ).length;
                            return (
                              <div
                                key={district.id}
                                className="flex justify-between items-center"
                              >
                                <span className="truncate text-sm sm:text-base text-gray-700">
                                  {district.district_name}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                          Department-wise Report
                        </h3>
                        <div className="space-y-3">
                          {[
                            ...new Set(
                              searchResults
                                .map((r) => r.department_name)
                                .filter(Boolean)
                            ),
                          ]
                            .slice(0, 10)
                            .map((dept) => {
                              const count = searchResults.filter(
                                (r) => r.department_name === dept
                              ).length;
                              return (
                                <div
                                  key={dept}
                                  className="flex justify-between items-center"
                                >
                                  <span className="truncate text-xs sm:text-sm text-gray-700">
                                    {dept}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
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
                          <span className="text-sm sm:text-base text-gray-700">
                            In Progress
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {
                                searchResults.filter(
                                  (r) => r.status === "In Progress"
                                ).length
                              }{" "}
                              Cases
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">
                            Resolved
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {
                                searchResults.filter(
                                  (r) =>
                                    r.status === "Disposed - Accepted" ||
                                    r.status === "Resolved"
                                ).length
                              }{" "}
                              Cases
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">
                            Rejected
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {
                                searchResults.filter(
                                  (r) => r.status === "Rejected"
                                ).length
                              }{" "}
                              Cases
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                        Complaint Categories
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-700">
                            Allegations
                          </span>
                          <span className="font-medium text-gray-900">
                            {
                              searchResults.filter(
                                (r) => r.complaintype_name === "Allegation"
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-700">
                            Grievances
                          </span>
                          <span className="font-medium text-gray-900">
                            {
                              searchResults.filter(
                                (r) => r.complaintype_name !== "Allegation"
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium text-gray-900">
                            Total Cases
                          </span>
                          <span className="font-bold text-gray-900">
                            {searchResults.length}
                          </span>
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
                        SLA Compliance Report
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                            {Math.round(
                              (reportStats.disposed /
                                Math.max(reportStats.total, 1)) *
                                100
                            )}
                            %
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Resolved Cases
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">
                            {Math.round(
                              (reportStats.inProgress /
                                Math.max(reportStats.total, 1)) *
                                100
                            )}
                            %
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            In Progress
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                            {Math.round(
                              (reportStats.rejected /
                                Math.max(reportStats.total, 1)) *
                                100
                            )}
                            %
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Rejected Cases
                          </div>
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
