// src/pages/Fees/AddFee.jsx

import React, { useEffect, useState } from 'react';
import { feeAPI, studentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddFee() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: '',
    semester: '',
    feeType: '',
    amount: '',
    paidAmount: '',
    dueDate: '',
    paymentDate: '',
    paymentStatus: 'Pending',
    paymentMethod: '',
    transactionId: '',
  });

  // Load Students
  useEffect(() => {
    studentAPI
      .get('/')
      .then((r) => setStudents(r.data || []))
      .catch(() => setStudents([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        student: { studentId: Number(form.studentId) },
        semester: form.semester,
        feeType: form.feeType,
        amount: Number(form.amount),
        paidAmount: form.paidAmount ? Number(form.paidAmount) : 0,
        dueDate: form.dueDate,
        paymentDate: form.paymentDate || null,
        paymentStatus: form.paymentStatus,
        paymentMethod: form.paymentMethod || null,
        transactionId: form.transactionId || null,
      };

      await feeAPI.post('/', payload);
      navigate('/fees');
    } catch (err) {
      console.error('Failed to add fee:', err);
      alert('Failed to add fee');
    }
  };

  return (
    <div className="form-container">
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate('/fees')}>
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--deep-blue)' }}>
        Add New Fee
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Student */}
        <div className="form-row">
          <div className="form-group">
            <label>Student *</label>
            <select
              name="studentId"
              required
              value={form.studentId}
              onChange={handleChange}
            >
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.firstName} {s.lastName} — #{s.studentNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Semester */}
        <div className="form-row">
          <div className="form-group">
            <label>Semester *</label>
            <input
              name="semester"
              required
              value={form.semester}
              onChange={handleChange}
              placeholder="e.g., Spring 2025"
            />
          </div>
        </div>

        {/* Fee Type */}
        <div className="form-row">
          <div className="form-group">
            <label>Fee Type *</label>
            <select
              name="feeType"
              required
              value={form.feeType}
              onChange={handleChange}
            >
              <option value="">-- Select Fee Type --</option>
              <option value="TUITION">TUITION</option>
              <option value="LAB">LAB</option>
              <option value="LIBRARY">LIBRARY</option>
              <option value="HOSTEL">HOSTEL</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        {/* Amount */}
        <div className="form-row">
          <div className="form-group">
            <label>Amount *</label>
            <input
              name="amount"
              type="number"
              required
              value={form.amount}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Paid Amount */}
        <div className="form-row">
          <div className="form-group">
            <label>Paid Amount</label>
            <input
              name="paidAmount"
              type="number"
              value={form.paidAmount}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="form-row">
          <div className="form-group">
            <label>Due Date *</label>
            <input
              type="date"
              name="dueDate"
              required
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Payment Date */}
        <div className="form-row">
          <div className="form-group">
            <label>Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Payment Status */}
        <div className="form-row">
          <div className="form-group">
            <label>Payment Status</label>
            <select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-row">
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="">-- None --</option>
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
              <option value="BANK_TRANSFER">BANK_TRANSFER</option>
              <option value="ONLINE">ONLINE</option>
            </select>
          </div>
        </div>

        {/* Transaction ID */}
        <div className="form-row">
          <div className="form-group">
            <label>Transaction ID</label>
            <input
              name="transactionId"
              value={form.transactionId}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/fees')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Add Fee
          </button>
        </div>
      </form>
    </div>
  );
}
