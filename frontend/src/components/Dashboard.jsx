// pages/Dashboard.js
import React from 'react';
import { 
  FaFile, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaChartLine 
} from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard / डैशबोर्ड</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, Admin • Last updated: 8/30/2025, 3:11:50 PM
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <span>📅</span>
                <span>This Month</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <span>⚡</span>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards - Exact Same as Image */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-8">
          
          {/* Total Complaints Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                <FaFile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Complaints</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">1,247</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">+12%</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
          
          {/* Today's Entry Card */}
          <div className="bg-gradient-to-br from-blue-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                <FaClock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Today's Entry</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">18</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">+8%</p>
              <p className="text-xs text-gray-500">New complaints</p>
            </div>
          </div>
          
          {/* Disposed Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 rounded-2xl border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Disposed</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">842</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">+5%</p>
              <p className="text-xs text-gray-500">67.5% of total</p>
            </div>
          </div>
          
          {/* Rejected Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-2xl border border-red-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                <FaTimesCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Rejected</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">156</p>
              <p className="text-xs sm:text-sm text-red-600 font-medium">3%</p>
              <p className="text-xs text-gray-500">12.5% of total</p>
            </div>
          </div>
          
          {/* In Progress Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-4 sm:p-6 rounded-2xl border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">In Progress</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">249</p>
              <p className="text-xs text-gray-500">20% of total</p>
            </div>
          </div>

          {/* Avg. Processing Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Avg. Processing</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">15.4</p>
              <p className="text-sm sm:text-lg text-gray-600 mb-1">days</p>
              <p className="text-xs sm:text-sm text-red-600 font-medium">2%</p>
              <p className="text-xs text-gray-500">Target: 20 days</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto">
              <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600 whitespace-nowrap">
                Overview
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Trends
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Performance
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Workload
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Compliance
              </button>
            </nav>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Monthly Complaint Trends - Line Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Monthly Complaint Trends</h3>
            <div className="h-64 sm:h-80 relative">
              {/* SVG Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 400 240">
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                <text x="20" y="40" fontSize="10" fill="#6b7280" textAnchor="middle">80</text>
                <text x="20" y="80" fontSize="10" fill="#6b7280" textAnchor="middle">60</text>
                <text x="20" y="120" fontSize="10" fill="#6b7280" textAnchor="middle">40</text>
                <text x="20" y="160" fontSize="10" fill="#6b7280" textAnchor="middle">20</text>
                <text x="20" y="200" fontSize="10" fill="#6b7280" textAnchor="middle">0</text>
                
                {/* X-axis labels */}
                <text x="60" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Jul</text>
                <text x="110" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Aug</text>
                <text x="160" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Sep</text>
                <text x="210" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Oct</text>
                <text x="260" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Nov</text>
                <text x="310" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Dec</text>
                <text x="360" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Jan</text>
                
                {/* Received Line (Black) */}
                <polyline 
                  points="60,155 110,147 160,153 210,140 260,145 310,132 360,125"
                  fill="none" 
                  stroke="#1f2937" 
                  strokeWidth="2"
                />
                <circle cx="60" cy="155" r="3" fill="#1f2937"/>
                <circle cx="110" cy="147" r="3" fill="#1f2937"/>
                <circle cx="160" cy="153" r="3" fill="#1f2937"/>
                <circle cx="210" cy="140" r="3" fill="#1f2937"/>
                <circle cx="260" cy="145" r="3" fill="#1f2937"/>
                <circle cx="310" cy="132" r="3" fill="#1f2937"/>
                <circle cx="360" cy="125" r="3" fill="#1f2937"/>
                
                {/* Disposed Line (Green) */}
                <polyline 
                  points="60,160 110,160 160,156 210,145 260,152 310,142 360,138"
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="2"
                />
                <circle cx="60" cy="160" r="3" fill="#22c55e"/>
                <circle cx="110" cy="160" r="3" fill="#22c55e"/>
                <circle cx="160" cy="156" r="3" fill="#22c55e"/>
                <circle cx="210" cy="145" r="3" fill="#22c55e"/>
                <circle cx="260" cy="152" r="3" fill="#22c55e"/>
                <circle cx="310" cy="142" r="3" fill="#22c55e"/>
                <circle cx="360" cy="138" r="3" fill="#22c55e"/>
                
                {/* Rejected Line (Red) */}
                <polyline 
                  points="60,188 110,184 160,182 210,186 260,184 310,188 360,190"
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2"
                />
                <circle cx="60" cy="188" r="3" fill="#ef4444"/>
                <circle cx="110" cy="184" r="3" fill="#ef4444"/>
                <circle cx="160" cy="182" r="3" fill="#ef4444"/>
                <circle cx="210" cy="186" r="3" fill="#ef4444"/>
                <circle cx="260" cy="184" r="3" fill="#ef4444"/>
                <circle cx="310" cy="188" r="3" fill="#ef4444"/>
                <circle cx="360" cy="190" r="3" fill="#ef4444"/>
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow-sm text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-3 h-0.5 bg-gray-800"></div>
                  <span>Received: 55</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Disposed: 48</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-red-500"></div>
                  <span>Rejected: 16</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Status Distribution - Pie Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Current Status Distribution</h3>
            <div className="h-64 sm:h-80 relative flex items-center justify-center">
              {/* SVG Pie Chart */}
              <svg className="w-48 h-48 sm:w-64 sm:h-64" viewBox="0 0 200 200">
                {/* Pie segments */}
                <circle cx="100" cy="100" r="80" fill="#f59e0b" strokeWidth="2" stroke="#fff" 
                        strokeDasharray="125.6 251.2" strokeDashoffset="0" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="#3b82f6" strokeWidth="2" stroke="#fff" 
                        strokeDasharray="70.7 251.2" strokeDashoffset="-125.6" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="#22c55e" strokeWidth="2" stroke="#fff" 
                        strokeDasharray="53.1 251.2" strokeDashoffset="-196.3" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="#ef4444" strokeWidth="2" stroke="#fff" 
                        strokeDasharray="27 251.2" strokeDashoffset="-249.4" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="#8b5cf6" strokeWidth="2" stroke="#fff" 
                        strokeDasharray="18.2 251.2" strokeDashoffset="-276.4" transform="rotate(-90 100 100)"/>
              </svg>
              
              {/* Legend */}
              <div className="absolute right-0 top-4 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>In Progress: 145</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Under Investigation: 89</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Disposed - Accepted: 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Disposed - Rejected: 34</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Awaiting Response: 23</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
          {/* Department-wise Complaints - Horizontal Bar Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Department-wise Complaints</h3>
            <div className="h-64 sm:h-80 flex items-center">
              <div className="w-full space-y-4">
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Others</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-blue-500 h-6 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Education</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-green-500 h-6 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Social Welfare</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-yellow-500 h-6 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">PWD</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-purple-500 h-6 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Revenue</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-red-500 h-6 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* District-wise Allegations vs Grievances - Stacked Bar Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">District-wise Allegations vs Grievances</h3>
            <div className="h-64 sm:h-80 relative">
              <svg className="w-full h-full" viewBox="0 0 400 240">
                {/* Y-axis scale */}
                <text x="20" y="40" fontSize="10" fill="#6b7280">100</text>
                <text x="20" y="80" fontSize="10" fill="#6b7280">75</text>
                <text x="20" y="120" fontSize="10" fill="#6b7280">50</text>
                <text x="20" y="160" fontSize="10" fill="#6b7280">25</text>
                <text x="20" y="200" fontSize="10" fill="#6b7280">0</text>
                
                {/* District bars */}
                {/* Bhopal */}
                <rect x="60" y="120" width="40" height="80" fill="#ef4444"/>
                <rect x="60" y="80" width="40" height="40" fill="#f59e0b"/>
                <text x="80" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Bhopal</text>
                
                {/* Indore */}
                <rect x="120" y="130" width="40" height="70" fill="#ef4444"/>
                <rect x="120" y="100" width="40" height="30" fill="#f59e0b"/>
                <text x="140" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Indore</text>
                
                {/* Gwalior */}
                <rect x="180" y="140" width="40" height="60" fill="#ef4444"/>
                <rect x="180" y="115" width="40" height="25" fill="#f59e0b"/>
                <text x="200" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Gwalior</text>
                
                {/* Ujjain */}
                <rect x="240" y="150" width="40" height="50" fill="#ef4444"/>
                <rect x="240" y="130" width="40" height="20" fill="#f59e0b"/>
                <text x="260" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Ujjain</text>
                
                {/* Jabalpur */}
                <rect x="300" y="160" width="40" height="40" fill="#ef4444"/>
                <rect x="300" y="142" width="40" height="18" fill="#f59e0b"/>
                <text x="320" y="220" fontSize="10" fill="#6b7280" textAnchor="middle">Jabalpur</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
