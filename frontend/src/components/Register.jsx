import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // ✅ default role
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;

    const result = await register(userData);

    if (result.success) {
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* Employee ID */}
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          {/* 🔥 ROLE DROPDOWN */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="user">Employee</option>
            <option value="hod">HOD</option>
            <option value="admin">Admin</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have account?{' '}
          <Link to="/login" className="text-blue-600">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;