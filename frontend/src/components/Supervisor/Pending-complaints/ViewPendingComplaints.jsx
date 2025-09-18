import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const APP_URL = BASE_URL.replace("/api", "");
const token = localStorage.getItem("access_token");
const subRole = localStorage.getItem("subrole");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewAllComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaintData, setComplaintData] = useState(null);
  const [filePreviewData, setFilePreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complaint data and file preview
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No complaint ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch complaint data
        const complaintResponse = await api.get(
          `/supervisor/view-complaint/${id}`
        );

        if (complaintResponse.data.status === true) {
          setComplaintData(complaintResponse.data.data);
          console.log("Complaint Data:", complaintResponse.data.data);

          // Fetch file preview data
          try {
            const fileResponse = await api.get(
              `/supervisor/get-file-preview/${id}`
            );
            if (fileResponse.data.status === true) {
              setFilePreviewData(fileResponse.data.data || []);
              console.log("File Preview Data:", fileResponse.data.data);
            }
          } catch (fileErr) {
            console.log("File preview not available:", fileErr);
            setFilePreviewData([]);
          }
        } else {
          setError("Failed to fetch complaint data");
          toast.error("Failed to fetch complaint data");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch complaint data"
        );
        toast.error("Error loading complaint details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Disposed - Accepted":
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Under Investigation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle file download - Updated for specific file
  const handleFileDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file available for download");
      return;
    }
    
    // Open file in new tab for download
    const fileUrl = `${APP_URL}${filePath}`;
    window.open(fileUrl, "_blank");
  };

  // Handle file preview - Updated for specific file
  const handleFilePreview = (filePath) => {
    if (filePath) {
      setCurrentPreviewFile(filePath);
      setShowPreview(true);
    } else {
      toast.error("File preview not available");
    }
  };

  // Check if file is PDF
  const isPDF = (filePath) => {
    return filePath && filePath.toLowerCase().endsWith(".pdf");
  };

  // Check if file is image
  const isImage = (filePath) => {
    return filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  };

  // Handle edit navigation
  const handleEditNavigation = () => {
    if (id && complaintData) {
      console.log("Navigating to edit with ID:", id);
      console.log("Complaint data:", complaintData);
      navigate(`/supervisor/pending-complaints/edit/${id}`);
    } else {
      toast.error("Unable to edit: Missing complaint data");
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg font-medium text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate("/supervisor/pending-complaints")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Complaints
          </button>
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
              {complaintData?.status && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    complaintData.status
                  )}`}
                >
                  {complaintData.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {subRole === "review-supervisor" && (
              <button
                onClick={handleEditNavigation}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                disabled={!id || !complaintData}
              >
                <FaRegEdit className="mr-2 text-lg" />
                Edit
              </button>
            )}
            
            <button
              onClick={() => navigate("/supervisor/pending-complaints")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <IoMdArrowBack className="mr-2 text-lg" />
              Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        {complaintData && (
          <div className="space-y-6">
            {/* Complainant Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Complainant Details
                </h2>
              </div>

              {/* First Row: 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complaint No
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {complaintData?.complain_no || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {complaintData.name || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{complaintData.email || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-mono">
                      {complaintData.mobile || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Row: District + Address */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <div className="flex items-center gap-2 relative mt-3">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-medium">
                      {complaintData.district_name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border min-h-[60px]">
                    {complaintData.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Security Fee Section */}
              <div className="mt-6 flex items-center gap-3 mb-4">
                <FaRupeeSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Security Fee
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {complaintData.amount || (complaintData.fee_exempted ? "Fee Exempted" : "N/A")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Challan No
                  </label>
                  <div className="flex items-center gap-2">
                    <FaIdCard className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {complaintData.challan_no || "N/A"}
                    </p>
                  </div>
                </div>

                {complaintData.dob && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{complaintData.dob}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submitted Date
                  </label>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {formatDate(complaintData.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loop through all complaint details */}
            {complaintData?.details?.length > 0 && (
              <div className="space-y-6">
                {complaintData.details.map((detail, index) => {
                  // Get corresponding file from filePreviewData array
                  const correspondingFile = filePreviewData[index] || null;
                  
                  return (
                    <div key={detail.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      {/* Header for each complaint detail */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <FaBuilding className="w-5 h-5 text-green-600" />
                          <h2 className="text-lg font-semibold text-gray-900">
                            Complaint Detail #{index + 1}
                          </h2>
                        </div>
                       
                      </div>
                      
                      {/* Respondent Department Section */}
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-800 mb-3">Respondent Department</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Department
                            </label>
                            <p className="text-sm text-gray-900 font-medium">
                              {detail.department_name || "N/A"}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Officer Name
                            </label>
                            <p className="text-sm text-gray-900 font-medium">
                              {detail.officer_name || "N/A"}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Designation
                            </label>
                            <p className="text-sm text-gray-900">
                              {detail.designation_name || "N/A"}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category
                            </label>
                            <p className="text-sm text-gray-900 capitalize">
                              {detail.category?.replace("_", " ") || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Complaint Details Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <FaFileAlt className="w-4 h-4 text-orange-600" />
                          <h3 className="text-md font-medium text-gray-800">Complaint Information</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Subject and Complaint Type */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                              </label>
                              <p className="text-sm text-gray-900">
                                {detail.subject_name || "N/A"}
                              </p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complaint Type
                              </label>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  detail.complaintype_name === "Allegation"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {detail.complaintype_name || "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          {/* Description */}
                          {detail.description && (
                            <div className="grid grid-cols-1">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Description
                                </label>
                                <div className="bg-gray-50 p-4 rounded-md border">
                                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                    {detail.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Outside Correspondence Section */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <FaFileAlt className="w-4 h-4 text-purple-600" />
                          <h3 className="text-md font-medium text-gray-800">Outside Correspondence</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <p className="text-sm text-gray-900 font-medium">
                              {detail.title || "N/A"}
                            </p>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Attached File
                            </label>
                            {correspondingFile ? (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleFilePreview(correspondingFile)}
                                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors text-sm"
                                >
                                  <FaEye className="w-4 h-4" />
                                  <span>Preview</span>
                                </button>
                                <button
                                  onClick={() => handleFileDownload(correspondingFile)}
                                  className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors text-sm"
                                >
                                  <FaDownload className="w-4 h-4" />
                                  <span>Download</span>
                                </button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-900">No file attached</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && <PDFPreviewModal />}
    </div>
  );
};

export default ViewAllComplaint;
