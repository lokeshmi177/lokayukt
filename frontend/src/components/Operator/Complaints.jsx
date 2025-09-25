// pages/Complaints.js
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaBuilding, 
  FaFileAlt, 
  FaSearch, 
  FaSave, 
  FaPaperPlane,
  FaRupeeSign,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Complaints = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    district_id: '',
    email: '',
    fee_exempted: false,                     // Changed to false - default unchecked
    amount: '',
    challan_no: '',
    title: '',          
    file: null,
    dob: '',
    department: '',     
    officer_name: '',
    designation: '',
    category: '',
    subject: '',        
    nature: '',
    description: '',
    complaint_id: ''
  });

  const navigate = useNavigate()
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Duplicate check states
  const [duplicate, setDuplicate] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  // NEW STATES FOR POPUP MODAL
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    name: '',
    title: ''
  });
  const [modalErrors, setModalErrors] = useState({});

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch districts
        const districtsResponse = await api.get(`/operator/all-district`);
        if (districtsResponse.data.status === 'success') {
          setDistricts(districtsResponse.data.data);
        }

        // Fetch departments
        const departmentsResponse = await api.get(`/operator/department`);
        if (departmentsResponse.data.status === 'success') {
          setDepartments(departmentsResponse.data.data);
        }

        // Fetch designations
        const designationsResponse = await api.get(`/operator/designation`);
        if (designationsResponse.data.status === 'success') {
          setDesignations(designationsResponse.data.data);
        }

        // Fetch subjects
        const subjectsResponse = await api.get(`/operator/subjects`);
        if (subjectsResponse.data.status === 'success') {
          setSubjects(subjectsResponse.data.data);
        }

        // Fetch complaint types
        const complaintTypesResponse = await api.get(`/operator/complainstype`);
        if (complaintTypesResponse.data.status === 'success') {
          setComplaintTypes(complaintTypesResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle radio button for fee_exempted
    if (name === 'fee_exempted') {
      const isExempted = value === 'true';
      setFormData(prev => ({
        ...prev,
        fee_exempted: isExempted,
        // Clear amount, challan_no AND dob when switching to exempted
        ...(isExempted && {
          amount: '',
          challan_no: '',
          dob: ''
        })
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // NEW FUNCTION: Open Duplicate Check Modal
  const handleOpenDuplicateModal = () => {
    setShowDuplicateModal(true);
    setModalFormData({ name: '', title: '' });
    setModalErrors({});
  };

  // NEW FUNCTION: Handle Modal Form Input Change
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (modalErrors[name]) {
      setModalErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // NEW FUNCTION: Handle Modal Submit (Modified)
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    
    // Validate modal form
    const newErrors = {};
    if (!modalFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!modalFormData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setModalErrors(newErrors);
      return;
    }

    setCheckingDuplicate(true);
    
    try {
      const response = await api.post('/operator/check-duplicate', {
        name: modalFormData.name,
        title: modalFormData.title
      });
      
      if (response.data.complaint) {
        // Duplicate found - Set the same states as original code
        setDuplicate(response.data.complaint);
        
        setDuplicateData({
          name: response.data.complaint.name,
          mobile: response.data.complaint.mobile,
          address: response.data.complaint.address,
          district_id: response.data.complaint.district_id,
          email: response.data.complaint.email,
          id: response.data.complaint.id
        });
        
        toast.info('Duplicate found! Click Merge to fill details.');
      } else {
        toast.info('No duplicate found');
        setDuplicate(null);
        setDuplicateData(null);
      }
    } catch (error) {
      console.error('Duplicate check error:', error);
      toast.info('No duplicate found');
      setDuplicate(null);
      setDuplicateData(null);
    } finally {
      setCheckingDuplicate(false);
      // CLOSE MODAL AFTER SUBMIT
      setShowDuplicateModal(false);
    }
  };

  // NEW FUNCTION: Close Modal
  const handleCloseModal = () => {
    setShowDuplicateModal(false);
    setModalFormData({ name: '', title: '' });
    setModalErrors({});
  };

  // Handle merge action (Original function unchanged)
  const handleMergeDuplicate = () => {
    if (duplicateData) {
      setFormData(prev => ({
        ...prev,
        name: duplicateData.name || '',
        mobile: duplicateData.mobile || '',
        address: duplicateData.address || '',
        district_id: duplicateData.district_id || '',
        email: duplicateData.email || '',
        complaint_id: duplicateData.id.toString() 
      }));
      
      toast.success('Data merged successfully!');
      setDuplicate(null); 
      setDuplicateData(null); 
    } else {
      toast.warning('No duplicate data found to merge');
    }
  };

  // Enhanced file upload - Now accepts ALL file types
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Reset upload states
    setUploadProgress(0);
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError('');

    // Simulate upload progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(100);
          setIsUploading(false);
          setUploadSuccess(true);
          setFormData(prev => ({
            ...prev,
            file: file
          }));
          clearInterval(interval);
        } else {
          setUploadProgress(Math.round(progress));
        }
      }, 200);
    };

    simulateUpload();

    // Clear error when user selects file
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(false);
    setUploadError('');
  };

  // Submit handler with FormData for file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === 'file' && formData.file) {
          submitFormData.append('file', formData.file);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      const response = await api.post('/operator/add-complaint', submitFormData);
      
      if (response.data.status === true) {
        toast.success(response.data.message || 'Complaint registered successfully!');

        // Reset form after successful submission
        setFormData({
          name: '',
          mobile: '',
          address: '',
          district_id: '',
          email: '',
          fee_exempted: false,  // Reset to false (unchecked)
          amount: '',
          challan_no: '',
          title: '',
          file: null,
          dob: '',
          department: '',
          officer_name: '',
          designation: '',
          category: '',
          subject: '',
          nature: '',
          description: '',
          complaint_id: ''
        });

        // Reset file upload states
        setUploadProgress(0);
        setIsUploading(false);
        setUploadSuccess(false);
        setUploadError('');
        
        // Reset duplicate states
        setDuplicate(null);
        setDuplicateData(null);
      }
    } catch (error) {
      if (error.response?.data?.status === false && error.response?.data?.errors) {
        // Handle validation errors
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((field) => {
          backendErrors[field] = error.response.data.errors[field];
        });
        setErrors(backendErrors);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
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

      {/* NEW MODAL FOR DUPLICATE CHECK */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Check Duplicates</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Name / नाम *
  </label>
  <input
    type="text"
    name="name"
    value={modalFormData.name}
    onChange={(e) => {
      // Copy-paste case handle (numbers/symbols हटाए)
      const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
      handleModalInputChange({
        target: { name: e.target.name, value: filteredValue },
      });
    }}
    onKeyDown={(e) => {
      // Typing के दौरान numbers/symbols block
      if (/[^a-zA-Z\u0900-\u097F\s]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
    placeholder="Enter Name"
  />
  {modalErrors.name && (
    <p className="mt-1 text-sm text-red-600">{modalErrors.name}</p>
  )}
</div>


                {/* Title Field */}
               <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Title / शीर्षक *
  </label>
  <input
    type="text"
    name="title"
    value={modalFormData.title}
    onChange={(e) => {
      // Copy-paste और typing दोनों handle करें
      const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
      handleModalInputChange({
        target: { name: e.target.name, value: filteredValue },
      });
    }}
    onKeyDown={(e) => {
      // Typing के दौरान numbers/symbols block
      if (/[^a-zA-Z\u0900-\u097F\s]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
    placeholder="Enter Title"
  />
  {modalErrors.title && (
    <p className="mt-1 text-sm text-red-600">{modalErrors.title}</p>
  )}
</div>

              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkingDuplicate}
                   style={{ backgroundColor: 'hsl(220, 70%, 25%)' }}
                  className={`px-4 py-2 text-sm font-medium text-white  border border-transparent rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                    checkingDuplicate ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {checkingDuplicate ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <FaSearch className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header with buttons exactly like image */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Complaint Entry</h1>
            <p className="text-xs sm:text-sm text-gray-600">शिकायत प्रविष्टि फॉर्म</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {/* Check Duplicates - Now opens modal */}
            <button 
              onClick={handleOpenDuplicateModal}
              className="px-4 py-2 bg-white border hover:bg-orange-400 border-gray-300 text-gray-700 rounded-md font-medium transition-all flex items-center gap-2"
            >
              <FaSearch className="w-4 h-4" />
              Check Duplicates
            </button>
            
            {/* Save Draft - White background */}
            <button 
              type="button"
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-orange-400 text-gray-700 rounded-md font-medium transition-all flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              Save Draft
            </button>

            {/* Submit for Review - hsl(220 70% 25%) background */}
            <button
              type="submit"
              form="complaint-form"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : 'text-white hover:opacity-90'
              }`}
              style={{ backgroundColor: 'hsl(220, 70%, 25%)' }}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="w-4 h-4" />
                  Submit for Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
{duplicate && (
  <div className="mb-6 border border-orange-400 bg-orange-50 rounded-lg shadow-sm p-2">
    {/* Header with Icon + Text */}
    <div className="flex items-center gap-2 px-2 pt-1">
      <div className="text-orange-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-orange-700 text-sm">
        Potential Duplicates Found
      </h3>
    </div>

    {/* Inner White Box */}
    <div className="bg-white rounded-md p-4 mt-2 flex items-center justify-between shadow-sm">
      {/* Left Content */}
      <div>
        <div className="text-sm font-semibold text-black">
          {duplicate.complain_no}
        </div>
        <div className="text-sm text-black">{duplicate.name}</div>
        <div className="text-sm text-gray-700">{duplicate.title}</div>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-3">
        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
          85% Match
        </span>
        <button className="border text-black hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded transition-colors">
          Compare
        </button>
        <button
          onClick={handleMergeDuplicate}
          style={{ backgroundColor: "hsl(220, 70%, 25%)" }}
          className="text-white px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-colors"
        >
          Merge
        </button>
      </div>
    </div>
  </div>
)}





      <form id="complaint-form" onSubmit={handleSubmit}>
        {/* Form Layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Top Row: Complainant Details + Security Fee */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Complainant Details - Grid Layout Like Image */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Complainant Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">शिकायतकर्ता विवरण</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Name and Mobile in 2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Name / नाम *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter Full Name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Mobile / मोबाइल *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value) && value.length <= 10) {
                          handleInputChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="10-Digit Mobile Number"
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address - Full Width */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address / पता *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Enter Complete Address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* District and Email in 2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* District */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      District / जिला *
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 cursor-pointer text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.district_code}>
                          {district.district_name}
                        </option>
                      ))}
                    </select>
                    {errors.district_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.district_id}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter Email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hidden Input Field for Duplicate Complaint ID */}
                <input
                  type="hidden"
                  name="complaint_id"
                  value={formData.complaint_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Security Fee */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaRupeeSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Security Fee</h2>
                  <p className="text-xs sm:text-sm text-gray-500">जमानत राशि</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Fee Exempted Checkbox with Toggle */}
                <div>
                  <div className="flex items-center rounded-md space-x-2">
                    <input
                      id="exempted"
                      name="fee_exempted"
                      type="checkbox"
                      checked={formData.fee_exempted}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          fee_exempted: isChecked,
                          // Clear fields when checking (exempted)
                          ...(isChecked && {
                            amount: '',
                            challan_no: '',
                            dob: ''
                          })
                        }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                      Fee Exempted / शुल्क माफ
                    </label>
                  </div>
                  {errors.fee_exempted && (
                    <p className="mt-1 text-sm text-red-600">{errors.fee_exempted}</p>
                  )}
                </div>

                {/* Show Amount, Challan No, Date only when fee is NOT exempted */}
                {!formData.fee_exempted && (
                  <>
                    {/* Amount */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Amount / राशि
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter Amount"
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                      )}
                    </div>

                    {/* Challan No */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Challan No. / चालान नं.
                      </label>
                      <input
                        type="text"
                        name="challan_no"
                        value={formData.challan_no}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter Challan Number"
                      />
                      {errors.challan_no && (
                        <p className="mt-1 text-sm text-red-600">{errors.challan_no}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Date / दिनांक
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      {errors.dob && (
                        <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

           {/* Outside Correspondence - Separate section like image */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Outside Correspondence</h2>
                <p className="text-xs sm:text-sm text-gray-500">बाहरी पत्राचार</p>
              </div>
            </div>

            {/* Title and File Upload in 2 grid like image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Title Field */}
            <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
    Title / शीर्षक *
  </label>
  <input
    type="text"
    name="title"
    value={formData.title}
    onChange={(e) => {
      // copy-paste case handle karega (filter out unwanted chars)
      const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
      handleInputChange({
        target: { name: e.target.name, value: filteredValue },
      });
    }}
    onKeyDown={(e) => {
      // typing ke waqt numbers aur symbols block karega
      if (/[^a-zA-Z\u0900-\u097F\s]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
    placeholder="Enter Complaint Title"
  />
  {errors.title && (
    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
  )}
</div>


              {/* File Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Choose File / फ़ाइल चुनें
                </label>
                
                {/* File Upload Area */}
                {!formData.file ? (
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <FaUpload className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm text-gray-700">Choose File</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      /> 
                    </label>
                  </div>
                ) : (
                  // File Selected Area
                  <div className="border border-gray-300 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FaFileAlt className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {formData.file.name}
                        </span>
                        {uploadSuccess && (
                          <FaCheck className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        disabled={isUploading}
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {(isUploading || uploadProgress > 0) && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Upload Status */}
                    {uploadSuccess && (
                      <p className="text-xs text-green-600 flex items-center">
                        <FaCheck className="w-3 h-3 mr-1" />
                        Upload completed successfully
                      </p>
                    )}

                    {/* File Size */}
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Respondent Department - Full Width */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Respondent Department</h2>
                <p className="text-xs sm:text-sm text-gray-500">प्रतिवादी विभाग</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Department / विभाग *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 cursor-pointer text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.name_hindi})
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Officer Name */}
              <div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
    Officer Name / अधिकारी का नाम *
  </label>
  <input
    type="text"
    name="officer_name"
    value={formData.officer_name}
    onChange={(e) => {
      // Copy-paste case handle करेगा (numbers/symbols हटा देगा)
      const filteredValue = e.target.value.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "");
      handleInputChange({
        target: { name: e.target.name, value: filteredValue },
      });
    }}
    onKeyDown={(e) => {
      // Typing के वक्त numbers/symbols block करेगा
      if (/[^a-zA-Z\u0900-\u097F\s]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
    placeholder="Enter Officer Name"
  />
  {errors.officer_name && (
    <p className="mt-1 text-sm text-red-600">{errors.officer_name}</p>
  )}
</div>


              {/* Designation */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Designation / पदनाम *
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Designation</option>
                  {designations.map(designation => (
                    <option key={designation.id} value={designation.id}>
                      {designation.name} ({designation.name_h})
                    </option>
                  ))}
                </select>
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.designation}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category / श्रेणी *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="class_1">Class 1</option>
                  <option value="class_2">Class 2</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details - Full Width */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Complaint Details</h2>
                <p className="text-xs sm:text-sm text-gray-500">शिकायत विवरण</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Subject Dropdown */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Subject / विषय *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.name_h})
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Nature */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nature / प्रकृति *
                  </label>
                  <select
                    name="nature"
                    value={formData.nature}
                    onChange={handleInputChange}
                    className="w-full cursor-pointer px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Nature</option>
                    {complaintTypes.map(complaintType => (
                      <option key={complaintType.id} value={complaintType.id}>
                        {complaintType.name} ({complaintType.name_h})
                      </option>
                    ))}
                  </select>
                  {errors.nature && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nature}
                    </p>
                  )}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Detailed Description / विस्तृत विवरण *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Enter Detailed Complaint Description..."
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Complaints;
