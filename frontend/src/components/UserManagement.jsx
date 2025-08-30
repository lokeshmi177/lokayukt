// pages/UserManagement.js
import React, { useState } from 'react';
import {
  FaUserPlus,
  FaUser as FaUserIcon,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

const UserManagement = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [activeTab, setActiveTab] = useState('users');

  const users = [
    {
      id: '1',
      name: 'श्री राजेश कुमार',
      email: 'rajesh.kumar@lokayukta.mp.gov.in',
      mobile: '+91-9876543210',
      role: 'Secretary',
      designation: 'Secretary',
      department: 'LokAyukta Office',
      status: 'active',
      lastLogin: '2024-01-16 09:30 AM',
      createdAt: '2023-08-15'
    },
    {
      id: '2',
      name: 'श्रीमती सुनीता शर्मा',
      email: 'sunita.sharma@lokayukta.mp.gov.in',
      mobile: '+91-9876543211',
      role: 'RO',
      designation: 'Research Officer',
      department: 'LokAyukta Office',
      status: 'active',
      lastLogin: '2024-01-16 10:15 AM',
      createdAt: '2023-09-20'
    },
    {
      id: '3',
      name: 'श्री अमित गुप्ता',
      email: 'amit.gupta@lokayukta.mp.gov.in',
      mobile: '+91-9876543212',
      role: 'Section Officer',
      designation: 'Section Officer',
      department: 'Administration',
      status: 'active',
      lastLogin: '2024-01-15 04:45 PM',
      createdAt: '2023-10-10'
    },
    {
      id: '4',
      name: 'श्री राज कुमार',
      email: 'raj.kumar@lokayukta.mp.gov.in',
      mobile: '+91-9876543213',
      role: 'CIO',
      designation: 'Chief Investigation Officer',
      department: 'Investigation',
      status: 'active',
      lastLogin: '2024-01-16 08:20 AM',
      createdAt: '2023-07-05'
    },
    {
      id: '5',
      name: 'श्रीमती प्रिया पटेल',
      email: 'priya.patel@lokayukta.mp.gov.in',
      mobile: '+91-9876543214',
      role: 'ARO',
      designation: 'Assistant Research Officer',
      department: 'Research',
      status: 'inactive',
      lastLogin: '2024-01-10 02:30 PM',
      createdAt: '2023-11-12'
    }
  ];

  const getRoleColor = (role) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800 border-red-200',
      LokAyukta: 'bg-blue-100 text-blue-800 border-blue-200',
      UpLokAyukta: 'bg-blue-100 text-blue-800 border-blue-200',
      Secretary: 'bg-gray-100 text-gray-800 border-gray-200',
      CIO: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      RO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ARO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Section Officer': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId) => {
    console.log('Toggling user status for:', userId);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management / उपयोगकर्ता प्रबंधन</h1>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          <FaUserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="px-4 sm:px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Add New User</h2>
            </div>
            <div className="px-4 sm:px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input id="name" className="w-full p-2 border rounded-md" placeholder="Enter full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="email" type="email" className="w-full p-2 border rounded-md" placeholder="Enter email" />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input id="mobile" className="w-full p-2 border rounded-md" placeholder="Enter mobile number" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select id="role" className="w-full p-2 border rounded-md">
                    <option>Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Secretary">Secretary</option>
                    <option value="RO">RO</option>
                    <option value="ARO">ARO</option>
                    <option value="CIO">CIO</option>
                    <option value="Section Officer">Section Officer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input id="designation" className="w-full p-2 border rounded-md" placeholder="Enter designation" />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input id="department" className="w-full p-2 border rounded-md" placeholder="Enter department" />
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-3 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex w-full" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 sm:py-4 text-sm font-medium border-b-2 text-center ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex-1 py-3 sm:py-4 text-sm font-medium border-b-2 text-center ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Roles & Permissions
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-3 sm:py-4 text-sm font-medium border-b-2 text-center ${
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Audit Log
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">User List</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                      <input
                        id="search"
                        placeholder="Name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
                      <select
                        id="role-filter"
                        className="w-full sm:w-40 p-2 border rounded-md"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Secretary">Secretary</option>
                        <option value="RO">RO</option>
                        <option value="ARO">ARO</option>
                        <option value="CIO">CIO</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <FaUserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                              <FaEnvelope className="w-3 h-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700">
                              <FaPhone className="w-3 h-3" />
                              {user.mobile}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.department}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={user.status === 'active'}
                              onChange={() => toggleUserStatus(user.id)}
                              className="w-9 h-5 accent-blue-600"
                            />
                            <span className={`text-sm ${user.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                              {user.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{user.lastLogin}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
                              <FaEdit className="w-3 h-3" />
                            </button>
                            <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Roles & Permissions Tab */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {['Admin', 'Secretary', 'RO', 'ARO', 'CIO', 'Section Officer'].map((role) => (
                <div key={role} className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <FaShieldAlt className="w-5 h-5" />
                      {role}
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Users:</strong> {users.filter((u) => u.role === role).length}
                      </div>
                      <div className="text-sm">
                        <strong>Permissions:</strong>
                        <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                          {role === 'Admin' && (
                            <>
                              <li>Manage users</li>
                              <li>Manage master data</li>
                              <li>Database backup</li>
                            </>
                          )}
                          {(role === 'RO' || role === 'ARO') && (
                            <>
                              <li>Enter complaints</li>
                              <li>Compare & merge</li>
                              <li>Add correspondence</li>
                            </>
                          )}
                          {role === 'Secretary' && (
                            <>
                              <li>Verify complaints</li>
                              <li>Forward with noting</li>
                              <li>View all reports</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">User Activity Audit Log</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { user: 'श्री राजेश कुमार', action: 'Logged in', timestamp: '2024-01-16 09:30 AM' },
                  { user: 'श्रीमती सुनीता शर्मा', action: 'Created complaint MP/2024/ALG/005', timestamp: '2024-01-16 09:45 AM' },
                  { user: 'श्री अमित गुप्ता', action: 'Forwarded complaint to Secretary', timestamp: '2024-01-16 10:15 AM' },
                  { user: 'Admin', action: 'Created new user account', timestamp: '2024-01-16 11:00 AM' },
                ].map((log, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{log.user}</div>
                      <div className="text-sm text-gray-500">{log.action}</div>
                    </div>
                    <div className="text-sm text-gray-500">{log.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
