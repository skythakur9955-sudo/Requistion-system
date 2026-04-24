// src/components/UserPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import { generateRequisitionPDF } from "./PDFGenerator";
import ntpc from "./img/ntpc.webp";
import { format } from "date-fns";
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  Menu,
  X,
  Home,
  Car,
  Settings,
} from "lucide-react";

const UserPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [formData, setFormData] = useState({
    employeeName: user?.name || "",
    employeeNo: user?.employeeId || "",
    designation: user?.designation || "",
    vehicleRequiredFor: "",
    fromStation: "",
    toStation: "",
    pnrNumber: "",
    journeyBy: "",
    vehicleRequiredDate: "",
    vehicleRequiredAt: "",
    expectedReturnTime: "",
  });

  // ROLE CHECK - Redirect if admin
  useEffect(() => {
    if (user && user.role === "admin") {
      console.log("⚠️ Admin user detected, redirecting to admin panel");
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  // Get token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    if (user && user.role === "user") {
      fetchMyRequisitions();
    }
  }, [user]);

  const fetchMyRequisitions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/requisitions/my-requisitions",
        getAuthHeader(),
      );
      const reqs = response.data.data || [];
      setRequisitions(reqs);

      // Calculate stats
      setStats({
        total: reqs.length,
        pending: reqs.filter((r) => r.status === "pending").length,
        approved: reqs.filter((r) => r.status === "approved").length,
        rejected: reqs.filter((r) => r.status === "rejected").length,
      });
    } catch (error) {
      console.error("Error fetching requisitions:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        toast.error("Failed to fetch requisitions");
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/requisitions/${editingId}`,
          formData,
          getAuthHeader(),
        );
        toast.success("Requisition updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/requisitions",
          formData,
          getAuthHeader(),
        );
        toast.success("Requisition submitted successfully");
      }

      resetForm();
      fetchMyRequisitions();
    } catch (error) {
      console.error("Submit error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        const message =
          error.response?.data?.message || "Failed to submit requisition";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (requisition) => {
    setFormData({
      employeeName: requisition.employeeName,
      employeeNo: requisition.employeeNo,
      designation: requisition.designation,
      vehicleRequiredFor: requisition.vehicleRequiredFor,
      fromStation: requisition.fromStation,
      toStation: requisition.toStation,
      pnrNumber: requisition.pnrNumber,
      journeyBy: requisition.journeyBy,
      vehicleRequiredDate:
        requisition.vehicleRequiredDate?.split("T")[0] +
          "T" +
          requisition.vehicleRequiredDate?.split("T")[1]?.slice(0, 5) || "",
      vehicleRequiredAt: requisition.vehicleRequiredAt,
      expectedReturnTime:
        requisition.expectedReturnTime?.split("T")[0] +
          "T" +
          requisition.expectedReturnTime?.split("T")[1]?.slice(0, 5) || "",
    });
    setEditingId(requisition.id || requisition._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this requisition?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/requisitions/${id}`,
          getAuthHeader(),
        );
        toast.success("Requisition deleted successfully");
        fetchMyRequisitions();
      } catch (error) {
        console.error("Delete error:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          logout();
        } else {
          toast.error("Failed to delete requisition");
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeName: user?.name || "",
      employeeNo: user?.employeeId || "",
      designation: user?.designation || "",
      vehicleRequiredFor: "",
      fromStation: "",
      toStation: "",
      pnrNumber: "",
      journeyBy: "",
      vehicleRequiredDate: "",
      vehicleRequiredAt: "",
      expectedReturnTime: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
        text: "Pending",
      },
      approved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Approved",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        text: "Rejected",
      },
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertCircle,
      text: status,
    };
    const Icon = config.icon;
    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.color} border inline-flex items-center gap-1.5`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  // Loading state
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#007DC5]/5 via-white to-[#007DC5]/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#007DC5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#007DC5]/5 via-white to-[#007DC5]/10">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#007DC5] to-[#005a8c] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2">
                {/* NTPC Logo */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <img
                    src={ntpc}
                    alt="NTPC"
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                  />
                </div>
                {/* NML Logo */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <img
                    src="/nml-logo.png"
                    alt="NML"
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg lg:text-xl">
                  NTPC Limited
                </h1>
                <p className="text-blue-100 text-xs lg:text-sm">
                  Vehicle Requisition System
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-blue-100 text-xs">{user?.designation}</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#007DC5]" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-white hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {user?.designation}
                      </p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 md:hidden">
                      <Home className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 md:hidden">
                      <Car className="w-4 h-4" />
                      My Requisitions
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 md:hidden">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Total Requisitions
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#007DC5]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Pending
                </p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Approved
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Rejected
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                  {stats.rejected}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                My Vehicle Requisitions
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Manage and track your vehicle requisition requests
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-[#007DC5] text-white px-5 py-2.5 sm:py-3 rounded-xl hover:bg-[#005a8c] transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
            >
              <Plus className="w-5 h-5" />
              New Requisition
            </button>
          </div>
        </div>

        {/* Requisition Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-[#007DC5] to-[#005a8c] p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {editingId ? "Edit Requisition" : "New Vehicle Requisition"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Employee No.
                    </label>
                    <input
                      type="text"
                      name="employeeNo"
                      value={formData.employeeNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Vehicle Required For
                    </label>
                    <input
                      type="text"
                      name="vehicleRequiredFor"
                      value={formData.vehicleRequiredFor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      placeholder="e.g., To See Panchayat Arrangement"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      From Station
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="fromStation"
                        value={formData.fromStation}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                        placeholder="e.g., CBMP Office"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      To Station
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="toStation"
                        value={formData.toStation}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                        placeholder="e.g., Ranchi"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      PNR Number
                    </label>
                    <input
                      type="text"
                      name="pnrNumber"
                      value={formData.pnrNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      placeholder="Enter PNR number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Journey By
                    </label>
                    <input
                      type="text"
                      name="journeyBy"
                      value={formData.journeyBy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      placeholder="Name of traveler"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Vehicle Required Date & Time
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="datetime-local"
                        name="vehicleRequiredDate"
                        value={formData.vehicleRequiredDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Vehicle Required At
                    </label>
                    <input
                      type="text"
                      name="vehicleRequiredAt"
                      value={formData.vehicleRequiredAt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                      placeholder="e.g., CBMP Gates Hostel"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">
                      Expected Return Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="datetime-local"
                        name="expectedReturnTime"
                        value={formData.expectedReturnTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#007DC5] text-white px-6 py-3 rounded-xl hover:bg-[#005a8c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : editingId ? (
                      "Update Requisition"
                    ) : (
                      "Submit Requisition"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requisitions List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              Recent Requisitions
            </h3>
          </div>

          {requisitions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-base sm:text-lg mb-4">
                No requisitions found
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#007DC5] text-white px-6 py-2.5 rounded-xl hover:bg-[#005a8c] transition-all duration-200 font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create your first requisition
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requisitions.map((req) => (
                    <tr
                      key={req.id || req._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {format(new Date(req.createdAt), "dd/MM/yyyy")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900">
                            {req.fromStation} → {req.toStation}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {req.vehicleRequiredFor}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(req.status)}
                          {req.hodRemarks && req.status === "rejected" && (
                            <p className="text-xs text-red-600 mt-1 max-w-xs truncate">
                              {req.hodRemarks}
                            </p>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {req.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleEdit(req)}
                                className="text-[#007DC5] hover:text-[#005a8c] transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(req.id || req._id)}
                                className="text-red-600 hover:text-red-800 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : null}
                          {/* PDF Download Button - Show for all status */}
                          <button
                            onClick={() =>
                              generateRequisitionPDF(req, req.hodSignature)
                            }
                            className="text-green-600 hover:text-green-800 transition-colors p-1.5 hover:bg-green-50 rounded-lg"
                            title="Download PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src={ntpc}
                    alt="NTPC"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src="/nml-logo.png"
                    alt="NML"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">NTPC Limited</h3>
              <p className="text-gray-400 text-sm">
                Vehicle Requisition Management System
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    My Requisitions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    New Request
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help & Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@ntpc.co.in</li>
                <li>Phone: +91 123 456 7890</li>
                <li>Address: NTPC Bhawan, SCOPE Complex</li>
                <li>New Delhi - 110003</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              © 2024 NTPC Limited. All rights reserved. | Terms of Service |
              Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPanel;
