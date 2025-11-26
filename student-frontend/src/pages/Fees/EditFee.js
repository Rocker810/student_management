import React, { useEffect, useState } from 'react';
import { feeAPI, studentAPI } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard from '../../components/FormCard';

export default function EditFee() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    studentAPI.get('/').then((r) => setStudents(r.data || []));

    feeAPI.get(`/${id}`).then((res) => {
      const f = res.data;

      setForm({
        studentId: f.student?.studentId || '',
        semester: f.semester || '',
        feeType: f.feeType || '',
        amount: f.amount || '',
        paidAmount: f.paidAmount || '',
        dueDate: f.dueDate || '',
        paymentDate: f.paymentDate || '',
        paymentStatus: f.paymentStatus || 'Pending',
        paymentMethod: f.paymentMethod || '',
        transactionId: f.transactionId || '',
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
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

      await feeAPI.put(`/${id}`, payload);
      navigate('/fees');
    } catch (err) {
      console.error('Failed to update fee:', err);
      alert('Failed to update fee');
    }
  };

  return (
    <FormCard title="Edit Fee" backUrl="/fees">
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 20 }}>
          {/* LEFT */}
          <div style={{ flex: 1 }}>
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
                    {s.firstName} {s.lastName} ({s.studentNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semester *</label>
              <input
                name="semester"
                required
                value={form.semester}
                onChange={handleChange}
              />
            </div>

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

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Paid Amount</label>
              <input
                name="paidAmount"
                type="number"
                value={form.paidAmount}
                onChange={handleChange}
              />
            </div>

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

            <div className="form-group">
              <label>Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
              />
            </div>

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

            <div className="form-group">
              <label>Transaction ID</label>
              <input
                name="transactionId"
                value={form.transactionId}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/fees')}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-custom">
            Save Changes
          </button>
        </div>
      </form>
    </FormCard>
  );
}
