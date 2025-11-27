// src/pages/Courses/EditCourse.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseAPI, departmentAPI } from '../../services/api';
import '../../styles/Form.css';

function EditCourse() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        courseDescription: '',
        credits: 0,
        departmentId: '',
        instructorName: '',
        maxStudents: 0,
        semester: '',
        isActive: true,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
        fetchCourse();
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const response = await departmentAPI.get('/');
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const fetchCourse = async () => {
        try {
            setFetchLoading(true);
            const response = await courseAPI.get(`/${id}`);
            const course = response.data;
            setFormData({
                courseCode: course.courseCode || '',
                courseName: course.courseName || '',
                courseDescription: course.courseDescription || '',
                credits: course.credits || 0,
                departmentId: course.department?.departmentId || '',
                instructorName: course.instructorName || '',
                maxStudents: course.maxStudents || 0,
                semester: course.semester || '',
                isActive: course.isActive !== undefined ? course.isActive : true,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch course');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            department: { departmentId: parseInt(formData.departmentId) },
        };
        delete payload.departmentId;

        try {
            await courseAPI.put(`/${id}`, payload);
            navigate('/courses');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="loading">Loading course...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Edit Course</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="courseCode">Course Code *</label>
                        <input
                            type="text"
                            id="courseCode"
                            name="courseCode"
                            value={formData.courseCode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="courseName">Course Name *</label>
                        <input
                            type="text"
                            id="courseName"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="courseDescription">Description</label>
                    <textarea
                        id="courseDescription"
                        name="courseDescription"
                        value={formData.courseDescription}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="credits">Credits *</label>
                        <input
                            type="number"
                            id="credits"
                            name="credits"
                            value={formData.credits}
                            onChange={handleChange}
                            min="1"
                            max="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxStudents">Max Students *</label>
                        <input
                            type="number"
                            id="maxStudents"
                            name="maxStudents"
                            value={formData.maxStudents}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departmentId">Department *</label>
                        <select
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="instructorName">Instructor Name</label>
                        <input
                            type="text"
                            id="instructorName"
                            name="instructorName"
                            value={formData.instructorName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="semester">Semester *</label>
                    <input
                        type="text"
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        Active Course
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Updating...' : '✓ Update Course'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/courses')}
                        className="btn btn-secondary"
                    >
                        ✕ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCourse;