import React, { useState } from 'react';

const AddTaskModal = ({ isOpen, onClose, onAddTask, teamMembers = [] }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    assignee: ''
  });

  // Sample team members if none provided
  const defaultMembers = [
    { id: 1, name: 'Annio Ferguson', avatar: 'A', color: 'bg-purple-500' },
    { id: 2, name: 'Danne Smith', avatar: 'D', color: 'bg-blue-500' },
    { id: 3, name: 'Kelph Johnson', avatar: 'K', color: 'bg-green-500' },
    { id: 4, name: 'Kathryn Wilson', avatar: 'K', color: 'bg-orange-500' }
  ];

  const members = teamMembers.length > 0 ? teamMembers : defaultMembers;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskData.title && taskData.assignee && taskData.deadline) {
      const selectedMember = members.find(m => m.id.toString() === taskData.assignee);
      const newTask = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        assignee: selectedMember,
        status: 'Pending'
      };
      onAddTask(newTask);
      setTaskData({ title: '', description: '', deadline: '', assignee: '' });
      onClose();
    }
  };

  const handleCancel = () => {
    setTaskData({ title: '', description: '', deadline: '', assignee: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <div className="relative">
              <input
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            <div className="relative">
              <select
                name="assignee"
                value={taskData.assignee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                required
              >
                <option value="">Select team member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
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
            {taskData.assignee && (
              <div className="mt-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {(() => {
                  const selectedMember = members.find(m => m.id.toString() === taskData.assignee);
                  return selectedMember ? (
                    <>
                      <div className={`w-10 h-10 ${selectedMember.color} rounded-full flex items-center justify-center text-white font-medium`}>
                        {selectedMember.avatar}
                      </div>
                      <span className="text-gray-700 font-medium">{selectedMember.name}</span>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;

