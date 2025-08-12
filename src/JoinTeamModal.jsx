import React, { useState } from 'react';

const JoinTeamModal = ({ isVisible, onClose, onJoinTeam, showNotification }) => {
  const [teamCode, setTeamCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teamCode.trim()) {
      showNotification('error', 'Please enter a team code');
      return;
    }

    if (teamCode.length !== 6) {
      showNotification('error', 'Team code must be 6 characters long');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to join team
    setTimeout(() => {
      // For demo purposes, we'll accept any 6-character code
      const isValidCode = teamCode.length === 6;
      
      if (isValidCode) {
        onJoinTeam(teamCode);
        showNotification('success', `Successfully joined team with code: ${teamCode}`);
      } else {
        showNotification('error', 'Invalid team code. Please check and try again.');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setTeamCode(value);
    }
  };

  const handleClose = () => {
    setTeamCode('');
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Team</h2>
          <p className="text-gray-600">Enter the team code to join an existing team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Code
            </label>
            <input
              type="text"
              value={teamCode}
              onChange={handleInputChange}
              placeholder="Enter 6-character code"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl font-mono tracking-widest bg-gray-50 transition-all duration-200"
              maxLength={6}
              disabled={isLoading}
              autoComplete="off"
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              {teamCode.length}/6 characters
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">💡</span>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Need a team code?</h4>
                <p className="text-sm text-blue-700">
                  Ask your team leader for the 6-character team code that was generated when they created the team.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || teamCode.length !== 6}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </>
              ) : (
                <span>Join Team</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinTeamModal;

