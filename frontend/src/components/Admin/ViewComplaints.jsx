import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFileAlt, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaCalendarAlt, 
  FaDownload,
  FaArrowLeft,
  FaExclamationTriangle,
  FaIdCard,
  FaRupeeSign,
  FaEye,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const ViewComplaints = () => {
  const { id } = useParams(); // Get complaint ID from URL
  const navigate = useNavigate();
  
  const [complaintData, setComplaintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complaint data on component mount
  useEffect(() => {
    const fetchComplaintData = async () => {
      if (!id) {
        setError('No complaint ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/admin/view-complaint/${id}`);
        
        if (response.data.status === true) {
          setComplaintData(response.data.data);
        } else {
          setError('Failed to fetch complaint data');
          toast.error('Failed to fetch complaint data');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch complaint data');
        toast.error('Error loading complaint details');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintData();
  }, [id]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Disposed - Accepted':
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Investigation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle file download/view
  const handleFileDownload = (fileName) => {
    if (!fileName) {
      toast.error('No file available');
      return;
    }
    const fileUrl = `${BASE_URL}/files/${fileName}`;
    window.open(fileUrl, '_blank');
  };

  // Simple Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <FaExclamationTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <div className="text-xl font-medium text-red-600 mb-2">Unable to Load Complaint</div>
          <div className="text-gray-600 mb-6">{error}</div>
          <div className="space-x-3">
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Complaint Details
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Complaint No: <span className="font-semibold text-gray-900">{complaintData?.complain_no || 'N/A'}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(complaintData?.status)}`}>
              {complaintData?.status || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        {complaintData && (
          <div className="space-y-6">
            {/* Complainant Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Complainant Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-sm text-gray-900 font-medium">{complaintData.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{complaintData.email || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-mono">{complaintData.mobile || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{complaintData.district_name || 'N/A'}</p>
                  </div>
                </div>

                {/* Added fields */}
                
               
                

                {complaintData.address && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900">{complaintData.address}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaRupeeSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Security Fee</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
               
               

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{complaintData.amount || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Challan No</label>
                  <div className="flex items-center gap-2">
                    <FaIdCard className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{complaintData.challan_no || 'N/A'}</p>
                  </div>
                </div>
                {complaintData.dob && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{complaintData.dob}</p>
                    </div>
                  </div>
                )}

           
              </div>
            </div>

            {/* Respondent Department */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaBuilding className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Respondent Department</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-sm text-gray-900 font-medium">{complaintData.department_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Officer Name</label>
                  <p className="text-sm text-gray-900 font-medium">{complaintData.officer_name || 'N/A'}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <p className="text-sm text-gray-900">{complaintData.designation_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-sm text-gray-900 capitalize">{complaintData.category?.replace('_', ' ') || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaFileAlt className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Complaint Details</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-sm text-gray-900">{complaintData.subject_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      complaintData.complaintype_name === 'Allegation' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {complaintData.complaintype_name || 'N/A'}
                    </span>
                  </div>
                </div>
                {complaintData.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{complaintData.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Outside Correspondence */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaFileAlt className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Outside Correspondence</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-sm text-gray-900 font-medium">{complaintData.title || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  {complaintData.file ? (
                    <button
                      onClick={() => handleFileDownload(complaintData.file)}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FaDownload className="w-4 h-4" />
                      {complaintData.file}
                    </button>
                  ) : (
                    <p className="text-sm text-gray-900">N/A</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ViewComplaints;