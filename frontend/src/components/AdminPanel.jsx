// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ntpc from "./img/ntpc.webp";
import { format } from "date-fns";

import { generateRequisitionPDF } from "./PDFGenerator";
import {
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Users,
  Car,
  Calendar,
  MapPin,
  Clock,
  User,
  Download,
  Filter,
  ChevronDown,
  Menu,
  X,
  Home,
  Settings,
  BarChart3,
  Check,
  XIcon,
  Upload,
  MessageSquare,
} from "lucide-react";

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // ROLE CHECK - Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      console.log(
        "❌ Access denied: User is not admin, redirecting to dashboard",
      );
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard", { replace: true });
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
    if (user && user.role === "admin") {
      fetchAllRequisitions();
    }
  }, [user]);

  const fetchAllRequisitions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/requisitions/all",
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

  const handleApprove = async (id) => {
    if (!signatureFile && !selectedReq) {
      toast.error("Please upload signature for approval");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (signatureFile) formData.append("hodSignature", signatureFile);
    if (remarks) formData.append("hodRemarks", remarks);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/requisitions/${id}/approve`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Requisition approved successfully");
      fetchAllRequisitions();
      setSelectedReq(null);
      setRemarks("");
      setSignatureFile(null);
    } catch (error) {
      console.error("Approve error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        toast.error("Failed to approve requisition");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!remarks) {
      toast.error("Please provide remarks for rejection");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/requisitions/${id}/reject`,
        { hodRemarks: remarks },
        getAuthHeader(),
      );
      toast.success("Requisition rejected");
      fetchAllRequisitions();
      setSelectedReq(null);
      setRemarks("");
    } catch (error) {
      console.error("Reject error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        toast.error("Failed to reject requisition");
      }
    } finally {
      setLoading(false);
    }
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

  const filteredRequisitions = requisitions.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  // Loading state
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#007DC5]/5 via-white to-[#007DC5]/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#007DC5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
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
                {/* NTPC Logo - Increased size */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <img
                    src={ntpc}
                    alt="NTPC"
                    className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain"
                  />
                </div>
                {/* NML Logo - Increased size */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <img
                    src="/nml-logo.png"
                    alt="NML"
                    className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg lg:text-xl">
                  NTPC Limited
                </h1>
                <p className="text-blue-100 text-xs lg:text-sm">
                  Admin Panel - HOD Dashboard
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}

            {/* User Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-blue-100 text-xs flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  HOD Admin
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-[#007DC5]" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-white hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                        HOD Admin
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#007DC5] to-[#005a8c] rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-blue-100">
                Manage and review vehicle requisitions from your dashboard.
              </p>
            </div>
            <div className="flex gap-3"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Total Requisitions
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#007DC5]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Pending
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
              </div>
            </div>
            {stats.pending > 0 && (
              <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Requires attention
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Approved
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Rejected
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mt-1">
                  {stats.rejected}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Requisitions
              </h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  filter === "all"
                    ? "bg-[#007DC5] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  filter === "pending"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  filter === "approved"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  filter === "rejected"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>
        </div>

        {/* Requisitions Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              {filter === "all"
                ? "All Requisitions"
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Requisitions`}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Showing {filteredRequisitions.length} requisition
              {filteredRequisitions.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredRequisitions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-base sm:text-lg">
                No requisitions found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                New requisitions will appear here
              </p>
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
                      Employee
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Journey Details
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
                  {filteredRequisitions.map((req) => (
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
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {req.employeeName}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {req.employeeNo}
                          </div>
                          <div className="text-xs text-gray-500">
                            {req.designation}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {req.fromStation} → {req.toStation}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {req.vehicleRequiredDate
                                ? format(
                                    new Date(req.vehicleRequiredDate),
                                    "dd/MM/yyyy HH:mm",
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">PNR:</span>{" "}
                            {req.pnrNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Journey By:</span>{" "}
                            {req.journeyBy}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs">
                          {req.vehicleRequiredFor}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>
                     
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {req.status === "pending" ? (
                            <button
                              onClick={() => setSelectedReq(req)}
                              className="bg-[#007DC5] hover:bg-[#005a8c] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </button>
                          ) : (
                            <div className="space-y-1">
                              {req.hodSignature && (
                                <a
                                  href={`http://localhost:5000${req.hodSignature}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#007DC5] hover:text-[#005a8c] text-sm font-medium flex items-center gap-1.5"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  View Signature
                                </a>
                              )}
                              {req.hodRemarks && (
                                <p className="text-xs text-gray-500 max-w-xs">
                                  <span className="font-medium">Remarks:</span>{" "}
                                  {req.hodRemarks}
                                </p>
                              )}
                            </div>
                          )}
                          {/* PDF Download Button - Show for all requisitions */}
                          <button
                            onClick={() =>
                              generateRequisitionPDF(req, req.hodSignature)
                            }
                            className="text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded-lg"
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

      {/* Approval Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#007DC5] to-[#005a8c] p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Review Requisition
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Review and take action on this requisition
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedReq(null);
                    setRemarks("");
                    setSignatureFile(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Details Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                  <User className="w-5 h-5 text-[#007DC5]" />
                  Employee Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Employee Name</p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.employeeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Employee Number
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.employeeNo}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Designation</p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.designation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Journey Details Card */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                  <Car className="w-5 h-5 text-[#007DC5]" />
                  Journey Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From Station</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedReq.fromStation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To Station</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedReq.toStation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PNR Number</p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.pnrNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Journey By</p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.journeyBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Vehicle Required Date & Time
                    </p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {selectedReq.vehicleRequiredDate
                        ? format(
                            new Date(selectedReq.vehicleRequiredDate),
                            "dd/MM/yyyy HH:mm",
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Vehicle Required At
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.vehicleRequiredAt}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Expected Return Time
                    </p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {selectedReq.expectedReturnTime
                        ? format(
                            new Date(selectedReq.expectedReturnTime),
                            "dd/MM/yyyy HH:mm",
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Purpose</p>
                    <p className="font-medium text-gray-800">
                      {selectedReq.vehicleRequiredFor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#007DC5]" />
                    Remarks{" "}
                    {selectedReq.status === "pending" &&
                      "(Required for rejection)"}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DC5] focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Enter your remarks or comments..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#007DC5]" />
                    Upload Signature{" "}
                    {selectedReq.status === "pending" &&
                      "(Required for approval)"}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#007DC5] transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setSignatureFile(e.target.files[0])}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="cursor-pointer"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {signatureFile
                          ? signatureFile.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, or PDF (Max 5MB)
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() =>
                    handleApprove(selectedReq.id || selectedReq._id)
                  }
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Approve Requisition
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    handleReject(selectedReq.id || selectedReq._id)
                  }
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XIcon className="w-5 h-5" />
                      Reject Requisition
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedReq(null);
                    setRemarks("");
                    setSignatureFile(null);
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium sm:flex-initial"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src={ntpc}
                    alt="NTPC"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src="/nml-logo.png"
                    alt="NML"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">NTPC Limited</h3>
              <p className="text-gray-400 text-sm">
                Admin Dashboard - Vehicle Requisition System
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
                    Manage Requisitions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    User Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reports & Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Admin Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: admin@ntpc.co.in</li>
                <li>Phone: +91 123 456 7890</li>
                <li>IT Support: it-support@ntpc.co.in</li>
                <li>Emergency: +91 987 654 3210</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              © 2024 NTPC Limited. All rights reserved. | Terms of Service |
              Privacy Policy | Admin Panel v2.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
