// src/pages/Addresses/AddAddress.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressAPI, studentAPI } from '../../services/api';
import '../../styles/Form.css';

function AddAddress() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        addressType: 'Permanent',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'USA',
        isPrimary: false,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentAPI.get('/');
            setStudents(response.data);
        } catch (err) {
            console.error('Error fetching students:', err);
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
            student: { studentId: parseInt(formData.studentId) },
        };
        delete payload.studentId;

        try {
            await addressAPI.post(payload);
            navigate('/addresses');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Add New Address</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-row">
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
                        <label htmlFor="addressType">Address Type *</label>
                        <select
                            id="addressType"
                            name="addressType"
                            value={formData.addressType}
                            onChange={handleChange}
                            required
                        >
                            <option value="Permanent">Permanent</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="streetAddress">Street Address *</label>
                    <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code *</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country *</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="isPrimary"
                            checked={formData.isPrimary}
                            onChange={handleChange}
                        />
                        Set as Primary Address
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : '✓ Add Address'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/addresses')}
                        className="btn btn-secondary"
                    >
                        ✕ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddAddress;