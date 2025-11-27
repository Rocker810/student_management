// src/pages/Students/EditStudent.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentAPI, departmentAPI } from '../../services/api';
import '../../styles/Form.css';

function EditStudent() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        studentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        enrollmentDate: '',
        studentStatus: '',
        gpa: '',
        departmentId: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
        fetchStudent();
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const response = await departmentAPI.get('/');
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const fetchStudent = async () => {
        try {
            setFetchLoading(true);
            const response = await studentAPI.get(`/${id}`);
            const student = response.data;
            setFormData({
                studentNumber: student.studentNumber || '',
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                email: student.email || '',
                phone: student.phone || '',
                dateOfBirth: student.dateOfBirth || '',
                gender: student.gender || '',
                enrollmentDate: student.enrollmentDate || '',
                studentStatus: student.studentStatus || '',
                gpa: student.gpa || '',
                departmentId: student.department?.departmentId || '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch student');
        } finally {
            setFetchLoading(false);
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
            ...formData,
            gpa: formData.gpa ? parseFloat(formData.gpa) : null,
            department: { departmentId: parseInt(formData.departmentId) },
        };
        delete payload.departmentId;

        try {
            await studentAPI.put(`/${id}`, payload);
            navigate('/students');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="loading">Loading student data...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Edit Student</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="studentNumber">Student Number *</label>
                        <input
                            type="text"
                            id="studentNumber"
                            name="studentNumber"
                            value={formData.studentNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth *</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender *</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="enrollmentDate">Enrollment Date *</label>
                        <input
                            type="date"
                            id="enrollmentDate"
                            name="enrollmentDate"
                            value={formData.enrollmentDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="studentStatus">Status *</label>
                        <select
                            id="studentStatus"
                            name="studentStatus"
                            value={formData.studentStatus}
                            onChange={handleChange}
                            required
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Graduated">Graduated</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="gpa">GPA</label>
                        <input
                            type="number"
                            id="gpa"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            max="4.0"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Updating...' : '✓ Update Student'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/students')}
                        className="btn btn-secondary"
                    >
                        ✕ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditStudent;