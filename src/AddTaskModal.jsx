import React, { useState, useEffect } from 'react';

const AddTaskModal = ({ isVisible, onClose, onTaskAdded, showNotification }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    reminderDate: '',
    assignee: '',
    status: 'Pending'
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
  ];

  // Fetch team members when modal opens
  useEffect(() => {
    if (isVisible) {
      fetchTeamMembers();
      // تحديد أول عضو في الفريق كـ assignee افتراضي
      setTaskData(prev => ({
        ...prev,
        assignee: ''
      }));
    }
  }, [isVisible]);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // جلب بيانات الداشبورد للحصول على أعضاء الفريق الحقيقيين
      const dashboardResponse = await fetch('http://localhost:5000/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        
        if (dashboardData.data && dashboardData.data.members) {
          // عرض أعضاء الفريق فقط بدون المستخدم الحالي
          setTeamMembers(dashboardData.data.members);
        } else {
          // إذا لم توجد أعضاء، استخدم قائمة فارغة
          setTeamMembers([]);
        }
      } else {
        // في حالة فشل API، استخدم قائمة فارغة
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      // في حالة الخطأ، استخدم قائمة فارغة
      setTeamMembers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskData.title || !taskData.dueDate || !taskData.assignee) {
      showNotification("error", "Please fill in all required fields (Title, Due Date, and Assignee)");
      return;
    }

    // Validate reminder date is before due date
    if (taskData.reminderDate && new Date(taskData.reminderDate) >= new Date(taskData.dueDate)) {
      showNotification('error', 'Reminder date must be before due date');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        title: taskData.title,
        description: taskData.description || '', // Make description optional
        dueDate: taskData.dueDate,
        reminderDate: taskData.reminderDate || null,
        assignedTo: taskData.assignee,
        status: taskData.status
      };
      
      console.log('Sending task data:', requestData);
      
      const response = await fetch('http://localhost:5000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Task created successfully:', result);
        // تحديث قائمة المهام
        if (onTaskAdded) {
          onTaskAdded(result.data || result);
        }
        showNotification('success', 'Task added successfully!');
        handleCancel();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        showNotification('error', errorData.message || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      showNotification('error', 'Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTaskData({
      title: '',
      description: '',
      dueDate: '',
      reminderDate: '',
      assignee: '',
      status: 'Pending'
    });
    onClose();
  };

  const getSelectedMember = () => {
    return teamMembers.find(member => member._id === taskData.assignee);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter task title"
              required
              disabled={isLoading}
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Enter task description (optional)"
              rows="3"
              disabled={isLoading}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Date
            </label>
            <input
              type="date"
              name="reminderDate"
              value={taskData.reminderDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]}
              max={taskData.dueDate || undefined}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Set a reminder date before the due date
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <div className="relative">
              <select
                name="status"
                value={taskData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                required
                disabled={isLoading}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee *
            </label>
            <div className="relative">
              <select
                name="assignee"
                value={taskData.assignee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                required
                disabled={isLoading}
              >
                <option value="">Select team member</option>
                {teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.username}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Show selected member */}
            {taskData.assignee && getSelectedMember() && (
              <div className="mt-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {getSelectedMember().username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-gray-700 font-medium">{getSelectedMember().username}</span>
                  <p className="text-sm text-gray-500">{getSelectedMember().email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;