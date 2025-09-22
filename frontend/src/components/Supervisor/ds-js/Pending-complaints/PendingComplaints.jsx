"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSearch,
  FaChevronDown,
  FaUser,
  FaUserTie,
  FaCrown,
  FaUsers,
  FaTimes,
  FaSpinner,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Custom Searchable Select Component - ID save होगी, Name display होगी
const CustomSearchableSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select option...",
  required = false,
  name = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options based on search (केवल name में search)
  const filteredOptions = () => {
    if (!searchTerm.trim()) return options;
    
    return options.filter(option => 
      option.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue); // यहाँ ID pass होती है
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      {/* Hidden select element - यह form submit के लिए है */}
      <select
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="sr-only"
        tabIndex={-1}
      >
        <option value="">-- Select Option --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.value} {/* केवल ID submit होगी */}
          </option>
        ))}
      </select>

      {/* Custom Dropdown Button - केवल name दिखेगा */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 pl-10 pr-8 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left cursor-pointer flex items-center justify-between"
      >
        <span className="flex items-center">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className="ml-2">{selectedOption.displayName}</span>
            </>
          ) : (
            <>
              <FaUsers className="w-4 h-4 text-gray-400" />
              <span className="ml-2 text-gray-500">{placeholder}</span>
            </>
          )}
        </span>
        <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions().length > 0 ? (
              <>
                {/* Dealing Assistant Header */}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center">
                  <FaUsers className="w-4 h-4 text-blue-500" />
                  <span className="ml-2">Dealing Assistant</span>
                </div>
                
                {/* Dealing Assistant Options - केवल name दिखेगा */}
                {filteredOptions()
                  .filter(option => option.type === 'assistant')
                  .map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-sm border-b border-gray-100 last:border-b-0"
                    >
                      {item.icon}
                      <span className="ml-2 font-medium text-gray-800">
                        {item.displayName}
                      </span>
                      {value === item.value && (
                        <FaUsers className="ml-auto w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Forward Modal Component
const ForwardModal = ({ 
  isOpen, 
  onClose, 
  complaintId,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    forwardTo: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Fetch dealing assistants from API
  useEffect(() => {
    const fetchDealingAssistants = async () => {
      if (!isOpen) return;
      
      setIsLoadingOptions(true);
      try {
        const response = await api.get("/supervisor/get-dealing-assistant");
        
        if (response.data && Array.isArray(response.data)) {
          // Options बनाते time: value में ID (string), display में name
          const assistantOptions = response.data.map(assistant => ({
            value: assistant.id.toString(), 
            displayName: assistant.name,    
            icon: <FaUser className="w-4 h-4 text-blue-500" />,
            type: 'assistant'
          }));
       
          setDropdownOptions(assistantOptions);
        } else {
          // अगर data नहीं मिला या empty है
          setDropdownOptions([]);
          toast.warning("No dealing assistants found");
        }
      } catch (error) {
        console.error("Error fetching dealing assistants:", error);
        
        // Error के case में empty array set करें
        setDropdownOptions([]);
        
        // User को error message दें
        toast.error("Failed to load dealing assistants. Please try again.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchDealingAssistants();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        forwardTo: '',
        remarks: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.forwardTo) {
      toast.error("Please select a user to forward to");
      return;
    }

    if (!formData.remarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post(`/supervisor/forward-by-so/${complaintId}`, {
        forward_to_d_a: parseInt(formData.forwardTo),
        remarks: formData.remarks
      });

      console.log("API Response:", response.data);

      // ✅ Check for success response based on your API
      if (response.data.success || response.data.status === true || response.status === 200) {
        toast.success(response.data.message || 'Complaint forwarded successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // ✅ Pass the complaint ID to parent for local update
        onSubmit(complaintId); // Pass complaint ID to parent
        onClose(); // Close modal
      } else {
        toast.error(response.data.message || 'Error forwarding complaint');
      }
    } catch (error) {
      console.error("Forward error:", error);
      console.error("Error response:", error.response);
      
      // Handle specific error responses
      if (error.response?.status === 404) {
        toast.error("API endpoint not found. Please check the server configuration.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to forward this complaint.");
      } else if (error.response?.status === 422) {
        // Validation errors
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach(key => {
            toast.error(errors[key][0]);
          });
        } else {
          toast.error("Validation failed. Please check your input.");
        }
      } else {
        toast.error('Error forwarding complaint. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Forward Complaint</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forward To / भेजें *
              </label>
              
              {isLoadingOptions ? (
                <div className="w-full p-2 border rounded-md bg-gray-50 flex items-center justify-center">
                  <FaSpinner className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-500 text-sm">Loading options...</span>
                </div>
              ) : (
                <CustomSearchableSelect
                  name="forward_to_d_a"
                  value={formData.forwardTo}
                  onChange={(value) => {
                    console.log("Selected ID:", value);
                    setFormData(prev => ({ ...prev, forwardTo: value }))
                  }}
                  options={dropdownOptions}
                  placeholder="Select"
                  required
                />
              )}
              
              {/* Debug के लिए - production में remove करें */}
              {formData.forwardTo && (
                <div className="mt-1 text-xs text-gray-500">
                  Selected ID: {formData.forwardTo} 
                  {dropdownOptions.find(opt => opt.value === formData.forwardTo) && 
                    ` (${dropdownOptions.find(opt => opt.value === formData.forwardTo).displayName})`
                  }
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks / टिप्पणी *
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter forwarding remarks..."
                rows="4"
                required
              />
            </div>
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
              disabled={isSubmitting || !formData.forwardTo || !formData.remarks.trim() || isLoadingOptions}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                isSubmitting || !formData.forwardTo || !formData.remarks.trim() || isLoadingOptions
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Forwarding...
                </>
              ) : (
                <>
                  <FaArrowRight className="w-4 h-4" />
                  Forward
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PendingComplaints = () => {
  const navigate = useNavigate();
  const [complaintsData, setComplaintsData] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Forward Modal State
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  // Fetch complaints data from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/supervisor/all-pending-complaints");
        if (response.data.status === true) {
          setComplaintsData(response.data.data);
        } else {
          setError("Failed to fetch complaints data");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Error fetching data");
      }
    };

    fetchComplaints();
  }, []);

  // Handle view details with navigation
  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`/supervisor/pending-complaints/view/${complaintId}`);
  };

  // Handle modal view
  const handleModalView = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  // Handle Forward button click
  const handleForward = (e, complaintId) => {
    e.stopPropagation();
    console.log("Forward button clicked for complaint ID:", complaintId);
    setSelectedComplaintId(complaintId);
    setIsForwardModalOpen(true);
  };

  // ✅ Handle forward submit with local state update
  const handleForwardSubmit = (forwardedComplaintId) => {
    // ✅ Update local state immediately without API call
    setComplaintsData(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === forwardedComplaintId 
          ? { 
              ...complaint, 
              approved_rejected_by_ds_js: 1, // Set forwarded status
              status: 'Forwarded' // Update status if needed
            }
          : complaint
      )
    );
    
    console.log(`Complaint ${forwardedComplaintId} marked as forwarded locally`);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status color helper
  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'text-yellow-600 border-yellow-300 bg-yellow-50';
      case 'rejected':
        return 'text-red-600 border-red-300 bg-red-50';
      case 'approved':
        return 'text-green-600 border-green-300 bg-green-50';
      case 'forwarded':
        return 'text-blue-600 border-blue-300 bg-blue-50';
      default:
        return 'text-gray-600 border-gray-300 bg-gray-50';
    }
  };

  // Check approval status - यहाँ चारों conditions हैं
  const getApprovalStatus = (complaint) => {
    // Check DA approval (Dealing Assistant) - First priority
    if (complaint.approved_rejected_by_d_a === 1) {
      return {
        status: 'approved_by_da',
        label: 'Approved by DA',
        color: 'bg-green-500'
      };
    }
    
    // Check RO approval (Revenue Officer)
    if (complaint.approved_rejected_by_ro === 1) {
      return {
        status: 'approved_by_ro',
        label: 'Approved by RO',
        color: 'bg-green-500'
      };
    }
    
    // Check SO/US approval (Sub Officer/Under Secretary)
    if (complaint.approved_rejected_by_so_us === 1) {
      return {
        status: 'approved_by_so',
        label: 'Approved by SO',
        color: 'bg-green-500'
      };
    }
    
    // Check DS/JS approval (District Supervisor/Joint Secretary)
    if (complaint.approved_rejected_by_ds_js === 1) {
      return {
        status: 'approved_by_ds',
        label: 'Approved by DS',
        color: 'bg-green-500'
      };
    }
    
    // If no approvals
    return {
      status: 'pending',
      label: 'Pending Approval',
      color: 'bg-yellow-500'
    };
  };

  // Forward status helper
  const isForwarded = (complaint) => {
    return complaint.approved_rejected_by_so_us === 1;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <div className="min-h-screen p-2 sm:p-4">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pending Complaints</h1>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {complaintsData.map((complaint) => {
            const approvalStatus = getApprovalStatus(complaint);
            
            return (
              <div
                key={complaint.id}
                className="w-full bg-white shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl rounded-lg border border-gray-300 transition-shadow duration-300 relative"
              >
                {/* Approval Status Badge - Left Bottom Corner */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${approvalStatus.color}`}>
                    <FaCheck className="w-3 h-3 mr-1" />
                    {approvalStatus.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 p-3 sm:p-4 text-sm border-b sm:border-b-0 border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className=" text-black text-xs sm:text-sm mb-1 sm:mb-0">
                      Complaint No:
                    </span>
                    <span className="bg-blue-100 px-2 sm:px-3 py-1 rounded text-blue-800 font-bold text-xs sm:text-sm text-center sm:text-left">
                      {complaint.complain_no}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Complainant:</span>
                    <span className="text-gray-700 text-sm">{complaint.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Mobile No:</span>
                    <span className="text-gray-700 text-sm">{complaint.mobile}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 px-3 sm:px-4 pb-3 sm:pb-4 text-sm border-b sm:border-b-0 border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Email:</span>
                    <span className="text-gray-700 text-sm">{complaint.email}</span>
                  </div>
                 
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">District:</span>
                    <span className="text-gray-700 text-sm">{complaint.district_name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-0">Created Date:</span>
                    <span className="text-sm text-gray-600">{formatDate(complaint.created_at)}</span>
                  </div>
                </div>

                {/* Row 4 - Action Buttons */}
                <div className="px-3 sm:px-4 pb-12 sm:pb-4"> {/* Extra bottom padding for mobile to avoid overlap with badge */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
                    <button
                      onClick={(e) => handleViewDetails(e, complaint.id)}
                      className="w-full sm:w-auto border border-blue-500 text-blue-500 hover:text-white px-4 py-2 sm:py-1 rounded hover:bg-blue-700 cursor-pointer transition-colors duration-200 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {/* ✅ Dynamic button based on forward status */}
                    {isForwarded(complaint) ? (
                      <button
                        disabled
                        className="w-full sm:w-auto px-4 py-2 sm:py-1 rounded text-sm font-medium bg-green-500 text-white border border-green-500 cursor-not-allowed"
                      >
                        ✓ Forwarded
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleForward(e, complaint.id)}
                        className="w-full sm:w-auto border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-700 px-4 py-2 sm:py-1 rounded cursor-pointer transition-colors duration-200 text-sm font-medium"
                      >
                        Forward
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {complaintsData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">No complaints found</p>
          </div>
        )}
      </div>

      {/* Forward Modal */}
      <ForwardModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        complaintId={selectedComplaintId}
        onSubmit={handleForwardSubmit}
      />

      {/* Details Modal (existing) */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-start sm:items-center p-2 sm:p-4">
          <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-2xl bg-white mt-2 sm:mt-0">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start sm:items-center">
              <div className="pr-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Complaint Details</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{selectedComplaint.complain_no}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingComplaints;
