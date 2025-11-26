// src/pages/Departments/AddDepartment.jsx

import React, { useState } from 'react';
import { departmentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddDepartment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    departmentCode: '',
    departmentName: '',
    headOfDepartment: '',
    email: '',
    phone: '',
    building: '',
    establishedYear: '',
  });

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
        establishedYear: form.establishedYear
          ? Number(form.establishedYear)
          : null,
      };

      await departmentAPI.post(payload);
      navigate('/departments');
    } catch (err) {
      console.error('Failed to add department:', err);
      alert('Failed to add department.');
    }
  };

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/departments')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Add New Department
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Department Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Department Code *</label>
            <input
              name="departmentCode"
              required
              value={form.departmentCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Department Name */}
        <div className="form-row">
          <div className="form-group">
            <label>Department Name *</label>
            <input
              name="departmentName"
              required
              value={form.departmentName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Head of Department */}
        <div className="form-row">
          <div className="form-group">
            <label>Head of Department</label>
            <input
              name="headOfDepartment"
              value={form.headOfDepartment}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        {/* Building */}
        <div className="form-row">
          <div className="form-group">
            <label>Building</label>
            <input
              name="building"
              value={form.building}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Established Year */}
        <div className="form-row">
          <div className="form-group">
            <label>Established Year</label>
            <input
              name="establishedYear"
              type="number"
              value={form.establishedYear}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/departments')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Add Department
          </button>
        </div>
      </form>
    </div>
  );
}
