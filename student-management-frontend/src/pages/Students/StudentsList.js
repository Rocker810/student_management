import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, departmentAPI, searchStudents, filterStudents } from '../../services/api';
import '../../styles/Table.css';

function StudentsList() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        departmentId: '',
        minGpa: ''
    });
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
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

    const fetchDepartments = async () => {
        try {
            const response = await departmentAPI.get();
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    // Search handler
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchStudents();
            return;
        }
        try {
            setLoading(true);
            const response = await searchStudents(searchTerm);
            setStudents(response.data);
        } catch (err) {
            setError('Search failed');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter handler
    const handleFilter = async () => {
        const hasFilters = filters.status || filters.departmentId || filters.minGpa;
        if (!hasFilters) {
            fetchStudents();
            setIsFiltering(false);
            return;
        }
        try {
            setLoading(true);
            setIsFiltering(true);
            const response = await filterStudents(filters);
            setStudents(response.data);
        } catch (err) {
            setError('Filter failed');
            console.error('Filter error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ status: '', departmentId: '', minGpa: '' });
        setIsFiltering(false);
        fetchStudents();
    };

    // Search on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
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

            {/* Search Bar */}
            <div className="search-bar" style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Search by name, email, or student number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                    style={{ width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleSearch} className="btn btn-primary">
                    🔍 Search
                </button>
            </div>

            {/* Filters */}
            <div className="filters" style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px' }}
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                </select>

                <select
                    value={filters.departmentId}
                    onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px' }}
                >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.departmentName}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Min GPA"
                    value={filters.minGpa}
                    onChange={(e) => setFilters({ ...filters, minGpa: e.target.value })}
                    min="0"
                    max="4"
                    step="0.1"
                    style={{ padding: '8px', borderRadius: '4px', width: '100px' }}
                />

                <button onClick={handleFilter} className="btn btn-primary">
                    🔽 Apply Filters
                </button>

                {(isFiltering || searchTerm) && (
                    <button onClick={clearFilters} className="btn btn-secondary">
                        ✖ Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            <p style={{ marginBottom: '10px', color: '#666' }}>
                Showing {students.length} student(s)
                {isFiltering && ' (filtered)'}
            </p>

            {students.length === 0 ? (
                <p className="no-data">No students found.</p>
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
                        {students.map((student) => (
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