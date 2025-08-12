import React from 'react';

const TeamSelectionModal = ({ isVisible, onCreateTeam, onJoinTeam, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600">Choose how you'd like to get started with your project</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onCreateTeam}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
          >
            <span className="text-2xl">👥</span>
            <span>Create New Team</span>
          </button>

          <button
            onClick={onJoinTeam}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
          >
            <span className="text-2xl">🤝</span>
            <span>Join Existing Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSelectionModal;

