import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaBuilding, 
  FaFileAlt, 
  FaArrowLeft,
  FaPaperPlane,
  FaRupeeSign,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaTimes,
  FaPlus,
  FaTrash,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const APP_URL = BASE_URL.replace("/api", ""); // File URLs के लिए
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllComplaintsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    district_id: '',
    email: '',
    fee_exempted: true,
    amount: '',
    challan_no: '',
    dob: '',
  });

  // Multiple complaint details state
  const [complaintDetails, setComplaintDetails] = useState([
    {
      id: null,
      title: '',
      file: null,
      department: '',
      officer_name: '',
      designation: '',
      category: '',
      subject: '',
      nature: '',
      description: '',
      existingFile: null,
      uploadProgress: 0,
      isUploading: false,
      uploadSuccess: false,
      uploadError: ''
    }
  ]);

  // File preview states
  const [filePreviewData, setFilePreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Dropdown data states
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  
  // Only backend errors - no frontend validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // File helper functions
  const handleFileDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file available for download");
      return;
    }
    
    const fileUrl = `${APP_URL}${filePath}`;
    window.open(fileUrl, "_blank");
  };

  const handleFilePreview = (filePath) => {
    if (filePath) {
      setCurrentPreviewFile(filePath);
      setShowPreview(true);
    } else {
      toast.error("File preview not available");
    }
  };

  const isPDF = (filePath) => {
    return filePath && filePath.toLowerCase().endsWith(".pdf");
  };

  const isImage = (filePath) => {
    return filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  };

  // PDF Preview Modal Component
  const PDFPreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">File Preview</h3>
            <button
              onClick={() => {
                setShowPreview(false);
                setCurrentPreviewFile(null);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4">
            {currentPreviewFile ? (
              <>
                {isPDF(currentPreviewFile) ? (
                  <iframe
                    src={`${APP_URL}${currentPreviewFile}`}
                    className="w-full h-full border rounded"
                    title="PDF Preview"
                  />
                ) : isImage(currentPreviewFile) ? (
                  <img
                    src={`${APP_URL}${currentPreviewFile}`}
                    alt="File Preview"
                    className="max-w-full max-h-full mx-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Preview not supported for this file type</p>
                      <button
                        onClick={() => handleFileDownload(currentPreviewFile)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No File Available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Fetch complaint data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No complaint ID provided");
        navigate("/operator/all-complaints");
        return;
      }

      try {
        setIsLoading(true);

        const [
          complaintResponse,
          districtsResponse,
          departmentsResponse,
          designationsResponse,
          subjectsResponse,
          complaintTypesResponse
        ] = await Promise.all([
          api.get(`/operator/edit-complaint/${id}`),
          api.get(`/operator/all-district`),
          api.get(`/operator/department`),
          api.get(`/operator/designation`),
          api.get(`/operator/subjects`),
          api.get(`/operator/complainstype`)
        ]);

        // Set dropdown data
        if (districtsResponse.data.status === 'success') {
          setDistricts(districtsResponse.data.data);
        }
        if (departmentsResponse.data.status === 'success') {
          setDepartments(departmentsResponse.data.data);
        }
        if (designationsResponse.data.status === 'success') {
          setDesignations(designationsResponse.data.data);
        }
        if (subjectsResponse.data.status === 'success') {
          setSubjects(subjectsResponse.data.data);
        }
        if (complaintTypesResponse.data.status === 'success') {
          setComplaintTypes(complaintTypesResponse.data.data);
        }

        // Set complaint data
        if (complaintResponse.data.status === true) {
          const data = complaintResponse.data.data;
          
          // Set basic form data
          setFormData({
            name: data.name || '',
            mobile: data.mobile || '',
            address: data.address || '',
            district_id: data.district_id || '',
            email: data.email || '',
            fee_exempted: data.fee_exempted === 1,
            amount: data.amount || '',
            challan_no: data.challan_no || '',
            dob: data.dob || '',
          });

          // Set multiple complaint details
          if (data.details && data.details.length > 0) {
            const detailsArray = data.details.map((detail, index) => {
              return {
                id: detail.id,
                title: detail.title || '',
                file: null,
                department: detail.department_id || '',
                officer_name: detail.officer_name || '',
                designation: detail.designation_id || '',
                category: detail.category || '',
                subject: detail.subject_id || '',
                nature: detail.complaintype_id || '',
                description: detail.description || '',
                existingFile: detail.file || null,
                uploadProgress: 0,
                isUploading: false,
                uploadSuccess: false,
                uploadError: ''
              };
            });
            
            setComplaintDetails(detailsArray);
          }

          // File preview data fetching
          try {
            const fileResponse = await api.get(`/operator/get-file-preview/${id}`);
            if (fileResponse.data.status === true) {
              setFilePreviewData(fileResponse.data.data || []);
            }
          } catch (fileErr) {
            setFilePreviewData([]);
          }

        } else {
          toast.error("Failed to load complaint data");
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error("Error loading complaint data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fee_exempted') {
      setFormData(prev => ({
        ...prev,
        fee_exempted: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear backend error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle complaint detail changes
  const handleDetailChange = (index, field, value) => {
    setComplaintDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });

    // Clear backend errors for details fields
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle file change for specific detail
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type (only PDF allowed)
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }

    // Update the specific detail
    setComplaintDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        uploadProgress: 0,
        isUploading: true,
        uploadSuccess: false,
        uploadError: ''
      };
      return updated;
    });

    // Simulate upload progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setComplaintDetails(prev => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              file: file,
              uploadProgress: 100,
              isUploading: false,
              uploadSuccess: true
            };
            return updated;
          });
          clearInterval(interval);
        } else {
          setComplaintDetails(prev => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              uploadProgress: Math.round(progress)
            };
            return updated;
          });
        }
      }, 200);
    };

    simulateUpload();
  };

  // Remove file for specific detail
  const handleRemoveFile = (index) => {
    setComplaintDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        file: null,
        uploadProgress: 0,
        isUploading: false,
        uploadSuccess: false,
        uploadError: ''
      };
      return updated;
    });
  };

  // UPDATED Submit handler - Only backend validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      // Prepare data in array format
      const submitData = {
        // Basic form fields
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        district_id: formData.district_id,
        email: formData.email,
        fee_exempted: formData.fee_exempted ? '1' : '0',
        amount: formData.amount || '',
        challan_no: formData.challan_no || '',
        dob: formData.dob || '',
        
        // Details arrays
        title: complaintDetails.map(item => item.title),
        department: complaintDetails.map(item => item.department),
        officer_name: complaintDetails.map(item => item.officer_name),
        designation: complaintDetails.map(item => item.designation),
        category: complaintDetails.map(item => item.category),
        subject: complaintDetails.map(item => item.subject),
        nature: complaintDetails.map(item => item.nature),
        description: complaintDetails.map(item => item.description),
        
        // IDs array for existing records
        detail_ids: complaintDetails.map(item => item.id).filter(id => id !== null)
      };

      // Use FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add basic fields
      Object.keys(submitData).forEach(key => {
        if (Array.isArray(submitData[key])) {
          submitData[key].forEach((value, index) => {
            formDataToSend.append(`${key}[]`, value || '');
          });
        } else {
          formDataToSend.append(key, submitData[key]);
        }
      });
      
      // Add files in array format
      complaintDetails.forEach((detail, index) => {
        if (detail.file) {
          formDataToSend.append(`files[]`, detail.file);
        }
      });

      // Submit using api.post
      const response = await api.post(`/operator/update-complaint/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.status === true) {
        toast.success(response.data.message || 'Complaint updated successfully!');
        
        // Navigate back to view page after successful update
        setTimeout(() => {
          navigate(`/operator/all-complaints/view/${id}`);
        }, 1500);
      }
    } catch (error) {
      // ONLY backend error handling - exactly as you requested
      if (error.response?.data?.status === false && error.response?.data?.errors) {
        const backendErrors = {};
        
        // Convert array errors to single error messages
        Object.keys(error.response.data.errors).forEach(field => {
          // API returns array like: "name": ["Name is required."]
          // We take first error from array
          if (Array.isArray(error.response.data.errors[field])) {
            backendErrors[field] = error.response.data.errors[field][0];
          } else {
            backendErrors[field] = error.response.data.errors[field];
          }
        });
        
        setErrors(backendErrors);
        
        // Show first error as toast
        const firstError = Object.values(backendErrors)[0];
        toast.error(firstError);
        
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

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

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Complaint</h1>
            <p className="text-xs sm:text-sm text-gray-600">शिकायत संपादन फॉर्म</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => navigate(`/operator/all-complaints/view/${id}`)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <IoMdArrowBack className="text-lg" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">

          {/* Top Row: Complainant Details + Security Fee */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Complainant Details */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Complainant Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">शिकायतकर्ता विवरण</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Name / नाम *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {/* Only backend error display */}
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address / पता *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    District / जिला *
                  </label>
                  <select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 cursor-pointer text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                      errors.district_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.district_code}>
                        {district.district_name}
                      </option>
                    ))}
                  </select>
                  {errors.district_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.district_id}</p>
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
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
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
                {/* Fee Exempted Radio */}
                <div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="exempted"
                        name="fee_exempted"
                        type="radio"
                        value="true"
                        checked={formData.fee_exempted === true}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                        Fee Exempted / शुल्क माफ
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="not_exempted"
                        name="fee_exempted"
                        type="radio"
                        value="false"
                        checked={formData.fee_exempted === false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="not_exempted" className="text-xs sm:text-sm font-medium text-gray-700">
                        Fee Paid / शुल्क भुगतान
                      </label>
                    </div>
                  </div>
                  {errors.fee_exempted && (
                    <p className="mt-1 text-sm text-red-600">{errors.fee_exempted}</p>
                  )}
                </div>

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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                    placeholder="Enter amount"
                    disabled={formData.fee_exempted}
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                    placeholder="Enter challan number"
                    disabled={formData.fee_exempted}
                  />
                  {errors.challan_no && (
                    <p className="mt-1 text-sm text-red-600">{errors.challan_no}</p>
                  )}
                </div>

                {/* Date of Birth - show only if NOT exempted */}
                {!formData.fee_exempted && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Date of Birth / जन्म तिथि
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
                )}
              </div>
            </div>
          </div>

          {/* Multiple Complaint Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Complaint Details</h2>
            </div>

            {complaintDetails.map((detail, index) => {
              const correspondingFile = filePreviewData[index] || null;

              return (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          Complaint Detail #{index + 1}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">शिकायत विवरण</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Title and File Upload Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="hidden" 
                    name="Complaint_id"
                    value={detail.id}
                     />
                      {/* Title */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Title / शीर्षक *
                        </label>
                        <input
                          type="text"
                          value={detail.title}
                          onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter complaint title"
                        />
                        {/* Backend error display */}
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Choose File / फ़ाइल चुनें
                        </label>
                        
                       

                         {/* <button
                                  type="button"
                                  onClick={() => handleFileDownload(correspondingFile)}
                                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 hover:bg-green-200 rounded text-xs transition-colors"
                                >
                                  <FaDownload className="w-3 h-3" />
                                  Download
                                </button> */}
                        
                        {/* File Upload Area */}
                        {!detail.file ? (
                          <div className="flex items-center space-x-2">
                            <label className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                              <FaUpload className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-sm text-gray-700">Choose PDF file</span>
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange(index, e)}
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
                                  {detail.file.name}
                                </span>
                                {detail.uploadSuccess && (
                                  <FaCheck className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                disabled={detail.isUploading}
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Progress Bar */}
                            {(detail.isUploading || detail.uploadProgress > 0) && (
                              <div className="mb-2">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Uploading...</span>
                                  <span>{detail.uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${detail.uploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Upload Status */}
                            {detail.uploadSuccess && (
                              <p className="text-xs text-green-600 flex items-center">
                                <FaCheck className="w-3 h-3 mr-1" />
                                Upload completed successfully
                              </p>
                            )}

                            {/* File Size */}
                            <p className="text-xs text-gray-500 mt-1">
                              Size: {(detail.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between">

                        <p className="mt-1 text-xs text-gray-500">Only PDF files allowed (Max: 5MB)</p>
                        <button
                                  type="button"
                                  onClick={() => handleFileDownload(correspondingFile)}
                                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 mt-1 hover:bg-green-200 rounded text-xs transition-colors"
                                >
                                  <FaDownload className="w-3 h-3" />
                                  Download
                                </button>
                        </div>
                      </div>
                    </div>

                    {/* Department Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {/* Department */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Department / विभाग *
                        </label>
                        <select
                          value={detail.department}
                          onChange={(e) => handleDetailChange(index, 'department', e.target.value)}
                          className={`w-full px-3 py-2 cursor-pointer text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                            errors.department ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Department</option>
                          {departments.map(department => (
                            <option key={department.id} value={department.id}>
                              {department.name} ({department.name_hindi})
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                        )}
                      </div>

                      {/* Officer Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Officer Name / अधिकारी का नाम *
                        </label>
                        <input
                          type="text"
                          value={detail.officer_name}
                          onChange={(e) => handleDetailChange(index, 'officer_name', e.target.value)}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.officer_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter officer name"
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
                          value={detail.designation}
                          onChange={(e) => handleDetailChange(index, 'designation', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                            errors.designation ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Designation</option>
                          {designations.map(designation => (
                            <option key={designation.id} value={designation.id}>
                              {designation.name} ({designation.name_h})
                            </option>
                          ))}
                        </select>
                        {errors.designation && (
                          <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Category / श्रेणी *
                        </label>
                        <select
                          value={detail.category}
                          onChange={(e) => handleDetailChange(index, 'category', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Category</option>
                          <option value="class_1">Class 1</option>
                          <option value="class_2">Class 2</option>
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject and Nature Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {/* Subject */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Subject / विषय *
                        </label>
                        <select
                          value={detail.subject}
                          onChange={(e) => handleDetailChange(index, 'subject', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                            errors.subject ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name} ({subject.name_h})
                            </option>
                          ))}
                        </select>
                        {errors.subject && (
                          <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                        )}
                      </div>

                      {/* Nature */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Nature / प्रकृति *
                        </label>
                        <select
                          value={detail.nature}
                          onChange={(e) => handleDetailChange(index, 'nature', e.target.value)}
                          className={`w-full cursor-pointer px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${
                            errors.nature ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Nature</option>
                          {complaintTypes.map(complaintType => (
                            <option key={complaintType.id} value={complaintType.id}>
                              {complaintType.name} ({complaintType.name_h})
                            </option>
                          ))}
                        </select>
                        {errors.nature && (
                          <p className="mt-1 text-sm text-red-600">{errors.nature}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Detailed Description / विस्तृत विवरण *
                      </label>
                      <textarea
                        value={detail.description}
                        onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter detailed complaint description..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
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
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Update Complaint
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && <PDFPreviewModal />}
    </div>
  );
};

export default AllComplaintsEdit;
