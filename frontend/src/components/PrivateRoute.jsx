// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('PrivateRoute - user:', user?.role, 'loading:', loading);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Admin route check based on path
  if (location.pathname === '/admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // User route check
  if (location.pathname === '/' && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default PrivateRoute;