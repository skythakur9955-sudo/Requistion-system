import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const api = {
  // Auth
  login: (identifier, password) => 
    axios.post(`${API_URL}/auth/login`, { identifier, password }),
  
  register: (userData) => 
    axios.post(`${API_URL}/auth/register`, userData),
  
  // Requisitions - User
  createRequisition: (data) => 
    axios.post(`${API_URL}/requisitions`, data, getAuthHeader()),
  
  getMyRequisitions: () => 
    axios.get(`${API_URL}/requisitions/my-requisitions`, getAuthHeader()),
  
  updateRequisition: (id, data) => 
    axios.put(`${API_URL}/requisitions/${id}`, data, getAuthHeader()),
  
  deleteRequisition: (id) => 
    axios.delete(`${API_URL}/requisitions/${id}`, getAuthHeader()),
  
  // Requisitions - HOD
  getDepartmentRequisitions: () => 
    axios.get(`${API_URL}/requisitions/department`, getAuthHeader()),
  
  approveRequisition: (id, formData) => 
    axios.put(`${API_URL}/requisitions/${id}/approve`, formData, {
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  rejectRequisition: (id, data) => 
    axios.put(`${API_URL}/requisitions/${id}/reject`, data, getAuthHeader()),
  
  // Requisitions - Admin
  getAllRequisitions: () => 
    axios.get(`${API_URL}/requisitions/all`, getAuthHeader()),
  
  // Admin - User Management
  getAllUsers: () => 
    axios.get(`${API_URL}/admin/users`, getAuthHeader()),
  
  getAllDepartments: () => 
    axios.get(`${API_URL}/admin/departments`, getAuthHeader()),
  
  updateUserRole: (id, role) => 
    axios.put(`${API_URL}/admin/users/${id}/role`, { role }, getAuthHeader()),
  
  deleteUser: (id) => 
    axios.delete(`${API_URL}/admin/users/${id}`, getAuthHeader()),
  
  // Common
  printRequisition: (id) => 
    axios.get(`${API_URL}/requisitions/${id}/print`, getAuthHeader())
};