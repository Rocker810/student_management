// src/pages/Courses/AddCourse.jsx

import React, { useEffect, useState } from 'react';
import { courseAPI, departmentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddCourse() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    courseCode: '',
    courseName: '',
    courseDescription: '',
    credits: '',
    departmentId: '',
    instructorName: '',
    maxStudents: 50,
    semester: '',
    isActive: true,
  });

  // Load departments
  useEffect(() => {
    departmentAPI
      .get('/')
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]));
  }, []);

  // Handle input changes
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
        courseCode: form.courseCode,
        courseName: form.courseName,
        courseDescription: form.courseDescription,
        credits: Number(form.credits),
        instructorName: form.instructorName,
        maxStudents: Number(form.maxStudents),
        semester: form.semester,
        isActive: form.isActive,
        department: {
          departmentId: Number(form.departmentId),
        },
      };

      await courseAPI.post(payload);
      navigate('/courses');
    } catch (err) {
      console.error('Failed to add course:', err);
      alert('Failed to add course.');
    }
  };

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/courses')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Add New Course
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Course Code */}
        <div className="form-row">
          <div className="form-group">
            <label>Course Code *</label>
            <input
              name="courseCode"
              required
              value={form.courseCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Course Name */}
        <div className="form-row">
          <div className="form-group">
            <label>Course Name *</label>
            <input
              name="courseName"
              required
              value={form.courseName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Course Description */}
        <div className="form-row">
          <div className="form-group">
            <label>Course Description</label>
            <textarea
              name="courseDescription"
              rows="3"
              value={form.courseDescription}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Credits */}
        <div className="form-row">
          <div className="form-group">
            <label>Credits *</label>
            <input
              name="credits"
              type="number"
              required
              value={form.credits}
              onChange={handleChange}
            />
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

        {/* Instructor Name */}
        <div className="form-row">
          <div className="form-group">
            <label>Instructor Name</label>
            <input
              name="instructorName"
              value={form.instructorName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Max Students */}
        <div className="form-row">
          <div className="form-group">
            <label>Max Students</label>
            <input
              name="maxStudents"
              type="number"
              value={form.maxStudents}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Semester */}
        <div className="form-row">
          <div className="form-group">
            <label>Semester</label>
            <input
              name="semester"
              value={form.semester}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Active Course */}
        <div className="form-row">
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <label>Active Course</label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/courses')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary-custom">
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
}
