// src/pages/Fees/FeesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feeAPI } from '../../services/api';
import '../../styles/Table.css';

function FeesList() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            setLoading(true);
            const response = await feeAPI.get();
            setFees(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch fees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this fee record?')) {
            try {
                await feeAPI.delete(`/${id}`);
                fetchFees();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete fee');
            }
        }
    };

    if (loading) return <div className="loading">Loading fees...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Fees</h1>
                <Link to="/fees/add" className="btn btn-primary">
                    ➕ Add New Fee
                </Link>
            </div>

            {fees.length === 0 ? (
                <p className="no-data">No fees found.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Semester</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fees.map((fee) => (
                            <tr key={fee.feeId}>
                                <td>
                                    {fee.student?.firstName} {fee.student?.lastName}
                                </td>
                                <td>{fee.semester}</td>
                                <td>{fee.feeType}</td>
                                <td>${fee.amount?.toFixed(2)}</td>
                                <td>${fee.paidAmount?.toFixed(2) || '0.00'}</td>
                                <td>${(fee.amount - (fee.paidAmount || 0)).toFixed(2)}</td>
                                <td>
                    <span className={`badge ${fee.paymentStatus?.toLowerCase()}`}>
                      {fee.paymentStatus}
                    </span>
                                </td>
                                <td>{fee.dueDate}</td>
                                <td className="actions">
                                    <Link to={`/fees/edit/${fee.feeId}`} className="btn btn-sm btn-edit">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(fee.feeId)}
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

export default FeesList;