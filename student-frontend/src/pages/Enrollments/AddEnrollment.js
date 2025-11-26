// src/pages/Enrollments/AddEnrollment.jsx

import React, { useEffect, useState } from 'react';
import { studentAPI, courseAPI, enrollmentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddEnrollment() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    studentId: '',
    courseId: '',
    enrollmentDate: '',
    grade: '',
    gradePoints: '',
    attendancePercentage: '',
    status: 'Enrolled',
  });

  // Load dropdown data
  useEffect(() => {
    studentAPI
      .get('/')
      .then((r) => setStudents(r.data || []))
      .catch(() => setStudents([]));

    courseAPI
      .get('/')
      .then((r) => setCourses(r.data || []))
      .catch(() => setCourses([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        enrollmentDate: form.enrollmentDate,
        grade: form.grade || null,
        gradePoints: form.gradePoints ? Number(form.gradePoints) : null,
        attendancePercentage: form.attendancePercentage
          ? Number(form.attendancePercentage)
          : 0,
        status: form.status,
        student: { studentId: Number(form.studentId) },
        course: { courseId: Number(form.courseId) },
      };

      await enrollmentAPI.post('/', payload);
      navigate('/enrollments');
    } catch (err) {
      console.error('Failed to add enrollment:', err);
      alert('Failed to add enrollment.');
    }
  };

  return (
    <div className="form-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/enrollments')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Add New Enrollment
      </h2>

      <form onSubmit={handleSubmit}>
        {/* STUDENT */}
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

        {/* COURSE */}
        <div className="form-row">
          <div className="form-group">
            <label>Course *</label>
            <select
              name="courseId"
              required
              value={form.courseId}
              onChange={handleChange}
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseName} ({c.courseCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DATE */}
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

        {/* GRADE */}
        <div className="form-row">
          <div className="form-group">
            <label>Grade</label>
            <input
              name="grade"
              value={form.grade}
              onChange={handleChange}
              placeholder="A, B, C, etc."
            />
          </div>
        </div>

        {/* GRADE POINTS */}
        <div className="form-row">
          <div className="form-group">
            <label>Grade Points</label>
            <input
              name="gradePoints"
              type="number"
              step="0.01"
              value={form.gradePoints}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ATTENDANCE */}
        <div className="form-row">
          <div className="form-group">
            <label>Attendance Percentage</label>
            <input
              name="attendancePercentage"
              type="number"
              step="0.01"
              value={form.attendancePercentage}
              onChange={handleChange}
              placeholder="0 - 100"
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="form-row">
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              required
              value={form.status}
              onChange={handleChange}
            >
              <option value="Enrolled">Enrolled</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>

        {/* BUTTONS */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/enrollments')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Add Enrollment
          </button>
        </div>
      </form>
    </div>
  );
}
