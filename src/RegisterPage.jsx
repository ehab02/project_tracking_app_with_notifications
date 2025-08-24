import React, { useState } from 'react';

const CorrectedRegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    userType: 'Student', // Default to Student
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', formData);
    alert(`Account created successfully as ${formData.userType}!`);
  };

  const handleLoginClick = () => {
    // Handle navigation to login page
    console.log('Navigate to login page');
    alert('Redirecting to login page');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8">
        {/* Main Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            Register
          </h1>
        </div>
        
        {/* Registration Form */}
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

export default CorrectedRegisterPage;

