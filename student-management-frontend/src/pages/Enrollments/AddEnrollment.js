// src/pages/Enrollments/AddEnrollment.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentAPI, studentAPI, courseAPI } from '../../services/api';
import '../../styles/Form.css';

function AddEnrollment() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        courseId: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentAPI.get('/');
            setStudents(response.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await courseAPI.get('/');
            setCourses(response.data);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            student: { studentId: parseInt(formData.studentId) },
            course: { courseId: parseInt(formData.courseId) },
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'Enrolled',
        };

        try {
            await enrollmentAPI.post(payload);
            navigate('/enrollments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create enrollment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Add New Enrollment</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="studentId">Student *</label>
                    <select
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student.studentId} value={student.studentId}>
                                {student.firstName} {student.lastName} ({student.studentNumber})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="courseId">Course *</label>
                    <select
                        id="courseId"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseCode} - {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Enrolling...' : '✓ Enroll Student'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/enrollments')}
                        className="btn btn-secondary"
                    >
                        ✕ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddEnrollment;