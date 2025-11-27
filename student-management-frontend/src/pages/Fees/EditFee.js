// src/pages/Fees/EditFee.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { feeAPI } from '../../services/api';
import '../../styles/Form.css';

function EditFee() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        semester: '',
        feeType: '',
        amount: '',
        paidAmount: '',
        dueDate: '',
        paymentDate: '',
        paymentStatus: '',
        paymentMethod: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchFee();
    }, [id]);

    const fetchFee = async () => {
        try {
            setFetchLoading(true);
            const response = await feeAPI.get(`/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch fee');
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
            await feeAPI.put(`/${id}`, formData);
            navigate('/fees');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update fee');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="loading">Loading fee...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Edit Fee</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="semester">Semester *</label>
                        <input
                            type="text"
                            id="semester"
                            name="semester"
                            value={formData.semester || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="feeType">Fee Type *</label>
                        <select
                            id="feeType"
                            name="feeType"
                            value={formData.feeType || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="Tuition">Tuition</option>
                            <option value="Lab">Lab</option>
                            <option value="Library">Library</option>
                            <option value="Sports">Sports</option>
                            <option value="Hostel">Hostel</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="amount">Amount *</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="paidAmount">Paid Amount</label>
                        <input
                            type="number"
                            id="paidAmount"
                            name="paidAmount"
                            value={formData.paidAmount || ''}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date *</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="paymentDate">Payment Date</label>
                        <input
                            type="date"
                            id="paymentDate"
                            name="paymentDate"
                            value={formData.paymentDate || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="paymentStatus">Payment Status</label>
                        <select
                            id="paymentStatus"
                            name="paymentStatus"
                            value={formData.paymentStatus || ''}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="paymentMethod">Payment Method</label>
                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod || ''}
                            onChange={handleChange}
                        >
                            <option value="">Select Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Credit_Card">Credit Card</option>
                            <option value="Debit_Card">Debit Card</option>
                            <option value="Net_Banking">Net Banking</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Updating...' : '✓ Update Fee'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/fees')}
                        className="btn btn-secondary"
                    >
                        ✕ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditFee;