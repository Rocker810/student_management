import React, { useEffect, useState } from 'react';
import { addressAPI, studentAPI } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard from '../../components/FormCard';

export default function EditAddress() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    addressType: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isPrimary: true,
  });

  // Load students + address
  useEffect(() => {
    studentAPI.get('/').then((r) => setStudents(r.data || []));

    addressAPI.get(`/${id}`).then((r) => {
      const a = r.data;

      setForm({
        studentId: a.student?.studentId || '',
        addressType: a.addressType || '',
        streetAddress: a.streetAddress || '',
        city: a.city || '',
        state: a.state || '',
        postalCode: a.postalCode || '',
        country: a.country || 'USA',
        isPrimary: a.isPrimary ?? true,
      });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        student: { studentId: Number(form.studentId) },
        addressType: form.addressType,
        streetAddress: form.streetAddress,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        isPrimary: form.isPrimary,
      };

      await addressAPI.put(`/${id}`, payload);
      navigate('/addresses');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update address');
    }
  };

  return (
    <FormCard title="Edit Address" backUrl="/addresses">
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 20 }}>
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
                    {s.firstName} {s.lastName} — #{s.studentNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Address Type *</label>
              <select
                name="addressType"
                required
                value={form.addressType}
                onChange={handleChange}
              >
                <option value="">-- Select Type --</option>
                <option value="HOME">HOME</option>
                <option value="WORK">WORK</option>
                <option value="MAILING">MAILING</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                name="streetAddress"
                value={form.streetAddress}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>State</label>
              <input name="state" value={form.state} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="isPrimary"
                checked={form.isPrimary}
                onChange={handleChange}
              />
              <label>Primary Address</label>
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
            onClick={() => navigate('/addresses')}
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
