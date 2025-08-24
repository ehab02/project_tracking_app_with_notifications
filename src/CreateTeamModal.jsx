
import React, { useState, useEffect } from 'react';

const CreateTeamModal = ({ isVisible, onClose, onTeamCreated, showNotification }) => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    supervisor: '',
    memberEmails: ['']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);
  const [emailErrors, setEmailErrors] = useState([]);

  // Fetch supervisors when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchSupervisors();
    }
  }, [isVisible]);

  const fetchSupervisors = async () => {
    setLoadingSupervisors(true);
    try {
      const response = await fetch('http://localhost:5000/supervisors/available' );
      const data = await response.json();
      if (data.success) {
        setSupervisors(data.data);
      } else {
        showNotification('error', 'Failed to load supervisors');
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      showNotification('error', 'Failed to load supervisors');
    } finally {
      setLoadingSupervisors(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.projectTitle.trim() || !formData.description.trim() || !formData.supervisor.trim()) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Validate member emails and set errors
    const newEmailErrors = [];
    let hasInvalidEmails = false;
    
    formData.memberEmails.forEach((email, index) => {
      if (email.trim() !== '' && !email.endsWith('@gmail.com')) {
        newEmailErrors[index] = 'Email must end with @gmail.com';
        hasInvalidEmails = true;
      } else {
        newEmailErrors[index] = '';
      }
    });
    
    setEmailErrors(newEmailErrors);
    
    if (hasInvalidEmails) {
      return; // Don't submit if there are validation errors
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

    setIsLoading(true);
    try {
      await onTeamCreated(teamData); // Changed from onCreateTeam to onTeamCreated
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Creating team...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we set up your team</p>
            </div>
          </div>
        )}
        
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
            <select
              name="supervisor"
              value={formData.supervisor}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200"
              required
              disabled={loadingSupervisors}
            >
              <option value="">
                {loadingSupervisors ? 'Loading supervisors...' : 'Select a supervisor'}
              </option>
              {supervisors.map((supervisor) => (
                <option key={supervisor._id} value={supervisor._id}>
                  {supervisor.username} ({supervisor.email})
                </option>
              ))}
            </select>
            {supervisors.length === 0 && !loadingSupervisors && (
              <p className="text-sm text-red-500 mt-2">No supervisors available</p>
            )}
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
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
                <div key={index}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      placeholder="Add member emails"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 transition-all duration-200 ${
                        emailErrors[index] ? 'border-red-500' : 'border-gray-200'
                      }`}
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
                  {emailErrors[index] && (
                    <p className="text-red-500 text-sm mt-1 ml-1">{emailErrors[index]}</p>
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
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;