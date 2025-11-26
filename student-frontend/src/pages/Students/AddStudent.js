// src/pages/Students/AddStudent.jsx
import React, { useEffect, useState } from 'react';
import { departmentAPI, studentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddStudent() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    studentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    departmentId: '',
    enrollmentDate: '',
    studentStatus: 'Active',
    gpa: 0,
  });

  useEffect(() => {
    departmentAPI
      .get('/')
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        gpa: Number(form.gpa || 0),
        department: { departmentId: Number(form.departmentId) },
      };

      await studentAPI.post(payload);
      navigate('/students');
    } catch (err) {
      console.error('Add student failed:', err);
      alert('Failed to add student.');
    }
  };

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/students')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Add New Student
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="form-row">
          <div className="form-group">
            <label>Student Number *</label>
            <input
              name="studentNumber"
              required
              value={form.studentNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Last Name *</label>
            <input
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              required
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone *</label>
            <input
              name="phone"
              required
              type="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">-- Select Gender --</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer_not_to_say</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department *</label>
            <select
              name="departmentId"
              required
              value={form.departmentId}
              onChange={handleChange}
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Enrollment Date *</label>
            <input
              name="enrollmentDate"
              type="date"
              required
              value={form.enrollmentDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status *</label>
            <select
              name="studentStatus"
              required
              value={form.studentStatus}
              onChange={handleChange}
            >
              <option value="">-- Select Status--</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Graduated</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>GPA *</label>
            <input
              name="gpa"
              required
              type="gpa"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/students')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}
