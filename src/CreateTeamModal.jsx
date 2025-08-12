import React, { useState } from 'react';

const CreateTeamModal = ({ isVisible, onClose, onCreateTeam, showNotification }) => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    supervisor: '',
    memberEmails: ['']
  });

  if (!isVisible) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.memberEmails];
    newEmails[index] = value;
    setFormData(prev => ({
      ...prev,
      memberEmails: newEmails
    }));
  };

  const addEmailField = () => {
    if (formData.memberEmails.length < 3) { // Max 3 additional members (4 total including creator)
      setFormData(prev => ({
        ...prev,
        memberEmails: [...prev.memberEmails, '']
      }));
    } else {
      showNotification('error', 'Maximum 4 team members allowed (including you)');
    }
  };

  const removeEmailField = (index) => {
    if (formData.memberEmails.length > 1) {
      const newEmails = formData.memberEmails.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        memberEmails: newEmails
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.projectTitle.trim() || !formData.description.trim() || !formData.supervisor.trim()) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Filter out empty email fields
    const validEmails = formData.memberEmails.filter(email => email.trim() !== '');
    
    // Generate team code
    const teamCode = generateTeamCode();
    
    const teamData = {
      ...formData,
      memberEmails: validEmails,
      teamCode
    };

    onCreateTeam(teamData);
  };

  const generateTeamCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Team</h2>
          <p className="text-gray-600">Set up your project team and invite members</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <input
              type="text"
              name="projectTitle"
              placeholder="Project title"
              value={formData.projectTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200"
              required
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200 resize-none"
              required
            />
          </div>

          {/* Supervisor */}
          <div>
            <input
              type="text"
              name="supervisor"
              placeholder="Supervisor"
              value={formData.supervisor}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200"
              required
            />
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-medium text-gray-700">Members</label>
              <button
                type="button"
                onClick={addEmailField}
                className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                disabled={formData.memberEmails.length >= 3}
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.memberEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="email"
                    placeholder="Add member emails"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200"
                  />
                  {formData.memberEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Maximum 4 team members (including you). {4 - formData.memberEmails.length - 1} slots remaining.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;

