// src/pages/Departments/AddDepartment.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentAPI } from '../../services/api';
import '../../styles/Form.css';

function AddDepartment() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        departmentCode: '',
        departmentName: '',
        headOfDepartment: '',
        email: '',
        phone: '',
        building: '',
        establishedYear: new Date().getFullYear(),
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            await departmentAPI.post(formData);
            navigate('/departments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create department');
            console.error('Error creating department:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Add New Department</h1>
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
                            value={formData.departmentCode}
                            onChange={handleChange}
                            maxLength="5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="departmentName">Department Name *</label>
                        <input
                            type="text"
                            id="departmentName"
                            name="departmentName"
                            value={formData.departmentName}
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
                            value={formData.headOfDepartment}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="building">Building</label>
                        <input
                            type="text"
                            id="building"
                            name="building"
                            value={formData.building}
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
                            value={formData.establishedYear}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : '✓ Add Department'}
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

export default AddDepartment;