// src/pages/Fees/AddFee.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI, studentAPI } from '../../services/api';
import '../../styles/Form.css';

function AddFee() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        semester: '',
        feeType: 'Tuition',
        amount: '',
        dueDate: '',
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            amount: parseFloat(formData.amount),
            student: { studentId: parseInt(formData.studentId) },
        };
        delete payload.studentId;

        try {
            await feeAPI.post(payload);
            navigate('/fees');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create fee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Add New Fee</h1>
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
                        <label htmlFor="semester">Semester *</label>
                        <input
                            type="text"
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            placeholder="e.g., Fall 2024"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="feeType">Fee Type *</label>
                        <select
                            id="feeType"
                            name="feeType"
                            value={formData.feeType}
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

                    <div className="form-group">
                        <label htmlFor="amount">Amount *</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate">Due Date *</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : '✓ Add Fee'}
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

export default AddFee;