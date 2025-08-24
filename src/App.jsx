import React, { useState, useEffect, useMemo } from 'react';
import Dashboard from './Dashboard';
import SplashScreen from './SplashScreen';
import NotificationPopup from './NotificationPopup';
import TeamSelectionModal from './TeamSelectionModal';
import CreateTeamModal from './CreateTeamModal';
import JoinTeamModal from './JoinTeamModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import './index.css';

function CompleteApp() {
  const [currentPage, setCurrentPage] = useState('splash'); // 'splash', 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null); // Store user data
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [showCreateTeamLoading, setShowCreateTeamLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  // Check local storage for user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('dashboard'); // Go directly to dashboard if user is logged in
    }
  }, []);

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

  // Memoize the LoginPageWithNavigation component to prevent unnecessary re-renders
  const LoginPageWithNavigation = useMemo(() => {
    return function LoginPage() {
      const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
      });
      const [showPassword, setShowPassword] = useState(false);
      const [emailError, setEmailError] = useState('');

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));

        if (name === 'emailOrUsername') {
          setEmailError('');
        }
      };

      const validateEmailOrUsername = (input) => {
        if (input.includes('@')) {
          return input.endsWith('@gmail.com');
        }
        return true;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmailOrUsername(formData.emailOrUsername)) {
          setEmailError('Email must end with @gmail.com');
          return;
        }

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
            const userData = {
              username: data.data.username,
              userType: data.data.userType,
              email: data.data.email,
              inProject: data.data.inProject || false, // Use inProject from backend
              projectId: data.data.projectId || null
            };
            
            // If user is in a project, fetch team code
            if (userData.inProject && userData.projectId) {
              try {
                const projectResponse = await fetch(`http://localhost:5000/projects/${userData.projectId}`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${data.data.token}`
                  }
                } );
                
                if (projectResponse.ok) {
                  const projectData = await projectResponse.json();
                  userData.teamCode = projectData.data?.teamCode || null;
                }
              } catch (error) {
                console.error('Error fetching team code:', error);
              }
            }
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Save user data to local storage
            showNotification('success', data.message || 'Login successful!');
            
            // Check inProject status for Students
            if (userData.userType === 'Student' && !userData.inProject) {
              setShowTeamSelection(true);
            } else {
              setCurrentPage('dashboard');
            }
          } else {
            showNotification('error', data.message || 'Login failed!');
            // Keep form data intact on error - formData state is preserved automatically
          }
        } catch (error) {
          console.error('Login error:', error);
          showNotification('error', 'Network error or server is unreachable.');
          // Keep form data intact on error - formData state is preserved automatically
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
              <div className="min-h-[80px]">
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
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-4 pr-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-none outline-none shadow-none hover:shadow-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
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
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out underline-offset-4 hover:underline bg-transparent border-none outline-none shadow-none hover:shadow-none"
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
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out underline-offset-4 hover:underline bg-transparent border-none outline-none shadow-none hover:shadow-none"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    };
  }, []); // Empty dependency array means this will only be created once

  const RegisterPageWithNavigation = useMemo(() => {
    return function RegisterPage() {
      const [formData, setFormData] = useState({
        email: '',
        username: '',
        userType: '', // No default selection
        password: ''
      });
      const [showPassword, setShowPassword] = useState(false);
      const [emailError, setEmailError] = useState('');

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));

        if (name === 'email') {
          setEmailError('');
        }
      };

      const validateEmail = (email) => {
        return email.endsWith('@gmail.com');
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(formData.email)) {
          setEmailError('Email must end with @gmail.com');
          return;
        }

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
            showNotification('error', data.error || data.message || 'Registration failed!');
            // Keep form data intact on error
          }
        } catch (error) {
          console.error('Registration error:', error);
          showNotification('error', 'Network error or server is unreachable.');
          // Keep form data intact on error
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
              <div className="min-h-[80px]">
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
                {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
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
              
              {/* Password Input */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-4 pr-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base bg-gray-50 transition-all duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-none outline-none shadow-none hover:shadow-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
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

            <div className="text-center">
              <p className="text-gray-600 text-base">
                Already have an account?{' '}
                <button
                  onClick={handleLoginClick}
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out underline-offset-4 hover:underline bg-transparent border-none outline-none shadow-none hover:shadow-none"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    };
  }, []); // Empty dependency array means this will only be created once

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    setShowCreateTeamLoading(true);
    
    // Update user data with team information
    const updatedUser = {
      ...user,
      inProject: true,
      projectId: teamData.projectId,
      teamCode: teamData.teamCode
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Show loading for 3 seconds then go to dashboard
    setTimeout(() => {
      setShowCreateTeamLoading(false);
      setCurrentPage('dashboard');
    }, 3000);
  };

  const handleTeamJoined = (teamCode) => {
    setShowJoinTeam(false);
    
    // Update user data with team information
    const updatedUser = {
      ...user,
      inProject: true,
      teamCode: teamCode
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
    showNotification('success', `Successfully joined team with code: ${teamCode}`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'login':
        return <LoginPageWithNavigation />;
      case 'register':
        return <RegisterPageWithNavigation />;
      case 'dashboard':
        return <Dashboard 
          username={user?.username} 
          userType={user?.userType} 
          onLogout={handleLogout} 
          teamCode={user?.teamCode} 
        />;
      default:
        return <LoginPageWithNavigation />;
    }
  };

  return (
    <div className="App">
      {renderPage()}

      {showTeamSelection && (
        <TeamSelectionModal
          isVisible={showTeamSelection}
          onClose={() => setShowTeamSelection(false)}
          onCreateTeam={handleCreateTeam}
          onJoinTeam={handleJoinTeam}
        />
      )}

      {showCreateTeam && (
        <CreateTeamModal
          isVisible={showCreateTeam}
          onClose={() => setShowCreateTeam(false)}
          onTeamCreated={handleTeamCreated}
          showNotification={showNotification}
        />
      )}

      {showJoinTeam && (
        <JoinTeamModal
          isVisible={showJoinTeam}
          onClose={() => setShowJoinTeam(false)}
          onJoinTeam={handleTeamJoined}
          showNotification={showNotification}
        />
      )}

      {/* Team Creation Success Loading Modal */}
      {showCreateTeamLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Team Created Successfully!</h3>
              <p className="text-gray-600">Setting up your dashboard...</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Team created and invitations sent!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
      />

      <ForgotPasswordModal
        isVisible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        showNotification={showNotification}
      />
    </div>
  );
}

export default CompleteApp;