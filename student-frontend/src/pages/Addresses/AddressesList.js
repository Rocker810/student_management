// src/pages/Addresses/AddressesList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addressAPI } from '../../services/api';
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

export default function AddressesList() {
  const [addresses, setAddresses] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await addressAPI.get('/');
        if (!mounted) return;
        setAddresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load addresses:', err);
        setAddresses([]);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = addresses.filter((a) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (a.streetAddress || '').toLowerCase().includes(term) ||
      (a.city || '').toLowerCase().includes(term) ||
      (a.state || '').toLowerCase().includes(term) ||
      (a.postalCode || '').toLowerCase().includes(term) ||
      (a.student?.firstName || '').toLowerCase().includes(term) ||
      (a.student?.lastName || '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?'))
      return;
    try {
      await addressAPI.delete(`/${id}`);
      const res = await addressAPI.get('/');
      setAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed. Check console.');
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Student Addresses</h2>
        <Link to="/addresses/add" className="btn btn-primary-custom">
          + Add Address
        </Link>
      </div>

      <div className="card card-custom p-3 mb-3">
        <div className="d-flex gap-3 align-items-center">
          <input
            className="form-control search-input"
            placeholder="Search addresses by student, city, or postal code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: 420 }}
          />
          <div className="text-muted small">Found: {filtered.length}</div>
        </div>
      </div>

      <div className="card card-custom p-3">
        <table className="table-modern">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Student</th>
              <th>Type</th>
              <th>Street</th>
              <th>City</th>
              <th>State</th>
              <th>Postal</th>
              <th>Country</th>
              <th style={{ width: 80 }}>Primary</th>
              <th style={{ width: 160, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted py-4">
                  No addresses found
                </td>
              </tr>
            ) : (
              pageItems.map((a, idx) => (
                <tr key={a.addressId || idx}>
                  <td>{a.addressId}</td>
                  <td>
                    {a.student
                      ? `${a.student.firstName} ${a.student.lastName}`
                      : 'N/A'}
                  </td>
                  <td>{a.addressType}</td>
                  <td>{a.streetAddress}</td>
                  <td>{a.city}</td>
                  <td>{a.state}</td>
                  <td>{a.postalCode}</td>
                  <td>{a.country}</td>
                  <td>
                    {a.isPrimary ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/addresses/edit/${a.addressId}`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(a.addressId)}
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
