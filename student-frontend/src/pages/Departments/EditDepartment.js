import React, { useEffect, useState } from 'react';
import { departmentAPI } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import FormCard from '../../components/FormCard';

export default function EditDepartment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    departmentCode: '',
    departmentName: '',
    headOfDepartment: '',
    email: '',
    phone: '',
    building: '',
    establishedYear: '',
  });

  useEffect(() => {
    departmentAPI.get(`/${id}`).then((res) => {
      const d = res.data;
      setForm({
        departmentCode: d.departmentCode || '',
        departmentName: d.departmentName || '',
        headOfDepartment: d.headOfDepartment || '',
        email: d.email || '',
        phone: d.phone || '',
        building: d.building || '',
        establishedYear: d.establishedYear || '',
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
        ...form,
        establishedYear: form.establishedYear
          ? Number(form.establishedYear)
          : null,
      };

      await departmentAPI.put(`/${id}`, payload);
      navigate('/departments');
    } catch (err) {
      console.error('Failed to update department:', err);
      alert('Update failed.');
    }
  };

  return (
    <FormCard title="Edit Department" backUrl="/departments">
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ gap: 20 }}>
          {/* LEFT */}
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Department Code *</label>
              <input
                name="departmentCode"
                required
                value={form.departmentCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department Name *</label>
              <input
                name="departmentName"
                required
                value={form.departmentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Head of Department</label>
              <input
                name="headOfDepartment"
                value={form.headOfDepartment}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Building</label>
              <input
                name="building"
                value={form.building}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Established Year</label>
              <input
                name="establishedYear"
                type="number"
                value={form.establishedYear}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
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
            onClick={() => navigate('/departments')}
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
