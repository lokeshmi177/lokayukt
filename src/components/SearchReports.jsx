// pages/SearchReports.js
import React, { useState } from 'react';
import { 
  FaSearch, 
  FaDownload, 
  FaFilter, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaChartBar 
} from 'react-icons/fa';

const SearchReports = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const searchResults = [
    {
      complaintNo: 'MP/2024/ALG/001',
      complainant: 'राम कुमार शर्मा',
      respondent: 'SDM भोपाल',
      department: 'Revenue Department',
      district: 'Bhopal',
      nature: 'Allegation',
      status: 'Under Investigation',
      entryDate: '2024-01-10',
    },
    {
      complaintNo: 'MP/2024/GRV/002',
      complainant: 'सुनीता देवी',
      respondent: 'Pension Officer',
      department: 'Social Welfare',
      district: 'Indore',
      nature: 'Grievance',
      status: 'Disposed - Accepted',
      entryDate: '2024-01-12',
      disposalDate: '2024-01-20'
    },
    {
      complaintNo: 'MP/2024/ALG/003',
      complainant: 'मोहन लाल',
      respondent: 'Tehsildar',
      department: 'Revenue Department',
      district: 'Gwalior',
      nature: 'Allegation',
      status: 'Rejected',
      entryDate: '2024-01-05',
      disposalDate: '2024-01-18'
    },
    {
      complaintNo: 'MP/2024/GRV/004',
      complainant: 'प्रिया पटेल',
      respondent: 'BDO',
      department: 'Rural Development',
      district: 'Ujjain',
      nature: 'Grievance',
      status: 'In Progress',
      entryDate: '2024-01-14',
    }
  ];

  const getStatusColor = (status) => {
    if (status.includes('Disposed')) return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Rejected') return 'bg-red-100 text-red-800 border-red-200';
    if (status.includes('Investigation') || status.includes('Progress')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredResults = searchResults.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.respondent.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict === 'all' || result.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'all' || result.status === selectedStatus;
    
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const reportStats = {
    total: searchResults.length,
    disposed: searchResults.filter(r => r.status.includes('Disposed')).length,
    rejected: searchResults.filter(r => r.status === 'Rejected').length,
    inProgress: searchResults.filter(r => r.status.includes('Progress') || r.status.includes('Investigation')).length,
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <div className="max-w-full px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Search & Reports / खोज और रिपोर्ट</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Advanced search and detailed reports</p>
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
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full">
              <button
                onClick={() => setActiveTab('search')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'search' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                Advanced Search
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'general' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                General Reports
              </button>
              <button
                onClick={() => setActiveTab('statistical')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'statistical' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                Statistical Reports
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'compliance' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                Compliance Reports
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-6 overflow-hidden">
              {/* Advanced Search Tab - Fixed Layout */}
              {activeTab === 'search' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="space-y-3 sm:space-y-4 overflow-hidden">
                    {/* Search Criteria - Compact */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <FaSearch className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Search Criteria</h3>
                      </div>

                      <div className="space-y-3">
                        {/* Search Term */}
                        <div className="w-full">
                          <label htmlFor="search-term" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Search Term
                          </label>
                          <input
                            id="search-term"
                            type="text"
                            placeholder="Complaint No., Name, etc."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>

                        {/* Filters - Compact grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label htmlFor="district" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">District</label>
                            <select
                              id="district"
                              value={selectedDistrict}
                              onChange={(e) => setSelectedDistrict(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="all">All Districts</option>
                              <option value="Bhopal">Bhopal</option>
                              <option value="Indore">Indore</option>
                              <option value="Gwalior">Gwalior</option>
                              <option value="Ujjain">Ujjain</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              id="status"
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                              <option value="all">All Status</option>
                              <option value="Under Investigation">Under Investigation</option>
                              <option value="Disposed - Accepted">Disposed - Accepted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="In Progress">In Progress</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                              <FaSearch className="w-3 h-3" />
                              <span>Search</span>
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
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">Complaint No.</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">Complainant</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden md:table-cell">Respondent</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">Department</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">District</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">Nature</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">Status</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap hidden sm:table-cell">Entry Date</th>
                                <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-700 whitespace-nowrap">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {filteredResults.map((result) => (
                                <tr key={result.complaintNo} className="hover:bg-gray-50">
                                  <td className="py-2 px-2 sm:px-3 font-medium text-gray-900">{result.complaintNo}</td>
                                  <td className="py-2 px-2 sm:px-3 text-gray-700">{result.complainant}</td>
                                  <td className="py-2 px-2 sm:px-3 text-gray-700 hidden md:table-cell">{result.respondent}</td>
                                  <td className="py-2 px-2 sm:px-3 text-gray-700 hidden lg:table-cell">{result.department}</td>
                                  <td className="py-2 px-2 sm:px-3 text-gray-700">{result.district}</td>
                                  <td className="py-2 px-2 sm:px-3">
                                    <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${
                                      result.nature === 'Allegation' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {result.nature}
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 sm:px-3">
                                    <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${getStatusColor(result.status)}`}>
                                      {result.status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 sm:px-3 text-gray-600 hidden sm:table-cell">{result.entryDate}</td>
                                  <td className="py-2 px-2 sm:px-3">
                                    <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-[10px] hover:bg-gray-50 transition-colors">
                                      <FaFileAlt className="w-3 h-3" />
                                      <span className="hidden sm:inline">View</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Reports Tab */}
              {activeTab === 'general' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 overflow-hidden">
                    {/* KPI cards */}
                    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Complaints</h3>
                        <div className="text-lg sm:text-2xl font-bold text-gray-900">{reportStats.total}</div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Disposed</h3>
                        <div className="text-lg sm:text-2xl font-bold text-green-600">{reportStats.disposed}</div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Rejected</h3>
                        <div className="text-lg sm:text-2xl font-bold text-red-600">{reportStats.rejected}</div>
                      </div>
                      <div className="min-w-0 bg-white p-3 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">In Progress</h3>
                        <div className="text-lg sm:text-2xl font-bold text-yellow-600">{reportStats.inProgress}</div>
                      </div>
                    </div>

                    {/* Reports grids */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">District-wise Report</h3>
                        <div className="space-y-3">
                          {['Bhopal', 'Indore', 'Gwalior', 'Ujjain'].map(district => {
                            const count = searchResults.filter(r => r.district === district).length;
                            return (
                              <div key={district} className="flex justify-between items-center">
                                <span className="truncate text-sm sm:text-base text-gray-700">{district}</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Department-wise Report</h3>
                        <div className="space-y-3">
                          {['Revenue Department', 'Social Welfare', 'Rural Development'].map(dept => {
                            const count = searchResults.filter(r => r.department === dept).length;
                            return (
                              <div key={dept} className="flex justify-between items-center">
                                <span className="truncate text-xs sm:text-sm text-gray-700">{dept}</span>
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
              {activeTab === 'statistical' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Monthly Trends</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">January 2024</span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              15 Received
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              8 Disposed
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm sm:text-base text-gray-700">December 2023</span>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              23 Received
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              18 Disposed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Average Processing Time</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-700">Allegations</span>
                          <span className="font-medium text-gray-900">18.5 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-gray-700">Grievances</span>
                          <span className="font-medium text-gray-900">12.3 days</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium text-gray-900">Overall Average</span>
                          <span className="font-bold text-gray-900">15.4 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Reports Tab */}
              {activeTab === 'compliance' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="space-y-4 sm:space-y-6 overflow-hidden">
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">SLA Compliance Report</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">85%</div>
                          <div className="text-xs sm:text-sm text-gray-500">Within Target</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">12%</div>
                          <div className="text-xs sm:text-sm text-gray-500">Delayed</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">3%</div>
                          <div className="text-xs sm:text-sm text-gray-500">Critical Delay</div>
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
