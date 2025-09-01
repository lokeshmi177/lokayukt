import React, { useState } from 'react';
import { FaUser, FaLock, FaUserTie, FaBalanceScale, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrors({});
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post('/login', {
        user_name: formData.user_name,
        password: formData.password
      });

      if (response.data.status === 'success') {
        // Store token in localStorage
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // ✅ Show success toast using react-toastify
        toast.success('Login Successful! Redirecting to dashboard...')
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.status === 'error') {
        // Handle validation errors from backend
        if (error.response.data.data) {
          setErrors(error.response.data.data);
          // ✅ Show error toast for validation errors
        
        } else {
          // ✅ Show error toast for login failure
          
        }
      } else {
        // ✅ Show error toast for network errors
        toast.error('Network error. Please check your connection and try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" >
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
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
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
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaExclamationTriangle className="text-xs" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-3">
              Login as Role / भूमिका चुनें:
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${selectedRole === 'admin' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <FaUser className="text-sm" />
                <span className="text-sm font-medium">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('lokayukta')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${selectedRole === 'lokayukta' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <FaBalanceScale className="text-sm" />
                <span className="text-sm font-medium">LokAyukta</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('secretary')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${selectedRole === 'secretary' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <FaUserTie className="text-sm" />
                <span className="text-sm font-medium">Secretary</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('ro_aro')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${selectedRole === 'ro_aro' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <FaUser className="text-sm" />
                <span className="text-sm font-medium">RO/ARO</span>
              </button>

            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!selectedRole || isLoading}
            className={`
              w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
              ${selectedRole && !isLoading
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

      {/* ✅ ToastContainer for react-toastify */}
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