// src/pages/Enrollments/EnrollmentsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../../services/api';
import '../../styles/Table.css';

function EnrollmentsList() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const response = await enrollmentAPI.get();
            setEnrollments(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch enrollments');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enrollment?')) {
            try {
                await enrollmentAPI.delete(`/${id}`);
                fetchEnrollments();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete enrollment');
            }
        }
    };

    if (loading) return <div className="loading">Loading enrollments...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Enrollments</h1>
                <Link to="/enrollments/add" className="btn btn-primary">
                    ➕ Add New Enrollment
                </Link>
            </div>

            {enrollments.length === 0 ? (
                <p className="no-data">No enrollments found.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Enrollment Date</th>
                            <th>Grade</th>
                            <th>Grade Points</th>
                            <th>Attendance</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment.enrollmentId}>
                                <td>
                                    {enrollment.student?.firstName} {enrollment.student?.lastName}
                                </td>
                                <td>
                                    {enrollment.course?.courseCode} - {enrollment.course?.courseName}
                                </td>
                                <td>{enrollment.enrollmentDate}</td>
                                <td>{enrollment.grade || 'N/A'}</td>
                                <td>{enrollment.gradePoints?.toFixed(2) || 'N/A'}</td>
                                <td>{enrollment.attendancePercentage ? `${enrollment.attendancePercentage}%` : 'N/A'}</td>
                                <td>
                    <span className={`badge ${enrollment.status?.toLowerCase()}`}>
                      {enrollment.status}
                    </span>
                                </td>
                                <td className="actions">
                                    <Link to={`/enrollments/edit/${enrollment.enrollmentId}`} className="btn btn-sm btn-edit">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(enrollment.enrollmentId)}
                                        className="btn btn-sm btn-delete"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EnrollmentsList;