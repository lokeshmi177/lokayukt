import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaArrowUp, // Changed from FaTrendingUp
  FaUsers,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBullseye,
  FaChartLine
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Tooltip,
  Legend
} from 'recharts';

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Card Components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-white text-gray-900 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Badge Component
const Badge = ({ children, variant = "default", className, ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Button Component
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900';
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-9 rounded-md px-3 text-sm';
      case 'lg':
        return 'h-11 rounded-md px-8';
      default:
        return 'h-10 px-4 py-2';
    }
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Tabs Components
const Tabs = ({ value, onValueChange, children, defaultValue, className, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className, activeTab, onTabChange, ...props }) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
      className
    )}
    {...props}
  >
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, onTabChange, className, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value ? "bg-white text-gray-900 shadow-sm" : "",
      className
    )}
    onClick={() => onTabChange(value)}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab, className, ...props }) => {
  if (activeTab !== value) return null;
  
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// StatsCard Component
const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  trend 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'secondary':
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'warning':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'destructive':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary': return 'text-blue-600';
      case 'secondary': return 'text-gray-600';
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'destructive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`p-6 hover:shadow-md transition-shadow ${getVariantClasses()}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <span className={`
                text-xs font-medium px-2 py-1 rounded-full
                ${trend.isPositive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
                }
              `}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`
          p-3 rounded-lg bg-white/50 backdrop-blur-sm
          ${getIconColor()}
        `}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-gray-900 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main Dashboard Component
const Dashboard = ({ userRole = "Administrator" }) => {
  // Sample data for charts with realistic values
  const monthlyTrends = [
    { month: 'Jan', received: 72, disposed: 61, rejected: 9 },
    { month: 'Feb', received: 65, disposed: 58, rejected: 11 },
    { month: 'Mar', received: 78, disposed: 66, rejected: 14 },
    { month: 'Apr', received: 81, disposed: 69, rejected: 12 },
    { month: 'May', received: 73, disposed: 63, rejected: 10 },
    { month: 'Jun', received: 86, disposed: 74, rejected: 13 },
    { month: 'Jul', received: 92, disposed: 78, rejected: 15 }
  ];

  const departmentData = [
    { department: 'Revenue', complaints: 156, percentage: 32 },
    { department: 'PWD', complaints: 124, percentage: 25 },
    { department: 'Social Welfare', complaints: 98, percentage: 20 },
    { department: 'Education', complaints: 67, percentage: 14 },
    { department: 'Others', complaints: 45, percentage: 9 }
  ];

  const districtData = [
    { district: 'Bhopal', total: 89, allegation: 54, grievance: 35 },
    { district: 'Indore', total: 76, allegation: 42, grievance: 34 },
    { district: 'Gwalior', total: 65, allegation: 38, grievance: 27 },
    { district: 'Ujjain', total: 52, allegation: 31, grievance: 21 },
    { district: 'Jabalpur', total: 48, allegation: 28, grievance: 20 }
  ];

  const statusDistribution = [
    { name: 'In Progress', value: 145, color: '#f59e0b' },
    { name: 'Under Investigation', value: 89, color: '#3b82f6' },
    { name: 'Disposed - Accepted', value: 67, color: '#10b981' },
    { name: 'Disposed - Rejected', value: 34, color: '#ef4444' },
    { name: 'Awaiting Response', value: 23, color: '#8b5cf6' }
  ];

  const processingTimeData = [
    { stage: 'Entry to Verification', avg: 2.3, target: 3 },
    { stage: 'Verification to Forward', avg: 4.1, target: 5 },
    { stage: 'Forward to Assignment', avg: 1.8, target: 2 },
    { stage: 'Assignment to Investigation', avg: 12.5, target: 15 },
    { stage: 'Investigation to Decision', avg: 18.7, target: 20 },
    { stage: 'Decision to Disposal', avg: 3.2, target: 5 }
  ];

  const workloadData = [
    { role: 'RO/ARO', pending: 23, completed: 156 },
    { role: 'Section Officer', pending: 18, completed: 134 },
    { role: 'DS/JS', pending: 12, completed: 98 },
    { role: 'Secretary', pending: 8, completed: 87 },
    { role: 'CIO/IO', pending: 15, completed: 45 },
    { role: 'LokAyukta', pending: 6, completed: 78 }
  ];

  const weeklyActivity = [
    { day: 'Mon', entries: 12, disposals: 8, investigations: 3 },
    { day: 'Tue', entries: 15, disposals: 11, investigations: 5 },
    { day: 'Wed', entries: 18, disposals: 14, investigations: 4 },
    { day: 'Thu', entries: 14, disposals: 16, investigations: 6 },
    { day: 'Fri', entries: 16, disposals: 12, investigations: 7 },
    { day: 'Sat', entries: 8, disposals: 6, investigations: 2 },
    { day: 'Sun', entries: 4, disposals: 3, investigations: 1 }
  ];

  const slaCompliance = [
    { metric: 'Entry SLA', value: 95, target: 90 },
    { metric: 'Verification SLA', value: 87, target: 85 },
    { metric: 'Investigation SLA', value: 78, target: 80 },
    { metric: 'Disposal SLA', value: 82, target: 85 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard / डैशबोर्ड</h1>
          <p className="text-gray-600">
            Welcome back, {userRole} • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FaCalendarAlt className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Button variant="outline" size="sm">
            <FaChartLine className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">

  {/* Total Complaints */}
  <div className="p-5 rounded-2xl shadow-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FaFileAlt className="text-2xl text-blue-600" />
        <h3 className="text-sm font-medium text-blue-800">Total Complaints</h3>
      </div>
      <div className="text-green-600 text-sm font-semibold">↑ 12%</div>
    </div>
    <div className="mt-4 text-3xl font-extrabold text-blue-900">1,247</div>
    <div className="text-sm text-blue-700">All time</div>
  </div>

  {/* Today's Entry */}
  <div className="p-5 rounded-2xl shadow-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FaClock className="text-2xl text-indigo-600" />
        <h3 className="text-sm font-medium text-indigo-800">Today's Entry</h3>
      </div>
      <div className="text-green-600 text-sm font-semibold">↑ 8%</div>
    </div>
    <div className="mt-4 text-3xl font-extrabold text-indigo-900">18</div>
    <div className="text-sm text-indigo-700">New complaints</div>
  </div>

  {/* Disposed */}
  <div className="p-5 rounded-2xl shadow-md border border-green-200 bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FaCheckCircle className="text-2xl text-green-600" />
        <h3 className="text-sm font-medium text-green-800">Disposed</h3>
      </div>
      <div className="text-green-600 text-sm font-semibold">↑ 5%</div>
    </div>
    <div className="mt-4 text-3xl font-extrabold text-green-900">842</div>
    <div className="text-sm text-green-700">67.5% of total</div>
  </div>

  {/* Rejected */}
  <div className="p-5 rounded-2xl shadow-md border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FaTimesCircle className="text-2xl text-red-600" />
        <h3 className="text-sm font-medium text-red-800">Rejected</h3>
      </div>
      <div className="text-red-600 text-sm font-semibold">↓ 3%</div>
    </div>
    <div className="mt-4 text-3xl font-extrabold text-red-900">156</div>
    <div className="text-sm text-red-700">12.5% of total</div>
  </div>

  {/* In Progress */}
  <div className="p-5 rounded-2xl shadow-md border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FaExclamationTriangle className="text-2xl text-yellow-600" />
        <h3 className="text-sm font-medium text-yellow-800">In Progress</h3>
      </div>
    </div>
    <div className="mt-4 text-3xl font-extrabold text-yellow-900">249</div>
    <div className="text-sm text-yellow-700">20% of total</div>
  </div>

  {/* Avg. Processing */}
  <div className="p-5 rounded-2xl shadow-md border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <FaClock className="text-2xl text-teal-600" />
        <h3 className="text-sm font-medium text-teal-800">Avg. Processing</h3>
      </div>
      <div className="text-red-600 text-sm font-semibold">↓ 2%</div>
    </div>
    <div className="mt-4 text-3xl font-extrabold text-teal-900">15.4 days</div>
    <div className="text-sm text-teal-700">Target: 20 days</div>
  </div>

</div>



      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Complaint Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="received" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Received"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="disposed" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Disposed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rejected" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Rejected"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department-wise Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="department" type="category" width={100} stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="complaints" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* District-wise Stacked Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>District-wise Allegations vs Grievances</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="district" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="allegation" stackId="a" fill="#ef4444" name="Allegations" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="grievance" stackId="a" fill="#f59e0b" name="Grievances" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={weeklyActivity}>
                    <defs>
                      <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDisposals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvestigations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="entries" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorEntries)"
                      name="Entries"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="disposals" 
                      stackId="1" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorDisposals)"
                      name="Disposals"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="investigations" 
                      stackId="1" 
                      stroke="#ffc658" 
                      fillOpacity={1} 
                      fill="url(#colorInvestigations)"
                      name="Investigations"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Processing Time vs Target */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Time vs Target (Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={processingTimeData} layout="vertical" margin={{ left: 150 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="stage" type="category" width={150} stroke="#6b7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="avg" fill="#3b82f6" name="Actual Time" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="target" fill="#e5e7eb" name="Target Time" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* SLA Compliance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {slaCompliance.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{item.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {item.value}%
                    </div>
                    <Badge 
                      variant={item.value >= item.target ? "default" : "destructive"}
                      className={item.value >= item.target ? "bg-green-100 text-green-600" : ""}
                    >
                      Target: {item.target}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${item.value >= item.target ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          {/* Role-wise Workload */}
          <Card>
            <CardHeader>
              <CardTitle>Role-wise Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workloadData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="role" type="category" width={100} stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaBullseye className="h-5 w-5" />
                  Overall Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">86%</div>
                  <p className="text-sm text-gray-500">Meeting SLA targets</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUsers className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold">24</div>
                  <p className="text-sm text-gray-500">Currently online</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaBuilding className="h-5 w-5" />
                  Departments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold">8</div>
                  <p className="text-sm text-gray-500">Total departments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
