import React, { useState, useEffect } from 'react';

const TaskDetailsModal = ({ isOpen, onClose, task, onUpdateTask, onDeleteTask, teamMembers = [], showNotification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        assignee: task.assignedTo?._id || task.assignedTo || task.assignee
      });
    }
  }, [task]);

  // إعادة تعيين حالة التعديل عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        dueDate: editedTask.dueDate,
        reminderDate: editedTask.reminderDate,
        assignedTo: editedTask.assignee
      };

      console.log('Updating task:', updateData);

      const response = await fetch(`http://localhost:5000/task/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Task updated successfully:', result);
        
        if (onUpdateTask) {
          onUpdateTask(result.data || result);
        }
        
        if (showNotification) {
          showNotification('success', 'Task updated successfully!');
        }
        
        setIsEditing(false);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error updating task:', errorData);
        
        if (showNotification) {
          showNotification('error', errorData.message || 'Failed to update task');
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      
      if (showNotification) {
        showNotification('error', 'Failed to update task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/task/${task._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('Task deleted successfully');
        
        if (onDeleteTask) {
          onDeleteTask(task._id);
        }
        
        if (showNotification) {
          showNotification('success', 'Task deleted successfully!');
        }
        
        setShowDeleteConfirm(false);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error deleting task:', errorData);
        
        if (showNotification) {
          showNotification('error', errorData.message || 'Failed to delete task');
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      
      if (showNotification) {
        showNotification('error', 'Failed to delete task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
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

  // دالة لتنسيق التاريخ بشكل صحيح
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline set';
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

  // دالة لتنسيق تاريخ التذكير
  const formatReminderDate = (dateString) => {
    if (!dateString) return 'No reminder set';
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

  // تحويل teamMembers إلى تنسيق مناسب للاستخدام
  const members = teamMembers.map(member => ({
    id: member._id || member.id,
    name: member.username || member.name,
    email: member.email
  }));

  if (!isOpen || !task) return null;

  const currentAssignee = typeof editedTask.assignee === 'object' 
    ? editedTask.assignee 
    : members.find(m => m.id.toString() === editedTask.assignee?.toString()) || task.assignee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={isEditing ? () => {
            setIsEditing(false);
            onClose();
          } : onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Assignee Avatar and Name */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 ${currentAssignee?.color || 'bg-gray-500'} rounded-full flex items-center justify-center text-white text-xl font-bold mb-3`}>
              {currentAssignee?.avatar || 'U'}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {currentAssignee?.name || 'Unknown User'}
            </h3>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedTask.title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{task.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editedTask.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            ) : (
              <p className="text-gray-600">{task.description || 'No description provided'}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            {isEditing ? (
              <select
                name="status"
                value={editedTask.status || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            )}
          </div>

          {/* Assignee (only in edit mode) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              <select
                name="assignee"
                value={editedTask.assignee?.id || editedTask.assignee || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            {isEditing ? (
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">{formatDate(task.dueDate)}</p>
            )}
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Date</label>
            {isEditing ? (
              <input
                type="date"
                name="reminderDate"
                value={editedTask.reminderDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">{formatReminderDate(task.reminderDate)}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDeleteClick}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;