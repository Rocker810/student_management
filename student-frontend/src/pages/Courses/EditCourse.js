import React, { useEffect, useState } from 'react';
import { courseAPI, departmentAPI } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard from '../../components/FormCard';

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Load departments + course
  useEffect(() => {
    departmentAPI.get('/').then((r) => setDepartments(r.data || []));

    courseAPI.get(`/${id}`).then((r) => {
      const c = r.data;
      setForm({
        courseCode: c.courseCode || '',
        courseName: c.courseName || '',
        courseDescription: c.courseDescription || '',
        credits: c.credits || '',
        departmentId: c.department?.departmentId || '',
        instructorName: c.instructorName || '',
        maxStudents: c.maxStudents || 50,
        semester: c.semester || '',
        isActive: c.isActive ?? true,
      });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        courseCode: form.courseCode,
        courseName: form.courseName,
        courseDescription: form.courseDescription,
        credits: Number(form.credits),
        department: { departmentId: Number(form.departmentId) },
        instructorName: form.instructorName,
        maxStudents: Number(form.maxStudents),
        semester: form.semester,
        isActive: form.isActive,
      };

      await courseAPI.put(`/${id}`, payload);
      navigate('/courses');
    } catch (err) {
      console.error('Failed to update course:', err);
      alert('Update failed.');
    }
  };

  return (
    <FormCard title="Edit Course" backUrl="/courses">
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 20 }}>
          {/* LEFT */}
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Course Code *</label>
              <input
                name="courseCode"
                required
                value={form.courseCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Course Name *</label>
              <input
                name="courseName"
                required
                value={form.courseName}
                onChange={handleChange}
              />
            </div>

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

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Instructor Name</label>
              <input
                name="instructorName"
                value={form.instructorName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Max Students</label>
              <input
                name="maxStudents"
                type="number"
                value={form.maxStudents}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Semester</label>
              <input
                name="semester"
                value={form.semester}
                onChange={handleChange}
              />
            </div>

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
        </div>

        {/* ACTION BUTTONS */}
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
            onClick={() => navigate('/courses')}
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
