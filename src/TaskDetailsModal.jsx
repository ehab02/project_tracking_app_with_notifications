import React, { useState, useEffect } from 'react';

const TaskDetailsModal = ({ isOpen, onClose, task, onUpdateTask, onDeleteTask, teamMembers = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});

  // Sample team members if none provided
  const defaultMembers = [
    { id: 1, name: 'Annio Ferguson', avatar: 'A', color: 'bg-purple-500' },
    { id: 2, name: 'Danne Smith', avatar: 'D', color: 'bg-blue-500' },
    { id: 3, name: 'Kelph Johnson', avatar: 'K', color: 'bg-green-500' },
    { id: 4, name: 'Kathryn Wilson', avatar: 'K', color: 'bg-orange-500' }
  ];

  const members = teamMembers.length > 0 ? teamMembers : defaultMembers;

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        assignee: task.assignee?.id || task.assignee
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const selectedMember = members.find(m => m.id.toString() === editedTask.assignee.toString());
    const updatedTask = {
      ...editedTask,
      assignee: selectedMember || editedTask.assignee
    };
    onUpdateTask(updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
      onClose();
    }
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

  if (!isOpen || !task) return null;

  const currentAssignee = typeof editedTask.assignee === 'object' 
    ? editedTask.assignee 
    : members.find(m => m.id.toString() === editedTask.assignee?.toString()) || task.assignee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
                name="deadline"
                value={editedTask.deadline || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">{task.deadline}</p>
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
                  Cancel
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
                  onClick={handleDelete}
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

