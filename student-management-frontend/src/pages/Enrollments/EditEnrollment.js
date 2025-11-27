// src/pages/Enrollments/EditEnrollment.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enrollmentAPI } from '../../services/api';
import '../../styles/Form.css';

function EditEnrollment() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        grade: '',
        gradePoints: '',
        attendancePercentage: '',
        status: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchEnrollment();
    }, [id]);

    const fetchEnrollment = async () => {
        try {
            setFetchLoading(true);
            const response = await enrollmentAPI.get(`/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch enrollment');
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

        try {
            await enrollmentAPI.put(`/${id}`, formData);
            navigate('/enrollments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update enrollment');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="loading">Loading enrollment...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Edit Enrollment</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="grade">Grade</label>
                        <select
                            id="grade"
                            name="grade"
                            value={formData.grade || ''}
                            onChange={handleChange}
                        >
                            <option value="">Not Graded</option>
                            <option value="A">A (4.0)</option>
                            <option value="A-">A- (3.7)</option>
                            <option value="B+">B+ (3.3)</option>
                            <option value="B">B (3.0)</option>
                            <option value="B-">B- (2.7)</option>
                            <option value="C+">C+ (2.3)</option>
                            <option value="C">C (2.0)</option>
                            <option value="C-">C- (1.7)</option>
                            <option value="D">D (1.0)</option>
                            <option value="F">F (0.0)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gradePoints">Grade Points</label>
                        <input
                            type="number"
                            id="gradePoints"
                            name="gradePoints"
                            value={formData.gradePoints || ''}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="4.0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="attendancePercentage">Attendance Percentage</label>
                        <input
                            type="number"
                            id="attendancePercentage"
                            name="attendancePercentage"
                            value={formData.attendancePercentage || ''}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || ''}
                            onChange={handleChange}
                        >
                            <option value="Enrolled">Enrolled</option>
                            <option value="Completed">Completed</option>
                            <option value="Withdrawn">Withdrawn</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Updating...' : '✓ Update Enrollment'}
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

export default EditEnrollment;