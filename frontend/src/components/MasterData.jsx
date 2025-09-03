// pages/MasterData.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDatabase,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaFileAlt,
  FaSpinner
} from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
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

// Separate Edit Modal Component to prevent re-rendering issues
const EditModal = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  editingItem, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && editingItem) {
      setFormData({
        name: editingItem.name || '',
        nameHi: editingItem.nameHi || '',
        description: editingItem.description || ''
      });
    }
  }, [isOpen, editingItem]);

  // Memoized input change handler to prevent re-creation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let endpoint = '';
      let requestData = {};

      switch (activeTab) {
        case 'departments':
          endpoint = `/edit-department/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_hindi: formData.nameHi
          };
          break;
        case 'subjects':
          endpoint = `/edit-subject/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi
          };
          break;
        case 'designations':
          endpoint = `/edit-designation/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi
          };
          break;
        case 'complaint-types':
          endpoint = `/edit-complainstype/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi,
            description: formData.description
          };
          break;
        case 'rejection-reasons':
          endpoint = `/edit-rejection/${editingItem.id}`;
          requestData = {
            name: formData.name,
            name_h: formData.nameHi,
            description: formData.description
          };
          break;
        default:
          toast.error('Invalid tab selected');
          return;
      }

      const response = await api.post(endpoint, requestData);

      if (response.data.status === true) {
        toast.success(response.data.message || 'Item updated successfully!');
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Error updating item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b text-lg font-semibold">
          Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (English) *
              </label>
              <input 
                key="edit-name" // Stable key to prevent re-mounting
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter name"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Hindi) *
              </label>
              <input 
                key="edit-nameHi" // Stable key to prevent re-mounting
                name="nameHi"
                type="text"
                value={formData.nameHi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="हिंदी में नाम दर्ज करें"
                required
                autoComplete="off"
              />
            </div>
            {(activeTab === 'complaint-types' || activeTab === 'rejection-reasons') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  key="edit-description" // Stable key to prevent re-mounting
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter description"
                  rows="3"
                  autoComplete="off"
                />
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('districts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State for all master data
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState([]);

  // Fetch all master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // Fetch districts
        const districtsResponse = await api.get('/all-district');
        if (districtsResponse.data.status === 'success') {
          const districtsData = districtsResponse.data.data.map(item => ({
            id: item.id,
            name: item.district_name,
            nameHi: item.dist_name_hi,
            code: item.district_name.substring(0, 3).toUpperCase(),
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setDistricts(districtsData);
        }

        // Fetch departments
        const departmentsResponse = await api.get('/department');
        if (departmentsResponse.data.status === 'success') {
          const departmentsData = departmentsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_hindi,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setDepartments(departmentsData);
        }

        // Fetch subjects
        const subjectsResponse = await api.get('/subjects');
        if (subjectsResponse.data.status === 'success') {
          const subjectsData = subjectsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setSubjects(subjectsData);
        }

        // Fetch designations
        const designationsResponse = await api.get('/designation');
        if (designationsResponse.data.status === 'success') {
          const designationsData = designationsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setDesignations(designationsData);
        }

        // Fetch complaint types
        const complaintTypesResponse = await api.get('/complainstype');
        if (complaintTypesResponse.data.status === 'success') {
          const complaintTypesData = complaintTypesResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            description: item.description,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setComplaintTypes(complaintTypesData);
        }

        // Fetch rejection reasons
        const rejectionReasonsResponse = await api.get('/rejections');
        if (rejectionReasonsResponse.data.status === 'success') {
          const rejectionReasonsData = rejectionReasonsResponse.data.data.map(item => ({
            id: item.id,
            name: item.name,
            nameHi: item.name_h,
            description: item.description,
            status: item.status === '1' ? 'active' : 'inactive',
            createdAt: new Date(item.created_at).toISOString().split('T')[0]
          }));
          setRejectionReasons(rejectionReasonsData);
        }

      } catch (error) {
        console.error('Error fetching master data:', error);
        toast.error('Error fetching data');
      }
    };

    fetchMasterData();
  }, []);

  // Memoized handle edit function
  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  }, []);

  // Handle edit save
  const handleEditSave = useCallback((formData) => {
    const updatedItem = {
      ...editingItem,
      name: formData.name,
      nameHi: formData.nameHi,
      description: formData.description
    };

    switch (activeTab) {
      case 'departments':
        setDepartments(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'subjects':
        setSubjects(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'designations':
        setDesignations(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'complaint-types':
        setComplaintTypes(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
      case 'rejection-reasons':
        setRejectionReasons(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        break;
    }
  }, [activeTab, editingItem]);

  // Close edit modal
  const handleEditClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  }, []);

  const masterDataTabs = [
    { id: 'districts', label: 'Districts', labelHi: 'जिले', icon: FaMapMarkerAlt, data: districts, iconColor: 'text-red-600' },
    { id: 'departments', label: 'Departments', labelHi: 'विभाग', icon: FaBuilding, data: departments, iconColor: 'text-blue-600' },
    { id: 'subjects', label: 'Subjects', labelHi: 'विषय', icon: FaFileAlt, data: subjects, iconColor: 'text-green-600' },
    { id: 'designations', label: 'Designations', labelHi: 'पदनाम', icon: FaUsers, data: designations, iconColor: 'text-purple-600' },
    { id: 'complaint-types', label: 'Complaint Types', labelHi: 'शिकायत प्रकार', icon: FaFileAlt, data: complaintTypes, iconColor: 'text-orange-600' },
    { id: 'rejection-reasons', label: 'Rejection Reasons', labelHi: 'अस्वीकृति कारण', icon: FaFileAlt, data: rejectionReasons, iconColor: 'text-pink-600' },
  ];

  const MasterDataTable = ({ data, title }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaDatabase className="w-5 h-5 text-indigo-600" />
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
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 text-gray-600">{item.createdAt}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-3">
                  <div className="flex gap-2">
                    {activeTab !== 'districts' && (
                      <button 
                        onClick={() => handleEdit(item)}
                        className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                        title="Edit"
                      >
                        <FaEdit className="w-3 h-3 text-blue-600" />
                      </button>
                    )}
                    <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50" title="Delete">
                      <FaTrash className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="px-4 py-3 border-b text-lg font-semibold">Add New {activeTab}</div>
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
      
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Master Data / मास्टर डेटा</h1>
          <button className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            <FaDatabase className="w-4 h-4 text-slate-600" />
            Backup Data
          </button>
        </div>

        {/* Tabs Component with Dashboard-like styling */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation with Dashboard styling */}
          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {masterDataTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1 ${
                      activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : ""
                    }`}
                  >
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${tab.iconColor}`} />
                    <span className="hidden md:inline text-xs lg:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4">
              {masterDataTabs.map((tab) =>
                activeTab === tab.id ? (
                  <div key={tab.id} className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <MasterDataTable data={tab.data} title={`${tab.label} / ${tab.labelHi}`} />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        activeTab={activeTab}
        editingItem={editingItem}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default MasterData;
