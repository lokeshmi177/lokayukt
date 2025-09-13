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

const ViewComplaints = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaintData, setComplaintData] = useState(null);
  const [filePreviewData, setFilePreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
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
          `/operator/view-complaint/${id}`
        );

        if (complaintResponse.data.status === true) {
          setComplaintData(complaintResponse.data.data);

          // Fetch file preview data
          try {
            const fileResponse = await api.get(
              `/operator/get-file-preview/${id}`
            );
            if (fileResponse.data.status === true) {
              setFilePreviewData(fileResponse.data.data);
              console.log(fileResponse.data.data);
            }
          } catch (fileErr) {
            console.log("File preview not available:", fileErr);
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

  // Handle file download
  const handleFileDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file available");
      return;
    }
    const fileUrl = `${APP_URL}${filePath}`;
    window.open(fileUrl, "_blank");
  };

  // Handle file preview
  const handleFilePreview = () => {
    if (filePreviewData) {
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

  // Handle edit navigation - FIXED PART
  const handleEditNavigation = () => {
    if (id && complaintData) {
      console.log("Navigating to edit with ID:", id);
      console.log("Complaint data:", complaintData);

      // Method 1: Using URL parameter (Recommended)
      navigate(`/operator/search-reports/edit/${id}`);

      // Method 2: Using state (Alternative)
      // navigate('/operator/search-reports/edit', {
      //   state: {
      //     complaintId: id,
      //     complaintData: complaintData
      //   }
      // });
    } else {
      toast.error("Unable to edit: Missing complaint data");
    }
  };

  // PDF Preview Modal Component
  const PDFPreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">File Preview</h3>
          <button
            onClick={() => setShowPreview(false)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4">
          {isPDF(filePreviewData) ? (
            <iframe
              src={`${APP_URL}${filePreviewData}`}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          ) : isImage(filePreviewData) ? (
            <img
              src={`${APP_URL}${filePreviewData}`}
              alt="File Preview"
              className="max-w-full max-h-full mx-auto object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No File</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
              Complaint No:{" "}
              <span className="font-semibold text-gray-900">
                {complaintData?.complain_no || "N/A"}
              </span>
            </p>
          </div>

          {/* FIXED EDIT BUTTON */}
          {subRole === "entry-operator" && (
            <button
              onClick={handleEditNavigation}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              disabled={!id || !complaintData}
            >
              <FaRegEdit className="mr-2 text-lg" />
              Edit
            </button>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/operator/search-reports")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <IoMdArrowBack className="mr-2 text-lg" />
              Back
            </button>
          </div>
        </div>

        {/* Debug Info - Remove in production */}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="text-sm text-gray-900">
                      {complaintData.email || "N/A"}
                    </p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {complaintData.district_name || "N/A"}
                    </p>
                  </div>
                </div>

                {complaintData.address && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <p className="text-sm text-gray-900">
                      {complaintData.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security Fee */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaRupeeSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Security Fee
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {complaintData.amount || "N/A"}
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
                      <p className="text-sm text-gray-900">
                        {complaintData.dob}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of your existing sections remain the same */}
            {/* Respondent Department */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaBuilding className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Respondent Department
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {complaintData.department_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officer Name
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {complaintData.officer_name || "N/A"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <p className="text-sm text-gray-900">
                    {complaintData.designation_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 capitalize">
                    {complaintData.category?.replace("_", " ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaFileAlt className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Complaint Details
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <p className="text-sm text-gray-900">
                      {complaintData.subject_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complaint Type
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        complaintData.complaintype_name === "Allegation"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {complaintData.complaintype_name || "N/A"}
                    </span>
                  </div>
                </div>
                {complaintData.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {complaintData.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Outside Correspondence */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaFileAlt className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Outside Correspondence
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {complaintData.title || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File
                  </label>
                  {filePreviewData ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleFilePreview}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                        <span className="text-sm">Preview</span>
                      </button>
                      <button
                        onClick={() => handleFileDownload(filePreviewData)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        <FaDownload className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && <PDFPreviewModal />}
    </div>
  );
};

export default ViewComplaints;
