import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onFinish();
    }, 1500); // Display for 1.5 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-8 animate-pulse">
        Project Tracking App
      </h1>
      {loading && (
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
};

export default SplashScreen;


