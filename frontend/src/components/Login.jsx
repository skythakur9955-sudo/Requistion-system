// src/components/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import ntpc from "./img/nml-logo.png";
import nml from "./img/ntpc.webp";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  // Redirect based on user role
  useEffect(() => {
    if (user && !hasNavigated.current) {
      hasNavigated.current = true;

     // console.log("🔄 User logged in, role:", user.role);

      // Role-based navigation
      if (user.role === "admin") {
        console.log("✅ Redirecting to ADMIN panel");
        navigate("/admin", { replace: true });
      } else {
      //  console.log("✅ Redirecting to USER dashboard");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      console.log("Attempting login with:", email);

      const result = await login(email, password);

      if (result.success) {
       // console.log("✅ Login successful, role:", result.user.role);
        toast.success("Login successful!");
        // Navigation handled by useEffect
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#007DC5]/5 via-white to-[#007DC5]/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#007DC5] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#007DC5] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header with Logos */}
            <div className="bg-gradient-to-r from-[#007DC5] to-[#005a8c] p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4">
                {/* NTPC Logo Placeholder */}
                {/* Replace the placeholder divs with actual images */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 p-2">
                  <img
                    src={ntpc}
                    alt="NTPC Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 p-2">
                  <img
                    src={nml}
                    alt="NML Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">
                NTPC Limited
              </h1>
              <p className="text-blue-100 text-center mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                Vehicle Requisition System
              </p>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium text-sm sm:text-base">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#007DC5] transition-colors duration-200" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all duration-200 text-sm sm:text-base disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium text-sm sm:text-base">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#007DC5] transition-colors duration-200" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all duration-200 text-sm sm:text-base disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#007DC5] border-gray-300 rounded focus:ring-[#007DC5] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#007DC5] hover:text-[#005a8c] font-medium transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#007DC5] text-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#005a8c] transform hover:scale-[1.02] transition-all duration-200 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#007DC5] hover:text-[#005a8c] font-medium transition-colors duration-200"
                  >
                    Register here
                  </Link>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">
                  © 2024 NTPC Limited. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
