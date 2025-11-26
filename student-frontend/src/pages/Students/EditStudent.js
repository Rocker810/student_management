// src/pages/Students/EditStudent.jsx
import React, { useEffect, useState } from 'react';
import { studentAPI, departmentAPI } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Load departments
  useEffect(() => {
    departmentAPI
      .getAll()
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]));
  }, []);

  // Load Student by ID
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await studentAPI.getById(id);
        const s = res.data;

        setForm({
          studentNumber: s.studentNumber || '',
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          email: s.email || '',
          phone: s.phone || '',
          dateOfBirth: s.dateOfBirth || '',
          gender: s.gender || '',
          departmentId: s.department?.departmentId || '',
          enrollmentDate: s.enrollmentDate || '',
          studentStatus: s.studentStatus || 'Active',
          gpa: s.gpa || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to load student:', err);
        alert('Could not load student.');
        navigate('/students');
      }
    };

    fetchStudent();
  }, [id, navigate]);

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

      await studentAPI.update(id, payload);
      navigate('/students');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update student.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/students')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Edit Student
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Student Number */}
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

        {/* First Name */}
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

        {/* Last Name */}
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

        {/* Email */}
        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="form-row">
          <div className="form-group">
            <label>Phone *</label>
            <input
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DOB */}
        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Gender */}
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

        {/* Department */}
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

        {/* Enrollment Date */}
        <div className="form-row">
          <div className="form-group">
            <label>Enrollment Date *</label>
            <input
              type="date"
              name="enrollmentDate"
              required
              value={form.enrollmentDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status */}
        <div className="form-row">
          <div className="form-group">
            <label>Status *</label>
            <select
              name="studentStatus"
              required
              value={form.studentStatus}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Graduated</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {/* GPA */}
        <div className="form-row">
          <div className="form-group">
            <label>GPA *</label>
            <input
              name="gpa"
              type="number"
              step="0.01"
              required
              value={form.gpa}
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
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
}
