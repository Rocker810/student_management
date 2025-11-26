// src/pages/Fees/FeesList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { feeAPI } from '../../services/api';
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

export default function FeesList() {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await feeAPI.get('/');
        if (!mounted) return;
        setFees(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load fees:', err);
        setFees([]);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = fees.filter((f) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (f.student?.firstName || '').toLowerCase().includes(term) ||
      (f.student?.lastName || '').toLowerCase().includes(term) ||
      (f.semester || '').toLowerCase().includes(term) ||
      (f.feeType || '').toLowerCase().includes(term) ||
      (String(f.amount) || '').includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?'))
      return;
    try {
      await feeAPI.delete(`/${id}`);
      const res = await feeAPI.get('/');
      setFees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to delete fee:', err);
      alert('Failed to delete! Check console.');
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title mb-4">Fees Management</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link to="/fees/add" className="btn btn-primary-custom">
          + Add Fee
        </Link>
      </div>

      <div className="card card-custom p-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by student, semester, type..."
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
              <th>Student</th>
              <th>Semester</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Method</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">
                  No fee records found
                </td>
              </tr>
            ) : (
              pageItems.map((f) => (
                <tr key={f.feeId}>
                  <td>
                    {f.student?.firstName} {f.student?.lastName}
                    <div className="sub-text">#{f.student?.studentNumber}</div>
                  </td>
                  <td>{f.semester}</td>
                  <td>{f.feeType}</td>
                  <td>${f.amount}</td>
                  <td>${f.paidAmount}</td>
                  <td>{f.dueDate}</td>
                  <td>
                    <span
                      className={`status-badge status-${(
                        f.paymentStatus || ''
                      ).toLowerCase()}`}
                    >
                      {f.paymentStatus}
                    </span>
                  </td>
                  <td>{f.paymentMethod || 'N/A'}</td>
                  <td className="d-flex gap-2">
                    <Link
                      to={`/fees/edit/${f.feeId}`}
                      className="btn-table btn-edit"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(f.feeId)}
                      className="btn-table btn-delete"
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
