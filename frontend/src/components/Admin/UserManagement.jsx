// pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaUser as FaUserIcon,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../Pagination'; 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

  

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  
  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.data.status === true) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  const displayValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return 'NA';
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'NA';
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      Administrator: 'bg-red-100 text-red-800',
      admin: 'bg-red-100 text-red-800',
      Operator: 'bg-blue-100 text-blue-800',
      Supervisor: 'bg-green-100 text-green-800',
      Secretary: 'bg-gray-100 text-gray-800',
      CIO: 'bg-cyan-100 text-cyan-800',
      RO: 'bg-yellow-100 text-yellow-800',
      ARO: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase());

    const userRole = user.role?.label || user.role?.name || 'Unknown';
    const matchesRole = selectedRole === 'all' || userRole === selectedRole;

    return matchesSearch && matchesRole;
  });

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleUserStatus = (userId) => {
    console.log('Toggling user status for:', userId);
  };

  const uniqueRoles = [...new Set(users.map(user => user.role?.label || user.role?.name).filter(Boolean))];
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">उपयोगकर्ता प्रबंधन</p>
          </div>
          <button
            onClick={() => navigate("add")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            <FaUserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Compact Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full m-3">
              <button
                onClick={() => setActiveTab('users')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'users' ? "bg-white text-blue-600 shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'roles' ? "bg-white text-blue-600 shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Roles & Permissions
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'audit' ? "bg-white text-blue-600 shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Audit Log
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-4 pb-4">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {/* Compact Search and Filter */}
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        User List ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
                      </h3>
                      <div className="flex gap-3">
                        <input
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        />
                        <select
                          className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          <option value="all">All Roles</option>
                          {uniqueRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Compact Table */}
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-4 font-medium text-gray-900">User</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Contact</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Role</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Status</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Last Login</th>
                            <th className="text-left py-2 px-4 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedUsers.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                                No users found
                              </td>
                            </tr>
                          ) : (
                            paginatedUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                {/* User Info */}
                                <td className="py-2 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FaUserIcon className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{displayValue(user.name)}</div>
                                      <div className="text-xs text-gray-500">{displayValue(user.user_name)}</div>
                                    </div>
                                  </div>
                                </td>

                                {/* Contact */}
                                <td className="py-2 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-700">
                                      <FaEnvelope className="w-3 text-red-500 h-3" />
                                      <span className="truncate max-w-[120px]">{displayValue(user.email)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-700">
                                      <FaPhone className="w-3 text-green-600 h-3" />
                                      {displayValue(user.number)}
                                    </div>
                                  </div>
                                </td>

                                {/* Role */}
                                <td className="py-2 px-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role?.label || user.role?.name)}`}>
                                    {displayValue(user.role?.label || user.role?.name)}
                                  </span>
                                  {user.sub_role_id && (
                                    <div className="text-xs text-gray-500 mt-1">Sub: {displayValue(user.sub_role_id)}</div>
                                  )}
                                </td>

                                {/* Status */}
                                <td className="py-2 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs ${user.status === '1' || user.status === 1 ? 'text-green-600' : 'text-gray-500'}`}>
                                      {user.status === '1' || user.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </td>

                                {/* Last Login */}
                                <td className="py-2 px-4 text-xs text-gray-700">
                                  {formatDate(user.updated_at)}
                                </td>

                                {/* Actions */}
                                <td className="py-2 px-4">
                                  <div className="flex gap-1">
                                    <button onClick={()=>{
                                      navigate("edit");
                                    }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                      <FaEdit className="w-3 h-3" />
                                    </button>
                                    <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                                      <FaTrash className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ✅ Pagination Component */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={filteredUsers.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          showInfo={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Roles & Permissions Tab */}
              {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueRoles.map((role) => (
                    <div key={role} className="bg-white border border-gray-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-base font-semibold mb-2">
                        <FaShieldAlt className="w-4 h-4 text-blue-600" />
                        {role}
                      </div>
                      <div className="text-sm">
                        <div><strong>Users:</strong> {users.filter((u) => (u.role?.label || u.role?.name) === role).length}</div>
                        <div className="mt-2"><strong>Permissions:</strong></div>
                        <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                          <li>Role-based access control</li>
                          <li>System permissions</li>
                          <li>Data management</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Audit Log Tab */}
              {activeTab === 'audit' && (
                <div className="bg-white border border-gray-200 rounded-md">
                  <div className="px-4 py-2 border-b bg-gray-50">
                    <h3 className="text-base font-semibold">User Activity Audit Log</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {users.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">Last updated profile</div>
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(user.updated_at)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
