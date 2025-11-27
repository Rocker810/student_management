// src/pages/Students/StudentsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import '../../styles/Table.css';

function StudentsList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.get();
            setStudents(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentAPI.delete(`/${id}`);
                fetchStudents();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete student');
            }
        }
    };

    const filteredStudents = students.filter(student =>
        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading students...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Students</h1>
                <Link to="/students/add" className="btn btn-primary">
                    ➕ Add New Student
                </Link>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email, or student number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {filteredStudents.length === 0 ? (
                <p className="no-data">No students found. Add your first student!</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Student #</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>GPA</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.studentId}>
                                <td>{student.studentNumber}</td>
                                <td>{`${student.firstName} ${student.lastName}`}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{student.department?.departmentName || 'N/A'}</td>
                                <td>
                    <span className={`badge ${student.studentStatus?.toLowerCase()}`}>
                      {student.studentStatus}
                    </span>
                                </td>
                                <td>{student.gpa?.toFixed(2) || 'N/A'}</td>
                                <td className="actions">
                                    <Link to={`/students/edit/${student.studentId}`} className="btn btn-sm btn-edit">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(student.studentId)}
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

export default StudentsList;