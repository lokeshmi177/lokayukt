import React, { useState } from 'react';
import { FaUser, FaLock, FaBalanceScale, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";


const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setGeneralError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');


    try {
      // ✅ Updated: Create axios instance without token for login request
      const loginApi = axios.create({
        baseURL: BASE_URL,
        headers: {
          "Content-Type": "application/json",
        },
      });


      const response = await loginApi.post('/login', {
        user_name: formData.user_name,
        password: formData.password
      });

      // Transform the API response to match the expected structure
      const transformedResponse = {
        data: {
          status: 'success',
          data: {
            access_token: response.data.access_token,
            user: {
              ...response.data.user,
              role: {
                name: response.data.user.role
              }
            }
          }
        }
      };

      if (transformedResponse.data.status === 'success') {
        // Store data
        localStorage.setItem('access_token', transformedResponse.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(transformedResponse.data.data.user));
        localStorage.setItem('role', transformedResponse.data.data.user.role.name);
        
        const userRole = transformedResponse.data.data.user.role.name;
        
        // 
        setTimeout(() => {
          if (userRole === "admin") {
            toast.success("Login Successful!");
            window.open("/admin/dashboard", "_self");
          } else if (userRole === "oprter") {
            toast.success("Login Successful!");
            window.open("/operator/dashboard", "_self");
          } else {
            toast.error(" Unauthorized role.");
            window.open("/login", "_self");
          }
        }, 1500);
      }

    } catch (error) {
      if (error.response?.data?.status === 'error') {
        // Handle validation errors from backend (field-specific errors)
        if (error.response.data.data && typeof error.response.data.data === 'object') {
          setErrors(error.response.data.data);
        } else {
          // Handle general error messages like "Wrong password" - show below password field
          setGeneralError(error.response.data.message || 'Login failed');
        }
      } else {
        // Handle network or other errors
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaBalanceScale className="text-6xl text-blue-800 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-blue-800 mb-2">
            LokAyukta CRMS
          </h1>
          <p className="text-gray-600 text-sm">
            लोकायुक्त शिकायत निवारण प्रबंधन प्रणाली
          </p>
        </div>


        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Username / उपयोगकर्ता नाम
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer ${
                  errors.user_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
            </div>
            {errors.user_name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaExclamationTriangle className="text-xs" />
                {errors.user_name}
              </p>
            )}
          </div>


          {/* Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password / पासवर्ड
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer ${
                  errors.password || generalError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
            </div>
            {/* Show field-specific password error */}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaExclamationTriangle className="text-xs" />
                {errors.password}
              </p>
            )}
            {/* Show general error like "Wrong password" below password field */}
            {generalError && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaExclamationTriangle className="text-xs" />
                {generalError}
              </p>
            )}
          </div>


          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
              ${!isLoading
                ? 'bg-blue-800 hover:bg-blue-900 cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <>
                <FaSpinner className="text-sm animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <FaLock className="text-sm" />
                Login / लॉगिन
              </>
            )}
          </button>


        </form>


        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 LokAyukta Office, Madhya Pradesh
          </p>
        </div>


      </div>


      {/* ToastContainer for react-toastify */}
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
      />
    </div>
  );
};


export default Login;
