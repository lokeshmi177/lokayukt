// pages/MasterData.js
import React, { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDatabase,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaFileAlt
} from 'react-icons/fa';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('districts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const districts = [
    { id: '1', name: 'Bhopal', nameHi: 'भोपाल', code: 'BPL', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'Indore', nameHi: 'इंदौर', code: 'IDR', status: 'active', createdAt: '2023-01-01' },
    { id: '3', name: 'Gwalior', nameHi: 'ग्वालियर', code: 'GWL', status: 'active', createdAt: '2023-01-01' },
    { id: '4', name: 'Ujjain', nameHi: 'उज्जैन', code: 'UJN', status: 'active', createdAt: '2023-01-01' },
    { id: '5', name: 'Jabalpur', nameHi: 'जबलपुर', code: 'JBP', status: 'active', createdAt: '2023-01-01' },
  ];

  const departments = [
    { id: '1', name: 'Revenue Department', nameHi: 'राजस्व विभाग', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'PWD', nameHi: 'लोक निर्माण विभाग', status: 'active', createdAt: '2023-01-01' },
    { id: '3', name: 'Social Welfare', nameHi: 'समाज कल्याण', status: 'active', createdAt: '2023-01-01' },
    { id: '4', name: 'Rural Development', nameHi: 'ग्रामीण विकास', status: 'active', createdAt: '2023-01-01' },
    { id: '5', name: 'Education', nameHi: 'शिक्षा विभाग', status: 'active', createdAt: '2023-01-01' },
  ];

  const subjects = [
    { id: '1', name: 'Corruption', nameHi: 'भ्रष्टाचार', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'Misuse of Power', nameHi: 'शक्ति का दुरुपयोग', status: 'active', createdAt: '2023-01-01' },
    { id: '3', name: 'Delay in Work', nameHi: 'कार्य में देरी', status: 'active', createdAt: '2023-01-01' },
    { id: '4', name: 'Wrong Information', nameHi: 'गलत जानकारी', status: 'active', createdAt: '2023-01-01' },
    { id: '5', name: 'Procedural Issues', nameHi: 'प्रक्रियागत समस्याएं', status: 'active', createdAt: '2023-01-01' },
  ];

  const designations = [
    { id: '1', name: 'Collector', nameHi: 'कलेक्टर', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'SDM', nameHi: 'एसडीएम', status: 'active', createdAt: '2023-01-01' },
    { id: '3', name: 'Tehsildar', nameHi: 'तहसीलदार', status: 'active', createdAt: '2023-01-01' },
    { id: '4', name: 'BDO', nameHi: 'बीडीओ', status: 'active', createdAt: '2023-01-01' },
    { id: '5', name: 'Executive Engineer', nameHi: 'कार्यपालन अभियंता', status: 'active', createdAt: '2023-01-01' },
  ];

  const complaintTypes = [
    { id: '1', name: 'Allegation', nameHi: 'आरोप', description: 'Corruption allegations', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'Grievance', nameHi: 'शिकायत', description: 'General grievances', status: 'active', createdAt: '2023-01-01' },
  ];

  const rejectionReasons = [
    { id: '1', name: 'Insufficient Evidence', nameHi: 'अपर्याप्त साक्ष्य', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'Outside Jurisdiction', nameHi: 'क्षेत्राधिकार से बाहर', status: 'active', createdAt: '2023-01-01' },
    { id: '3', name: 'Anonymous Complaint', nameHi: 'गुमनाम शिकायत', status: 'active', createdAt: '2023-01-01' },
    { id: '4', name: 'Duplicate Complaint', nameHi: 'डुप्लिकेट शिकायत', status: 'active', createdAt: '2023-01-01' },
  ];

  const masterDataTabs = [
    { id: 'districts', label: 'Districts', labelHi: 'जिले', icon: FaMapMarkerAlt, data: districts },
    { id: 'departments', label: 'Departments', labelHi: 'विभाग', icon: FaBuilding, data: departments },
    { id: 'subjects', label: 'Subjects', labelHi: 'विषय', icon: FaFileAlt, data: subjects },
    { id: 'designations', label: 'Designations', labelHi: 'पदनाम', icon: FaUsers, data: designations },
    { id: 'complaint-types', label: 'Complaint Types', labelHi: 'शिकायत प्रकार', icon: FaFileAlt, data: complaintTypes },
    { id: 'rejection-reasons', label: 'Rejection Reasons', labelHi: 'अस्वीकृति कारण', icon: FaFileAlt, data: rejectionReasons },
  ];

  const MasterDataTable = ({ data, title }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaDatabase className="w-5 h-5" />
          {title}
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          <FaPlus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Table */}
      <div className="p-3 sm:p-4 overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Name (English)</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Name (Hindi)</th>
              {activeTab === 'districts' && (
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Code</th>
              )}
              {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Description</th>
              )}
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Status</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Created</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 sm:py-3 px-2 sm:px-3 font-medium text-gray-900">{item.name}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">{item.nameHi}</td>
                {activeTab === 'districts' && (
                  <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">{item.code}</td>
                )}
                {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
                  <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-700">{item.description}</td>
                )}
                <td className="py-2 sm:py-3 px-2 sm:px-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-600">{item.createdAt}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-3">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
                      <FaEdit className="w-3 h-3" />
                    </button>
                    <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="px-4 py-3 border-b text-lg font-semibold">Add New {title}</div>
            <div className="p-4 space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                <input id="name" className="w-full p-2 border rounded-md" placeholder="Enter name" />
              </div>
              <div>
                <label htmlFor="nameHi" className="block text-sm font-medium text-gray-700 mb-1">Name (Hindi)</label>
                <input id="nameHi" className="w-full p-2 border rounded-md" placeholder="हिंदी में नाम दर्ज करें" />
              </div>
              {activeTab === 'districts' && (
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">District Code</label>
                  <input id="code" className="w-full p-2 border rounded-md" placeholder="Enter 3-letter code" />
                </div>
              )}
              {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input id="description" className="w-full p-2 border rounded-md" placeholder="Enter description" />
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Master Data / मास्टर डेटा</h1>
        <button className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
          <FaDatabase className="w-4 h-4" />
          Backup Data
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {masterDataTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4">
          {masterDataTabs.map((tab) =>
            activeTab === tab.id ? (
              <MasterDataTable key={tab.id} data={tab.data} title={`${tab.label} / ${tab.labelHi}`} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterData;
