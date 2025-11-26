// src/pages/Enrollments/EnrollmentsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentAPI } from '../../services/api';
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

export default function EnrollmentsList() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await enrollmentAPI.get('/');
        if (!mounted) return;
        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
        setEnrollments([]);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = enrollments.filter((e) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (e.student?.firstName || '').toLowerCase().includes(term) ||
      (e.student?.lastName || '').toLowerCase().includes(term) ||
      (e.course?.courseName || '').toLowerCase().includes(term) ||
      (e.status || '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?'))
      return;
    try {
      await enrollmentAPI.delete(`/${id}`);
      const res = await enrollmentAPI.get('/');
      setEnrollments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed. Check console.');
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Enrollments</h2>
        <button
          className="btn btn-primary-custom"
          onClick={() => navigate('/enrollments/add')}
        >
          + Add Enrollment
        </button>
      </div>

      <div className="card card-custom p-3 mb-3">
        <div className="d-flex gap-3 align-items-center">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by student, course or status..."
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
              <th>Student</th>
              <th>Course</th>
              <th>Status</th>
              <th>Enrollment Date</th>
              <th>Attendance</th>
              <th>Grade</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No enrollments found.
                </td>
              </tr>
            ) : (
              pageItems.map((e) => (
                <tr key={e.enrollmentId}>
                  <td>
                    {e.student?.firstName} {e.student?.lastName}
                    <br />
                    <span className="text-secondary small">
                      #{e.student?.studentNumber}
                    </span>
                  </td>
                  <td>
                    {e.course?.courseName}
                    <br />
                    <span className="text-secondary small">
                      {e.course?.courseCode}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${(
                        e.status || ''
                      ).toLowerCase()}`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td>{e.enrollmentDate}</td>
                  <td>{e.attendancePercentage}%</td>
                  <td>{e.grade || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary-custom me-2"
                      onClick={() =>
                        navigate(`/enrollments/edit/${e.enrollmentId}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger-custom"
                      onClick={() => handleDelete(e.enrollmentId)}
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
