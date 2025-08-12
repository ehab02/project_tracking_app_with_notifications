import React, { useState, useEffect } from 'react';
import AddTaskModal from './AddTaskModal';
import TaskDetailsModal from './TaskDetailsModal';

const Dashboard = ({ username, userType, onLogout }) => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [greeting, setGreeting] = useState('Good Morning');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design homepage',
      description: 'Create a modern and responsive homepage design with user-friendly interface',
      status: 'In Progress',
      assignee: { id: 1, name: 'Danne', avatar: 'D', color: 'bg-purple-500' },
      deadline: '2024-08-15'
    },
    {
      id: 2,
      title: 'Write documentation',
      description: 'Prepare comprehensive documentation for the project including API references',
      status: 'Completed',
      assignee: { id: 2, name: 'Kelph', avatar: 'K', color: 'bg-blue-500' },
      deadline: '2024-08-10'
    },
    {
      id: 3,
      title: 'Set up analytics',
      description: 'Implement Google Analytics and tracking systems for user behavior analysis',
      status: 'Pending',
      assignee: { id: 3, name: 'Kathryn', avatar: 'K', color: 'bg-green-500' },
      deadline: '2024-08-20'
    }
  ]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

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
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotificationsDropdown && !event.target.closest('.notifications-dropdown')) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationsDropdown]);

  const menuItems = [
    { id: 'Dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'Tasks', name: 'Tasks', icon: '✓' },
    { id: 'Files', name: 'Files', icon: '📁' },
    { id: 'Discussion', name: 'Discussion', icon: '💬' },
    { id: 'Settings', name: 'Settings', icon: '⚙️' }
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleNotifications = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
  };

  const handleAddAction = () => {
    alert('Add action clicked!');
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    setNotificationMessage('Task added successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setNotificationMessage('Task updated successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setNotificationMessage('Task deleted successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'In Progress':
        return 'bg-blue-100 text-blue-600';
      case 'Pending':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-gray-400">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Team Yet</h3>
              <p className="text-gray-500 max-w-md">
                You haven't joined or created a team yet. Create a new team or join an existing one to start tracking your projects.
              </p>
            </div>
          </div>
        );
      case 'Tasks':
        return (
          <div className="space-y-6 relative">
            {/* Task List Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Task List</h2>
              
              {/* Task Table Header */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div>Title</div>
                <div>Status</div>
                <div>Assignee</div>
                <div>Deadline</div>
              </div>
              
              {/* Dynamic Tasks */}
              <div className="space-y-4 mt-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 items-center cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="font-medium text-gray-800">{task.title}</div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 ${task.assignee.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                        {task.assignee.avatar}
                      </div>
                      <span className="text-gray-600">{task.assignee.name}</span>
                    </div>
                    <div className="text-gray-600">{task.deadline}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating Add Button */}
            <button
              onClick={() => setShowAddTask(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
            >
              <span className="text-2xl font-light">+</span>
            </button>
          </div>
        );
      case 'Files':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-gray-400">📁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Files Yet</h3>
              <p className="text-gray-500 max-w-md">
                You haven't joined or created a team yet. Join a team to start sharing and managing project files.
              </p>
            </div>
          </div>
        );
      case 'Discussion':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-gray-400">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Discussions Yet</h3>
              <p className="text-gray-500 max-w-md">
                You haven't joined or created a team yet. Join a team to start discussions with your supervisor and team members.
              </p>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
              
              {/* Profile Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-white">👤</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Display Name"
                        defaultValue={username}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">This feature will be available soon</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Language</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="english"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled
                    />
                    <span className="text-gray-700">English</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-not-allowed">
                    <input
                      type="radio"
                      name="language"
                      value="arabic"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled
                    />
                    <span className="text-gray-400">العربية (Coming Soon)</span>
                  </label>
                </div>
              </div>

              {/* Theme Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Theme</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">Light Mode</span>
                      <span className="text-lg">☀️</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-not-allowed">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Dark Mode (Coming Soon)</span>
                      <span className="text-lg">🌙</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 text-lg">ℹ️</span>
                  <div>
                    <h4 className="text-blue-800 font-medium">Coming Soon</h4>
                    <p className="text-blue-700 text-sm">
                      These settings are currently in development and will be available in future updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-blue-600 p-6 shadow-xl">
        {/* User Profile Card */}
        <div className="bg-blue-700 rounded-xl p-6 mb-6 text-white">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-lg font-semibold mb-1">{greeting}</h2>
            <p className="text-blue-200">{username}</p>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full mt-2">{userType}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              {activeSection === item.id && (
                <div className="ml-auto w-1 h-6 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <button
                onClick={handleNotifications}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                title="Notifications"
              >
                <span className="text-lg">🔔</span>
              </button>
              
              {/* Notifications Dropdown */}
              {showNotificationsDropdown && (
                <div className="notifications-dropdown absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">🔔</span>
                      </div>
                      <h4 className="text-gray-600 font-medium mb-2">No notifications yet</h4>
                      <p className="text-gray-500 text-sm">
                        You'll see notifications about your team activities here
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
              title="Logout"
            >
              <span className="text-lg">🚪</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={handleAddTask}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800">{notificationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

