import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import '../../index.css';

// Pagination Component
function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination-container">
      <button
        className="btn btn-secondary-custom"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>

      <span className="pagination-info">
        Page <strong>{page}</strong> / {totalPages}
      </span>

      <button
        className="btn btn-secondary-custom"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const pageSize = 8;

  // Fetch Students (stable function to avoid ESLint warnings)
  const loadStudents = useCallback(async () => {
    try {
      const res = await studentAPI.get('/'); // backend returns full list
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error loading students', error);
      setStudents([]);
    }
  }, []);

  // Run once on mount
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Search filter
  const filtered = students.filter((s) => {
    const t = search.toLowerCase().trim();
    if (!t) return true;

    const full = `
      ${s.studentNumber}
      ${s.firstName}
      ${s.lastName}
      ${s.email}
      ${s.department?.departmentName}
    `.toLowerCase();

    return full.includes(t);
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  // Delete Student
  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentAPI.delete(`/${id}`);
      loadStudents();
    } catch (error) {
      alert('Delete failed.');
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Students</h2>

        <Link to="/students/add" className="btn btn-primary-custom">
          + Add Student
        </Link>
      </div>

      {/* SEARCH BOX */}
      <div className="card card-custom mb-4 p-3">
        <input
          className="form-control"
          style={{ width: '320px' }}
          placeholder="Search students..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* STUDENTS TABLE */}
      <div className="card card-custom p-3">
        <table className="table-modern">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Status</th>
              <th>GPA</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-3 text-muted">
                  No students found
                </td>
              </tr>
            ) : (
              pageItems.map((s, i) => (
                <tr key={s.studentId}>
                  <td>{pageStart + i + 1}</td>
                  <td className="fw-bold">{s.studentNumber}</td>
                  <td>
                    {s.firstName} {s.lastName}
                  </td>
                  <td>{s.email}</td>
                  <td>{s.department?.departmentName || '—'}</td>
                  <td>{s.studentStatus}</td>
                  <td>{s.gpa ?? '—'}</td>

                  {/* ACTION BUTTONS */}
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/students/edit/${s.studentId}`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteStudent(s.studentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION ROW */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />

          <span className="text-muted small">
            Showing {pageStart + 1}-
            {Math.min(pageStart + pageSize, filtered.length)} of{' '}
            {filtered.length}
          </span>
        </div>
      </div>
    </div>
  );
}
