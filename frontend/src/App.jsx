<<<<<<< HEAD
// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import UserPanel from "./components/UserPanel";
import AdminPanel from "./components/AdminPanel";
// Add import
import ForgotPassword from "./components/ForgotPassword";
=======
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import HODPanel from './components/HODPanel'; // ADD THIS
>>>>>>> 2c94bd40cf1e0b428ea293dbb3e069df324e499f

// Protected Route Component
const PrivateRoute = ({ children, allowedRoles = ['user', 'hod', 'admin'] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
<<<<<<< HEAD

=======
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate panel based on role
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'hod') return <Navigate to="/hod" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
>>>>>>> 2c94bd40cf1e0b428ea293dbb3e069df324e499f
  return children;
};

// Role-Based Root Route
const RoleBasedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
<<<<<<< HEAD

  return user.role === "admin" ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
=======
  
  // Redirect based on role
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'hod') return <Navigate to="/hod" replace />;
  return <Navigate to="/dashboard" replace />;
>>>>>>> 2c94bd40cf1e0b428ea293dbb3e069df324e499f
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleBasedRoute />} />
<<<<<<< HEAD
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
=======
          
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['user']}>
              <UserPanel />
            </PrivateRoute>
          } />
          
          <Route path="/hod" element={
            <PrivateRoute allowedRoles={['hod']}>
              <HODPanel />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          } />
          
>>>>>>> 2c94bd40cf1e0b428ea293dbb3e069df324e499f
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
