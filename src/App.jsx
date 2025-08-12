import React, { useState } from 'react';
import Dashboard from './Dashboard';
import SplashScreen from './SplashScreen';
import NotificationPopup from './NotificationPopup';
import TeamSelectionModal from './TeamSelectionModal';
import CreateTeamModal from './CreateTeamModal';
import JoinTeamModal from './JoinTeamModal';
import './index.css';

function CompleteApp() {
  const [currentPage, setCurrentPage] = useState('splash'); // 'splash', 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null); // Store user data
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSplashFinish = () => {
    setCurrentPage('login');
  };

  const LoginPageWithNavigation = () => {
    const [formData, setFormData] = useState({
      emailOrUsername: '',
      password: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData ),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.data.token); // Save the token
          setUser({
            username: data.data.username,
            userType: data.data.userType,
            email: data.data.email
          });
          showNotification('success', data.message || 'Login successful!');
          if (data.data.userType === 'Student') {
            setShowTeamSelection(true);
          } else {
            setCurrentPage('dashboard');
          }
        } else {
          showNotification("error", data.message || "Login failed!");
        }
      } catch (error) {
        console.error('Login error:', error);
        showNotification('error', 'Network error or server is unreachable.');
      }
    };


    const handleRegisterClick = () => {
      setCurrentPage('register');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              Login
            </h1>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                placeholder="Email or username"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out underline-offset-4 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-gray-600 text-base">
              Don't have an account?{' '}
              <button
                onClick={handleRegisterClick}
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out underline-offset-4 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const RegisterPageWithNavigation = () => {
    const [formData, setFormData] = useState({
      email: '',
      username: '',
      userType: '', // No default selection
      password: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData ),
        });

        const data = await response.json();

        if (response.ok) {
          showNotification('success', data.message || 'Account created successfully!');
          setCurrentPage('login'); 
        } else {
          showNotification('error', data.error || 'Registration failed!');
        }
      } catch (error) {
        console.error('Registration error:', error);
        showNotification('error', 'Network error or server is unreachable.');
      }
    };

    const handleLoginClick = () => {
      setCurrentPage('login');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              Register
            </h1>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Username Input */}
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            
            {/* User Type Dropdown */}
            <div>
              <select
                id="userType"
                name="userType"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                value={formData.userType}
                onChange={handleInputChange}
              >
                <option value="" disabled>Register as</option>
                <option value="Student">Student</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
            
            {/* Password Input */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Register Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Register
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-base">
              Already have an account?{' '}
              <button
                onClick={handleLoginClick}
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out underline-offset-4 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    showNotification('success', 'Logged out successfully!');
  };

  const handleCreateTeam = () => {
    setShowTeamSelection(false);
    setShowCreateTeam(true);
  };

  const handleJoinTeam = () => {
    setShowTeamSelection(false);
    setShowJoinTeam(true);
  };

  const handleTeamCreated = (teamData) => {
    setShowCreateTeam(false);
    setCurrentPage('dashboard');
    
    // Simulate sending emails to team members
    const emailList = teamData.memberEmails.filter(email => email.trim() !== '');
    if (emailList.length > 0) {
      showNotification('success', `Team created! Invitations sent to ${emailList.length} member(s). Team code: ${teamData.teamCode}`);
    } else {
      showNotification('success', `Team created successfully! Team code: ${teamData.teamCode}`);
    }
    
    // TODO: Here you would typically send the team data to your backend
    console.log('Team created:', teamData);
  };

  const handleTeamJoined = (teamCode) => {
    setShowJoinTeam(false);
    setCurrentPage('dashboard');
    // TODO: Here you would typically join the team via backend API
    console.log('Joined team with code:', teamCode);
  };

  const handleCloseModals = () => {
    setShowTeamSelection(false);
    setShowCreateTeam(false);
    setShowJoinTeam(false);
    setCurrentPage('dashboard');
  };

  // Render the appropriate page
  if (currentPage === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <>
      {currentPage === 'dashboard' && user ? (
        <Dashboard 
          username={user.username}
          userType={user.userType}
          onLogout={handleLogout}
        />
      ) : currentPage === 'register' ? (
        <RegisterPageWithNavigation />
      ) : (
        <LoginPageWithNavigation />
      )}
      
      <NotificationPopup
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <TeamSelectionModal
        isVisible={showTeamSelection}
        onCreateTeam={handleCreateTeam}
        onJoinTeam={handleJoinTeam}
        onClose={handleCloseModals}
      />
      
      <CreateTeamModal
        isVisible={showCreateTeam}
        onClose={handleCloseModals}
        onCreateTeam={handleTeamCreated}
        showNotification={showNotification}
      />
      
      <JoinTeamModal
        isVisible={showJoinTeam}
        onClose={handleCloseModals}
        onJoinTeam={handleTeamJoined}
        showNotification={showNotification}
      />
    </>
  );
}

export default CompleteApp;

