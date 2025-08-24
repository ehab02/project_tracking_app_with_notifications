import React, { useState, useEffect } from 'react';

const NewDashboard = ({ username, userType, onLogout, teamCode }) => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [greeting, setGreeting] = useState('Good Morning');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sample data for the dashboard
  const [projectData, setProjectData] = useState({
    name: 'Graduation Project System',
    teamCode: teamCode || 'XXXXX',
    tasks: {
      inProgress: 8,    // Number of tasks in progress
      pending: 12,      // Number of pending tasks  
      completed: 5      // Number of completed tasks
    }
  });

  // Calculate project completion percentage based on completed tasks
  const totalTasks = projectData.tasks.inProgress + projectData.tasks.pending + projectData.tasks.completed;
  const completionPercentage = totalTasks > 0 ? Math.round((projectData.tasks.completed / totalTasks) * 100) : 0;

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', avatar: 'J', color: 'bg-blue-500' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'S', color: 'bg-purple-500' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'M', color: 'bg-green-500' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', avatar: 'E', color: 'bg-orange-500' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', avatar: 'A', color: 'bg-red-500' }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, title: 'Homepage Dealer', date: '2024-05-05', status: 'completed', color: 'bg-green-500' },
    { id: 2, title: 'Willis Documentation', date: '2024-05-12', status: 'overdue', color: 'bg-red-500' },
    { id: 3, title: 'Update Website', date: '2024-05-19', status: 'upcoming', color: 'bg-blue-500' },
    { id: 4, title: 'Blog Pics', date: '2024-05-22', status: 'upcoming', color: 'bg-blue-400' },
    { id: 5, title: 'Mobile App', date: '2024-05-29', status: 'completed', color: 'bg-green-500' }
  ]);

  // Update greeting based on time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    { id: 'Dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'Tasks', name: 'Tasks', icon: '✓' },
    { id: 'Files', name: 'Files', icon: '📁' },
    { id: 'Discussion', name: 'Discussion', icon: '💬' },
    { id: 'Settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderProjectOverview = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Overview</h2>
      
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          {/* Circular Progress Chart */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${completionPercentage * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">{completionPercentage}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-600">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{projectData.tasks.inProgress}</div>
          <div className="text-xs text-gray-500">Tasks</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{projectData.tasks.pending}</div>
          <div className="text-xs text-gray-500">Tasks</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-4 h-4 bg-blue-800 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{projectData.tasks.completed}</div>
          <div className="text-xs text-gray-500">Tasks</div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
    
    // Generate calendar days for May 2024 (as shown in the design)
    const daysInMonth = 31;
    const firstDayOfMonth = 3; // May 1st, 2024 was a Wednesday (index 3)
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const taskForDay = upcomingTasks.find(task => {
        const taskDate = new Date(task.date);
        return taskDate.getDate() === day && taskDate.getMonth() === 4; // May is month 4
      });
      
      days.push({
        day,
        task: taskForDay
      });
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">{currentMonth}</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayData, index) => (
            <div key={index} className="aspect-square">
              {dayData ? (
                <div className="h-full flex flex-col items-center justify-center relative">
                  <span className="text-sm font-medium text-gray-700 mb-1">{dayData.day}</span>
                  {dayData.task && (
                    <div className={`text-xs px-2 py-1 rounded-full text-white ${dayData.task.color} truncate max-w-full`}>
                      {dayData.task.title}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Overdue</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Timeline</h2>
      
      <div className="space-y-6">
        {/* Timeline items would go here */}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">Timeline View</p>
            <p className="text-sm">Project timeline will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{greeting}, {username}!</h1>
                  <p className="text-gray-600">Here's what's happening with your project today.</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🚀</span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Name</h3>
                  <p className="text-gray-600">{projectData.name}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Code</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-blue-700">{projectData.teamCode}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(projectData.teamCode)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {renderProjectOverview()}
                
                {/* Team Members */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
                    <span className="text-sm text-gray-500">{teamMembers.length} members</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {renderCalendar()}
                {renderTimeline()}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-gray-400">🚧</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              This section is under development. Stay tuned for updates!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">LOGAN</h1>
              <p className="text-xs text-gray-500">Project Management</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{username}</p>
              <p className="text-sm text-gray-500">{userType}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <div className="p-8">
          {renderMainContent()}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
              <p className="text-gray-600 mb-8">Are you sure you want to logout from your account?</p>
              <div className="flex space-x-4">
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Logout
                </button>
                <button
                  onClick={cancelLogout}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDashboard;

