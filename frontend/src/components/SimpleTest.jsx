import React from 'react';

const SimpleTest = () => {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600">✅ React is Working!</h1>
        <p className="mt-4 text-gray-700">If you see this, React is rendering correctly.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;