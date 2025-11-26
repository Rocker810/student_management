// src/pages/Departments/DepartmentsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentAPI } from '../../services/api';
import '../../index.css';

function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="pagination-row">
      <button
        className="btn btn-secondary-custom"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        Prev
      </button>
      <div className="pagination-info">
        Page <strong>{page}</strong> / {totalPages}
      </div>
      <button
        className="btn btn-secondary-custom"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default function DepartmentsList() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await departmentAPI.get('/');
        if (!mounted) return;
        setDepartments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setDepartments([]);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = departments.filter((d) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (d.departmentName || '').toLowerCase().includes(term) ||
      (d.departmentCode || '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const deleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?'))
      return;
    try {
      await departmentAPI.delete(`/${id}`);
      const res = await departmentAPI.get('/');
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete department. Check console.');
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Departments</h2>
        <button
          className="btn btn-primary-custom px-4"
          onClick={() => navigate('/departments/add')}
        >
          + Add Department
        </button>
      </div>

      <div className="card card-custom p-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="card card-custom p-3">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Head</th>
              <th>Building</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Established</th>
              <th style={{ width: 160, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No departments found.
                </td>
              </tr>
            ) : (
              pageItems.map((dept) => (
                <tr key={dept.departmentId}>
                  <td className="fw-bold">{dept.departmentCode}</td>
                  <td>{dept.departmentName}</td>
                  <td>{dept.headOfDepartment || '—'}</td>
                  <td>{dept.building || '—'}</td>
                  <td>{dept.phone || '—'}</td>
                  <td>{dept.email || '—'}</td>
                  <td>{dept.establishedYear || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() =>
                        navigate(`/departments/edit/${dept.departmentId}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteDepartment(dept.departmentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          <div className="text-muted small">
            Showing {(page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>
        </div>
      </div>
    </div>
  );
}
