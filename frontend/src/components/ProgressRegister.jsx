// pages/ProgressRegister.js
import React, { useState } from 'react';
import { 
  FaSearch, 
  FaFileAlt, 
  FaClock, 
  FaArrowRight, 
  FaFilter, 
  FaDownload,
  FaCalendarAlt 
} from 'react-icons/fa';

const ProgressRegister = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('movements');

  const fileMovements = [
    {
      id: '1',
      complaintNo: 'MP/2024/ALG/001',
      complainant: 'राम कुमार शर्मा',
      fromRole: 'RO',
      toRole: 'Section Officer',
      note: 'Initial verification completed. Forwarding for supervisor review.',
      timestamp: '2024-01-15 10:30 AM',
      status: 'completed'
    },
    {
      id: '2',
      complaintNo: 'MP/2024/ALG/001',
      complainant: 'राम कुमार शर्मा',
      fromRole: 'Section Officer',
      toRole: 'DS',
      note: 'Documents verified. Recommending for enquiry.',
      timestamp: '2024-01-16 02:15 PM',
      status: 'completed'
    },
    {
      id: '3',
      complaintNo: 'MP/2024/GRV/002',
      complainant: 'सुनीता देवी',
      fromRole: 'ARO',
      toRole: 'Section Officer',
      note: 'Security fee exemption approved. Ready for verification.',
      timestamp: '2024-01-16 11:45 AM',
      status: 'pending'
    },
    {
      id: '4',
      complaintNo: 'MP/2024/ALG/003',
      complainant: 'मोहन लाल',
      fromRole: 'Secretary',
      toRole: 'LokAyukta',
      note: 'All verifications complete. Recommending for enquiry assignment.',
      timestamp: '2024-01-14 04:20 PM',
      status: 'overdue'
    }
  ];

  const complaintStatus = [
    {
      complaintNo: 'MP/2024/ALG/001',
      complainant: 'राम कुमार शर्मा',
      subject: 'Corruption in PWD Contract',
      currentStage: 'Under Investigation',
      assignedTo: 'CIO - राज कुमार',
      receivedDate: '2024-01-10',
      targetDate: '2024-02-10',
      status: 'on-track',
      daysElapsed: 15
    },
    {
      complaintNo: 'MP/2024/GRV/002',
      complainant: 'सुनीता देवी',
      subject: 'Pension Delay Issue',
      currentStage: 'Verification',
      assignedTo: 'Section Officer - अमित गुप्ता',
      receivedDate: '2024-01-12',
      targetDate: '2024-01-25',
      status: 'delayed',
      daysElapsed: 13
    },
    {
      complaintNo: 'MP/2024/ALG/003',
      complainant: 'मोहन लाल',
      subject: 'Land Revenue Fraud',
      currentStage: 'Awaiting Enquiry Assignment',
      assignedTo: 'LokAyukta Office',
      receivedDate: '2024-01-05',
      targetDate: '2024-01-15',
      status: 'critical',
      daysElapsed: 20
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'पूर्ण';
      case 'pending':
        return 'लंबित';
      case 'overdue':
        return 'देरी';
      case 'on-track':
        return 'समय पर';
      case 'delayed':
        return 'विलंबित';
      case 'critical':
        return 'गंभीर';
      default:
        return status;
    }
  };

  const filteredMovements = fileMovements.filter(
    movement =>
      movement.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStatus = complaintStatus.filter(
    status =>
      status.complaintNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Progress Register / प्रगति रजिस्टर</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Track complaint progress and file movements</p>
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-shrink-0">File Tracking & Movement</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
              <label htmlFor="search" className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block flex-shrink-0">Search:</label>
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

        {/* Tabs Component with Dashboard-like styling */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation with Dashboard styling */}
          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full">
              <button
                onClick={() => setActiveTab('movements')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'movements' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                File Movements
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'status' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                Current Status
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  activeTab === 'analytics' ? "bg-white text-gray-900 shadow-sm" : ""
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-6 overflow-hidden">
              {/* File Movements Tab */}
              {activeTab === 'movements' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Recent File Movements</h3>
                    </div>

                    {/* Table wrapper prevents page-level horizontal scroll */}
                    <div className="flow-root">
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <table className="min-w-full table-auto text-[11px] sm:text-xs">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">Complaint No.</th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">Complainant</th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">Movement</th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap hidden lg:table-cell">Note</th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">Timestamp</th>
                                <th className="text-left py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {filteredMovements.map((movement) => (
                                <tr key={movement.id} className="hover:bg-gray-50">
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 font-medium text-gray-900 whitespace-nowrap">
                                    {movement.complaintNo}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 whitespace-nowrap">
                                    {movement.complainant}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span className="text-[11px] sm:text-xs text-gray-600 whitespace-nowrap">{movement.fromRole}</span>
                                      <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                                      <span className="text-[11px] sm:text-xs font-medium text-gray-900 whitespace-nowrap">{movement.toRole}</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-700 max-w-[14rem] truncate hidden lg:table-cell">
                                    {movement.note}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 text-gray-600 whitespace-nowrap">
                                    {movement.timestamp}
                                  </td>
                                  <td className="py-2 px-2 sm:py-3 sm:px-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(movement.status)}`}>
                                      {getStatusText(movement.status)}
                                    </span>
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

              {/* Current Status Tab */}
              {activeTab === 'status' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Current Complaint Status</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <div className="min-w-full">
                        <table className="w-full text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900">Complaint No.</th>
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900">Complainant</th>
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900">Current Stage</th>
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 hidden xl:table-cell">Assigned To</th>
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900">Days</th>
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 hidden lg:table-cell">Target Date</th>
                              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStatus.map((complaint) => (
                              <tr key={complaint.complaintNo} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900">{complaint.complaintNo}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">{complaint.complainant}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">{complaint.currentStage}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 hidden xl:table-cell">{complaint.assignedTo}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600">{complaint.daysElapsed}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 hidden lg:table-cell">{complaint.targetDate}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                    {getStatusText(complaint.status)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Average Processing Time</h3>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">12.5 days</div>
                        <p className="text-xs sm:text-sm text-gray-600">From entry to disposal</p>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Files in Transit</h3>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-yellow-700 mb-1">23</div>
                        <p className="text-xs sm:text-sm text-gray-600">Currently moving between roles</p>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-lg border border-red-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Overdue Files</h3>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">5</div>
                        <p className="text-xs sm:text-sm text-gray-600">Past target date</p>
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
