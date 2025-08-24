import React, { useState, useEffect } from 'react';
import AddTaskModal from './AddTaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import NotificationPopup from './NotificationPopup';

const Dashboard = ({ username, userType, onLogout, teamCode, projectData }) => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [greeting, setGreeting] = useState('Good Morning');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProjectDescription, setShowProjectDescription] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

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

  // Fetch data based on user type
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch dashboard data from new API
        const dashboardResponse = await fetch('http://localhost:5000/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log('Dashboard data received:', dashboardData);
          
          if (userType === 'Student' && dashboardData.data) {
            // For students, dashboardData.data contains the project info
            const projectInfo = dashboardData.data;
            setProjects([projectInfo]);
            
            // Set team members from project data
            if (projectInfo.members) {
              setTeamMembers(projectInfo.members);
            }
          } else if (userType === 'Supervisor' && Array.isArray(dashboardData.data)) {
            // For supervisors, dashboardData.data is an array of projects
            setProjects(dashboardData.data);
          }
        }
        
        // Legacy code for backward compatibility (can be removed later)
        if (userType === 'Supervisor') {
          // Fetch supervisor's projects
          const projectsResponse = await fetch('http://localhost:5000/supervisor/projects', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            if (!dashboardResponse.ok) { // Only use if dashboard API failed
              setProjects(projectsData.data || []);
            }
          }
        } else {
          // Fetch team members if in a project
          if (teamCode) {
            const membersResponse = await fetch(`http://localhost:5000/projects/members/${teamCode}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (membersResponse.ok) {
              const membersData = await membersResponse.json();
              setTeamMembers(membersData.data || []);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setNotificationMessage('Failed to fetch dashboard data');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userType]);

  // useEffect لتحميل المهام عند الانتقال إلى قسم Tasks أو عند تحميل الداشبورد
  useEffect(() => {
    if (activeSection === 'Tasks' || activeSection === 'Dashboard') {
      const fetchTasksOnly = async () => {
        if (activeSection === 'Tasks') {
          setTasksLoading(true);
        }
        try {
          const token = localStorage.getItem('token');
          const tasksResponse = await fetch('http://localhost:5000/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            console.log('Tasks loaded for section:', activeSection, tasksData);
            setTasks(tasksData.data || []);
          }
        } catch (error) {
          console.error('Error loading tasks for section:', activeSection, error);
        } finally {
          if (activeSection === 'Tasks') {
            setTasksLoading(false);
          }
        }
      };
      
      fetchTasksOnly();
    }
  }, [activeSection]);

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
    { id: 'Dashboard', name: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7M19 10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V9a1 1 0 00-1-1h-2a1 1 0 00-1 1v3m-3 0a1 1 0 001 1h2a1 1 0 001-1v-3" />
      </svg>
    ) },
    { id: 'Tasks', name: 'Tasks', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ) },
    { id: 'Files', name: 'Files', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ) },
    { id: 'Discussion', name: 'Discussion', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ) },
    { id: 'Settings', name: 'Settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) }
  ];

  // دالة للحصول على اسم المستخدم المعين للمهمة
  const getAssigneeName = (task) => {
    // البحث في جميع الحقول المحتملة للمستخدم المعين
    if (task.assignedTo?.username) {
      return task.assignedTo.username;
    }
    if (task.userId?.username) {
      return task.userId.username;
    }
    if (task.assignee?.username) {
      return task.assignee.username;
    }
    if (task.assignedTo?.name) {
      return task.assignedTo.name;
    }
    if (task.userId?.name) {
      return task.userId.name;
    }
    if (task.assignee?.name) {
      return task.assignee.name;
    }
    
    // البحث في قائمة أعضاء الفريق بناءً على ID
    const assigneeId = task.assignedTo?._id || task.assignedTo || task.userId?._id || task.assignee;
    if (assigneeId && teamMembers.length > 0) {
      const member = teamMembers.find(m => m._id === assigneeId || m.id === assigneeId);
      if (member) {
        return member.username || member.name;
      }
    }
    
    return 'Unknown';
  };

  // دالة للحصول على الحرف الأول لاسم المستخدم
  const getAssigneeInitial = (task) => {
    const name = getAssigneeName(task);
    return name && name !== 'Unknown' ? name.charAt(0).toUpperCase() : 'U';
  };

  // دالة لتنسيق التاريخ بشكل صحيح
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      // التحقق من صحة التاريخ
      if (isNaN(date.getTime())) return 'Invalid date';
      
      // تنسيق التاريخ بصيغة DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleNotifications = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
  };

  const handleAddTask = async (newTask) => {
    // إعادة تحميل البيانات من الخادم بعد إضافة مهمة جديدة
    try {
      const token = localStorage.getItem('token');
      
      // جلب بيانات الداشبورد المحدثة
      const dashboardResponse = await fetch('http://localhost:5000/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        
        if (userType === 'Student' && dashboardData.data) {
          const projectInfo = dashboardData.data;
          setProjects([projectInfo]);
          
          if (projectInfo.members) {
            setTeamMembers(projectInfo.members);
          }
          
          if (projectInfo.progressSummary && projectInfo.progressSummary.tasks) {
            setTasks(projectInfo.progressSummary.tasks);
          }
        }
      }
      
      // جلب المهام المحدثة
      const tasksResponse = await fetch('http://localhost:5000/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.data || []);
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleUpdateTask = async (updatedTask) => {
    // إعادة تحميل البيانات من الخادم بعد تحديث مهمة
    try {
      const token = localStorage.getItem('token');
      
      // جلب بيانات الداشبورد المحدثة
      const dashboardResponse = await fetch('http://localhost:5000/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        
        if (userType === 'Student' && dashboardData.data) {
          const projectInfo = dashboardData.data;
          setProjects([projectInfo]);
          
          if (projectInfo.members) {
            setTeamMembers(projectInfo.members);
          }
          
          if (projectInfo.progressSummary && projectInfo.progressSummary.tasks) {
            setTasks(projectInfo.progressSummary.tasks);
          }
        }
      }
      
      // جلب المهام المحدثة
      const tasksResponse = await fetch('http://localhost:5000/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.data || []);
      }
    } catch (error) {
      console.error('Error refreshing tasks after update:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    // إعادة تحميل البيانات من الخادم بعد حذف مهمة
    try {
      const token = localStorage.getItem('token');
      
      // جلب بيانات الداشبورد المحدثة
      const dashboardResponse = await fetch('http://localhost:5000/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        
        if (userType === 'Student' && dashboardData.data) {
          const projectInfo = dashboardData.data;
          setProjects([projectInfo]);
          
          if (projectInfo.members) {
            setTeamMembers(projectInfo.members);
          }
          
          if (projectInfo.progressSummary && projectInfo.progressSummary.tasks) {
            setTasks(projectInfo.progressSummary.tasks);
          }
        }
      }
      
      // جلب المهام المحدثة
      const tasksResponse = await fetch('http://localhost:5000/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.data || []);
      }
    } catch (error) {
      console.error('Error refreshing tasks after delete:', error);
    }
  };

  const showNotificationMessage = (type, message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Calculate project statistics
  const getProjectStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionPercentage
    };
  };

  const stats = getProjectStats();

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getTaskColor = (task) => {
    if (task.status === 'Completed') return 'bg-green-500';
    if (new Date(task.dueDate) < new Date() && task.status !== 'Completed') return 'bg-red-500';
    return 'bg-blue-500'; // Upcoming tasks
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`h-12 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 relative ${
            isToday ? 'bg-blue-100 text-blue-600 font-bold' : 
            isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
          }`}
          onClick={() => setSelectedDate(date)}
          onMouseEnter={(e) => {
            if (dayTasks.length > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoverPosition({ x: rect.left + rect.width / 2, y: rect.top });
              setHoveredDate(date);
            }
          }}
          onMouseLeave={() => {
            setHoveredDate(null);
          }}
        >
          <span className="text-sm">{day}</span>
          {dayTasks.length > 0 && (
            <div className="flex space-x-1 mt-1">
              {dayTasks.slice(0, 3).map((task, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${getTaskColor(task)}`}
                  title={task.title}
                />
              ))}
              {dayTasks.length > 3 && (
                <span className="text-xs text-gray-500">+{dayTasks.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Hover tooltip for tasks */}
        {hoveredDate && (
          <div 
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs"
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y - 10}px`,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
          >
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {hoveredDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="space-y-1">
              {getTasksForDate(hoveredDate).map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getTaskColor(task)}`}></div>
                  <span className="text-xs text-gray-700 truncate">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-6 mt-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Overdue</span>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectOverview = () => {
    // استخدام بيانات progressSummary من الباك إند
    const progressSummary = projects.length > 0 && projects[0].progressSummary ? projects[0].progressSummary : {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      completionPercentage: 0
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Project Overview</h3>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              {/* Completed tasks - Green */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray={`${progressSummary.completedTasks > 0 ? (progressSummary.completedTasks / progressSummary.totalTasks) * 100 : 0}, 100`}
                strokeDashoffset="0"
              />
              {/* In Progress tasks - Blue */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray={`${progressSummary.inProgressTasks > 0 ? (progressSummary.inProgressTasks / progressSummary.totalTasks) * 100 : 0}, 100`}
                strokeDashoffset={`-${progressSummary.completedTasks > 0 ? (progressSummary.completedTasks / progressSummary.totalTasks) * 100 : 0}`}
              />
              {/* Pending tasks - Orange */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray={`${progressSummary.pendingTasks > 0 ? (progressSummary.pendingTasks / progressSummary.totalTasks) * 100 : 0}, 100`}
                strokeDashoffset={`-${((progressSummary.completedTasks + progressSummary.inProgressTasks) / progressSummary.totalTasks) * 100}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{progressSummary.completionPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{progressSummary.inProgressTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{progressSummary.pendingTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{progressSummary.completedTasks}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSupervisorCard = () => {
    if (userType === 'Student' && projects.length > 0 && projects[0].supervisor) {
      const supervisor = projects[0].supervisor;
      return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {supervisor.username?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Project Supervisor</h3>
              <p className="text-lg font-semibold">{supervisor.username}</p>
              <p className="text-purple-100">{supervisor.email}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTeamMembers = () => {
    if (userType === 'Supervisor') {
      // Show all students from all supervised projects
      const allStudents = projects.flatMap(project => project.members || []);
      const uniqueStudents = allStudents.filter((student, index, self) => 
        index === self.findIndex(s => s._id === student._id)
      );

      return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Supervised Students</h3>
            <span className="text-sm text-gray-500">{uniqueStudents.length} students</span>
          </div>
          
          <div className="space-y-4">
            {uniqueStudents.slice(0, 5).map((student) => (
  <div key={student._id} className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
        {student.username?.charAt(0).toUpperCase() || 'S'}
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">
          {student.username}{" "}
          <span className="text-sm text-gray-600">
            ({student.email})
          </span>
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-xs text-gray-500">Active</span>
    </div>
  </div>
))}

          </div>
        </div>
      );
    } else {
      // Show team members for students
      return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
            <span className="text-sm text-gray-500">{teamMembers.length} members</span>
          </div>
          
          <div className="space-y-4">
            {teamMembers.slice(0, 5).map((member, index) => (
              <div key={member._id} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.username?.charAt(0).toUpperCase() || 'M'}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{member.username} <span className="text-sm text-gray-600">({member.email})</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderProjectInfo = () => {
    if (userType === 'Supervisor') {
      return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{greeting}, {username}</h2>
              <h3 className="text-xl font-bold">Supervisor Dashboard</h3>
              <p className="text-blue-100">Managing {projects.length} projects</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm text-blue-100">Total Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm text-blue-100">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.totalTasks}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm text-blue-100">Completion</p>
              <p className="text-2xl font-bold">{stats.completionPercentage}%</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-bold mb-2 text-left">{greeting}, {username}</h2>
              <h3 className="text-xl font-bold mb-1 text-left">
                {projects.length > 0 && projects[0].projectName ? projects[0].projectName : 'Project Dashboard'}
              </h3>
              <p className="text-green-100 text-left">
                Team Code: {projects.length > 0 && projects[0].teamCode ? projects[0].teamCode : (teamCode || 'Not assigned')}
              </p>
              <p className="text-green-100 text-left">
                Final Discussion: {projects.length > 0 && projects[0].finalPresentation && projects[0].finalPresentation.date 
                  ? new Date(projects[0].finalPresentation.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : 'Not scheduled yet'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm text-green-100">My Tasks</p>
              <p className="text-2xl font-bold">{projects.length > 0 && projects[0].myTaskSummary ? projects[0].myTaskSummary.totalTasks : 0}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm text-green-100">Completed</p>
              <p className="text-2xl font-bold">{projects.length > 0 && projects[0].myTaskSummary ? projects[0].myTaskSummary.completedTasks : 0}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm text-green-100">Progress</p>
              <p className="text-2xl font-bold">{projects.length > 0 && projects[0].myTaskSummary ? projects[0].myTaskSummary.completionPercentage : 0}%</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowProjectDescription(true)}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Project Description</span>
            </button>
            
            <button 
              onClick={() => {
                const codeToUse = projects.length > 0 && projects[0].teamCode ? projects[0].teamCode : teamCode;
                if (codeToUse) {
                  navigator.clipboard.writeText(codeToUse);
                  setNotificationMessage('Team code copied to clipboard!');
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                } else {
                  setNotificationMessage('No team code available');
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                }
              }}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Copy Code</span>
            </button>
          </div>
        </div>
      );
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Info */}
              {renderProjectInfo()}
              
              {/* Calendar */}
              {renderCalendar()}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Supervisor Card for Students */}
              {renderSupervisorCard()}
              
              {/* Project Overview */}
              {renderProjectOverview()}
              
              {/* Team Members */}
              {renderTeamMembers()}
            </div>
          </div>
        );
      case 'Tasks':
        return (
          <div className="space-y-6 relative">
            {/* Task List Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Task List</h2>
              
              {/* Loading State */}
              {tasksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Task Table Header */}
                  <div className="grid grid-cols-5 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Assignee</div>
                    <div>Deadline</div>
                    <div>Reminder</div>
                  </div>
                  
                  {/* Dynamic Tasks */}
                  <div className="space-y-4 mt-4">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div 
                          key={task._id} 
                          className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100 items-center cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="font-medium text-gray-800">{task.title}</div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              task.status === 'Completed' ? 'bg-green-100 text-green-600' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 justify-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {getAssigneeInitial(task)}
                            </div>
                            <span className="text-gray-600">{getAssigneeName(task)}</span>
                          </div>
                          <div className="text-gray-600">
                            {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                          </div>
                          <div className="text-gray-600">
                            {task.reminderDate ? (
                              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                {formatDate(task.reminderDate)}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">No reminder</span>
                            )
                            }
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No tasks available.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Floating Add Button */}
            {userType !== 'Supervisor' && (
              <button
                onClick={() => setShowAddTask(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
              >
                <span className="text-2xl font-light">+</span>
              </button>
            )}
          </div>
        );
      case 'Files':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Files</h2>
            <p className="text-gray-500">File management section coming soon!</p>
          </div>
        );
      case 'Discussion':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion Board</h2>
            <p className="text-gray-500">Discussion features coming soon!</p>
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
                      <span className="text-2xl text-white">{username?.charAt(0).toUpperCase()}</span>
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
                  
                  {/* User Type Display */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {userType === 'Supervisor' ? '👨‍🏫' : '👨‍🎓'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={userType}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">Account type cannot be changed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                    <input
                      type="text"
                      value={userType}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>
                  {teamCode && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Team Code</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={teamCode}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-mono"
                        disabled
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(teamCode);
                          setNotificationMessage('Team code copied to clipboard!');
                          setShowNotification(true);
                          setTimeout(() => setShowNotification(false), 3000);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
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

            {/* Notifications Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" className="sr-only peer" disabled defaultChecked />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Push Notifications</p>
                    <p className="text-sm text-gray-400">Browser push notifications (Coming Soon)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer"></div>
                  </label>
                </div>
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
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col overflow-y-auto">
        <div className="flex-1 p-6">
          <nav>
            <ul className="space-y-2">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Profile at Bottom of Sidebar */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{username || 'User'}</p>
              <p className="text-sm text-gray-500">{userType || 'Student'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{activeSection}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                userType === 'Supervisor' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userType}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative notifications-dropdown">
                <button
                  onClick={handleNotifications}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                </button>
                
                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-center">No new notifications</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Logout */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      {showAddTask && (
        <AddTaskModal
          isVisible={showAddTask}
          onClose={() => setShowAddTask(false)}
          onTaskAdded={handleAddTask}
          showNotification={(type, message) => {
            setNotificationMessage(message);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
          }}
        />
      )}

      {showTaskDetails && selectedTask && (
        <TaskDetailsModal
          isVisible={showTaskDetails}
          task={selectedTask}
          onClose={() => {
            setShowTaskDetails(false);
            setSelectedTask(null);
          }}
          onUpdate={handleUpdateTask}
          showNotification={(type, message) => {
            setNotificationMessage(message);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
          }}
        />
      )}

      {showNotification && (
        <NotificationPopup
          isVisible={showNotification}
          type="success"
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        teamMembers={teamMembers}
        showNotification={showNotificationMessage}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isVisible={showAddTask}
        onClose={() => setShowAddTask(false)}
        onTaskAdded={handleAddTask}
        showNotification={showNotificationMessage}
      />

      {/* Notification Popup */}
      <NotificationPopup
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />

      {/* Project Description Modal */}
      {showProjectDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Project Description</h2>
              <button
                onClick={() => setShowProjectDescription(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {projects.length > 0 && projects[0].description 
                    ? projects[0].description 
                    : 'No project description available. Please contact your supervisor to add a project description.'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowProjectDescription(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Confirm Logout</h2>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                Are you sure you want to logout? You will need to login again to access your dashboard.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
              onClick={() => {
              setShowLogoutConfirm(false);
              onLogout();
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;