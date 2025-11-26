// src/pages/Addresses/AddAddress.jsx

import React, { useEffect, useState } from 'react';
import { addressAPI, studentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddAddress() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: '',
    addressType: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isPrimary: true,
  });

  // Load students for dropdown
  useEffect(() => {
    studentAPI
      .get('/')
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]));
  }, []);

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        student: { studentId: Number(form.studentId) },
        addressType: form.addressType,
        streetAddress: form.streetAddress,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        isPrimary: form.isPrimary,
      };

      await addressAPI.post(payload);
      navigate('/addresses');
    } catch (err) {
      console.error('Failed to add address:', err);
      alert('Failed to add address.');
    }
  };

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/addresses')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Add New Address
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Student */}
        <div className="form-row">
          <div className="form-group">
            <label>Student *</label>
            <select
              name="studentId"
              required
              value={form.studentId}
              onChange={handleChange}
            >
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.firstName} {s.lastName} — #{s.studentNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address Type */}
        <div className="form-row">
          <div className="form-group">
            <label>Address Type *</label>
            <select
              name="addressType"
              required
              value={form.addressType}
              onChange={handleChange}
            >
              <option value="">-- Select Type --</option>
              <option value="HOME">HOME</option>
              <option value="WORK">WORK</option>
              <option value="MAILING">MAILING</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        {/* Street Address */}
        <div className="form-row">
          <div className="form-group">
            <label>Street Address</label>
            <input
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* City */}
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>
        </div>

        {/* State */}
        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} />
          </div>
        </div>

        {/* Postal Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Postal Code</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Country */}
        <div className="form-row">
          <div className="form-group">
            <label>Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Primary Checkbox */}
        <div className="form-row">
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="isPrimary"
              checked={form.isPrimary}
              onChange={handleChange}
            />
            <label>Primary Address</label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/addresses')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
}
