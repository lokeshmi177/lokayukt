// pages/Complaints.js
import React, { useState } from 'react';
import { 
  FaUser, 
  FaBuilding, 
  FaFileAlt, 
  FaSearch, 
  FaSave, 
  FaPaperPlane,
  FaRupeeSign 
} from 'react-icons/fa';


const Complaints = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    district: '',
    email: '',
    securityFee: 'exempted',
    amount: '',
    challanNo: '',
    date: '',
    department: '',
    officerName: '',
    designation: '',
    category: '',
    subject: '',
    nature: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (



    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Same as before */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complaint Entry</h1>
            <p className="text-sm text-gray-600">शिकायत प्रविष्टि फॉर्म</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <FaSearch className="w-4 h-4" />
              Check Duplicates
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <FaSave className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <FaPaperPlane className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </div>
      </div>

      {/* New Grid Layout */}
      <div className="space-y-6">
        {/* Top Row: Complainant Details + Security Fee side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Complainant Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Complainant Details</h2>
                <p className="text-sm text-gray-500">शिकायतकर्ता विवरण</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name / नाम
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder=""
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile / मोबाइल
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder=""
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address / पता
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder=""
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District / जिला
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select District</option>
                  <option value="bhopal">Bhopal</option>
                  <option value="indore">Indore</option>
                  <option value="gwalior">Gwalior</option>
                  <option value="jabalpur">Jabalpur</option>
                  <option value="ujjain">Ujjain</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Security Fee */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FaRupeeSign className="w-5 h-5 text-green-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security Fee</h2>
                <p className="text-sm text-gray-500">जमानत राशि</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Fee Exempted Radio */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    id="exempted"
                    name="securityFee"
                    type="radio"
                    value="exempted"
                    checked={formData.securityFee === 'exempted'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="exempted" className="text-sm font-medium text-gray-700">
                    Fee Exempted / शुल्क माफ
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount / राशि
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder=""
                  disabled={formData.securityFee === 'exempted'}
                />
              </div>

              {/* Challan No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Challan No. / चालान नं.
                </label>
                <input
                  type="text"
                  name="challanNo"
                  value={formData.challanNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder=""
                  disabled={formData.securityFee === 'exempted'}
                />
              </div>

              {/* Date */}
              <div>
    
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date / दिनांक
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Respondent Department - Full Width */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaBuilding className="w-5 h-5 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Respondent Department</h2>
              <p className="text-sm text-gray-500">प्रतिवादी विभाग</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department / विभाग
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select Department</option>
                <option value="revenue">Revenue</option>
                <option value="pwd">PWD</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="police">Police</option>
              </select>
            </div>

            {/* Officer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Officer Name / अधिकारी का नाम
              </label>
              <input
                type="text"
                name="officerName"
                value={formData.officerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder=""
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation / पदनाम
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select Designation</option>
                <option value="collector">Collector</option>
                <option value="tehsildar">Tehsildar</option>
                <option value="engineer">Engineer</option>
                <option value="officer">Officer</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category / श्रेणी
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select Category</option>
                <option value="allegation">Allegation</option>
                <option value="grievance">Grievance</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaint Details - Full Width */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaFileAlt className="w-5 h-5 text-orange-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Complaint Details</h2>
              <p className="text-sm text-gray-500">शिकायत विवरण</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject / विषय
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Subject</option>
                  <option value="corruption">Corruption</option>
                  <option value="negligence">Negligence</option>
                  <option value="delay">Delay in Work</option>
                  <option value="misconduct">Misconduct</option>
                </select>
              </div>

              {/* Nature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nature / प्रकृति
                </label>
                <select
                  name="nature"
                  value={formData.nature}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select Nature</option>
                  <option value="financial">Financial Irregularity</option>
                  <option value="administrative">Administrative Lapse</option>
                  <option value="service">Service Related</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description / विस्तृत विवरण
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Enter detailed complaint description..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
