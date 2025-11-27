// src/pages/Departments/EditDepartment.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { departmentAPI } from '../../services/api';
import '../../styles/Form.css';

function EditDepartment() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        departmentCode: '',
        departmentName: '',
        headOfDepartment: '',
        email: '',
        phone: '',
        building: '',
        establishedYear: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchDepartment();
    }, [id]);

    const fetchDepartment = async () => {
        try {
            setFetchLoading(true);
            const response = await departmentAPI.get(`/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch department');
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
            await departmentAPI.put(`/${id}`, formData);
            navigate('/departments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update department');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="loading">Loading department...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Edit Department</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departmentCode">Department Code *</label>
                        <input
                            type="text"
                            id="departmentCode"
                            name="departmentCode"
                            value={formData.departmentCode || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="departmentName">Department Name *</label>
                        <input
                            type="text"
                            id="departmentName"
                            name="departmentName"
                            value={formData.departmentName || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="headOfDepartment">Head of Department</label>
                        <input
                            type="text"
                            id="headOfDepartment"
                            name="headOfDepartment"
                            value={formData.headOfDepartment || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="building">Building</label>
                        <input
                            type="text"
                            id="building"
                            name="building"
                            value={formData.building || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="establishedYear">Established Year</label>
                        <input
                            type="number"
                            id="establishedYear"
                            name="establishedYear"
                            value={formData.establishedYear || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Updating...' : '✓ Update Department'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/departments')}
                        className="btn btn-secondary"
                    >
                        ✕ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditDepartment;