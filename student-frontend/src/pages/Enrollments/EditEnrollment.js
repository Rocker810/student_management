import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enrollmentAPI, studentAPI, courseAPI } from '../../services/api';
import FormCard from '../../components/FormCard';

export default function EditEnrollment() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Load dropdown values
  useEffect(() => {
    studentAPI.get('/').then((r) => setStudents(r.data || []));
    courseAPI.get('/').then((r) => setCourses(r.data || []));
  }, []);

  // Load enrollment to edit
  useEffect(() => {
    enrollmentAPI
      .get(`/${id}`)
      .then((res) => {
        const e = res.data;
        setForm({
          studentId: e.student?.studentId || '',
          courseId: e.course?.courseId || '',
          enrollmentDate: e.enrollmentDate || '',
          grade: e.grade || '',
          gradePoints: e.gradePoints || '',
          attendancePercentage: e.attendancePercentage || '',
          status: e.status || 'Enrolled',
        });
      })
      .catch((err) => {
        console.error('Failed to load enrollment:', err);
        alert('Failed to load enrollment');
      });
  }, [id]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        enrollmentId: Number(id),
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

      await enrollmentAPI.put(`/${id}`, payload);
      navigate('/enrollments');
    } catch (err) {
      console.error('Failed to update enrollment:', err);
      alert('Failed to update enrollment.');
    }
  };

  return (
    <FormCard title="Edit Enrollment" backUrl="/enrollments">
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 20 }}>
          {/* LEFT COLUMN */}
          <div style={{ flex: 1 }}>
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
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>

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
                    {c.courseName}
                  </option>
                ))}
              </select>
            </div>

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

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Grade</label>
              <input name="grade" value={form.grade} onChange={handleChange} />
            </div>

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

            <div className="form-group">
              <label>Attendance Percentage</label>
              <input
                name="attendancePercentage"
                type="number"
                step="0.01"
                value={form.attendancePercentage}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Enrolled">Enrolled</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>
        </div>

        {/* BUTTON ROW */}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/enrollments')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Save Changes
          </button>
        </div>
      </form>
    </FormCard>
  );
}
