// src/pages/Addresses/EditAddress.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addressAPI } from '../../services/api';
import '../../styles/Form.css';

function EditAddress() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        addressType: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isPrimary: false,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchAddress();
    }, [id]);

    const fetchAddress = async () => {
        try {
            setFetchLoading(true);
            const response = await addressAPI.get(`/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch address');
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

        try {
            await addressAPI.put(`/${id}`, formData);
            navigate('/addresses');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update address');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="loading">Loading address...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Edit Address</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="addressType">Address Type *</label>
                    <select
                        id="addressType"
                        name="addressType"
                        value={formData.addressType || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="Permanent">Permanent</option>
                        <option value="Current">Current</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="streetAddress">Street Address *</label>
                    <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress || ''}
                        onChange={handleChange}
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
                            value={formData.city || ''}
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
                            value={formData.state || ''}
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
                            value={formData.postalCode || ''}
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
                            value={formData.country || ''}
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
                            checked={formData.isPrimary || false}
                            onChange={handleChange}
                        />
                        Set as Primary Address
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Updating...' : '✓ Update Address'}
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

export default EditAddress;