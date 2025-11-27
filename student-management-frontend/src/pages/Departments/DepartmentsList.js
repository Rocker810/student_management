// src/pages/Departments/DepartmentsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentAPI } from '../../services/api';
import '../../styles/Table.css';

function DepartmentsList() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await departmentAPI.get();
            setDepartments(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await departmentAPI.delete(`/${id}`);
                fetchDepartments();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete department');
            }
        }
    };

    if (loading) return <div className="loading">Loading departments...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Departments</h1>
                <Link to="/departments/add" className="btn btn-primary">
                    ➕ Add New Department
                </Link>
            </div>

            {departments.length === 0 ? (
                <p className="no-data">No departments found.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Head</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Building</th>
                            <th>Est. Year</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.departmentId}>
                                <td><strong>{dept.departmentCode}</strong></td>
                                <td>{dept.departmentName}</td>
                                <td>{dept.headOfDepartment || 'N/A'}</td>
                                <td>{dept.email || 'N/A'}</td>
                                <td>{dept.phone || 'N/A'}</td>
                                <td>{dept.building || 'N/A'}</td>
                                <td>{dept.establishedYear || 'N/A'}</td>
                                <td className="actions">
                                    <Link to={`/departments/edit/${dept.departmentId}`} className="btn btn-sm btn-edit">
                                        ✏️ Edit
                                    </Link>
                                    <button onClick={() => handleDelete(dept.departmentId)} className="btn btn-sm btn-delete">
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

export default DepartmentsList;