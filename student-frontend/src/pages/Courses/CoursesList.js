// src/pages/Courses/CoursesList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../services/api';
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

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await courseAPI.get('/');
        if (!mounted) return;
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load courses:', err);
        setCourses([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = courses.filter((c) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (c.courseName || '').toLowerCase().includes(term) ||
      (c.courseCode || '').toLowerCase().includes(term) ||
      (c.department?.departmentName || '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseAPI.delete(`/${id}`);
      // reload
      const res = await courseAPI.get('/');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed! Check console.');
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Courses</h2>
        <Link to="/courses/add" className="btn btn-primary-custom">
          + Add Course
        </Link>
      </div>

      <div className="card card-custom p-3 mb-3">
        <div className="d-flex gap-3 align-items-center">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name, code, or department..."
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
              <th style={{ width: 110 }}>Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th style={{ width: 80 }}>Credits</th>
              <th>Instructor</th>
              <th>Semester</th>
              <th style={{ width: 90 }}>Active</th>
              <th style={{ width: 160, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No courses found
                </td>
              </tr>
            ) : (
              pageItems.map((c, idx) => (
                <tr key={c.courseId || idx}>
                  <td className="fw-bold text-primary">{c.courseCode}</td>
                  <td>{c.courseName}</td>
                  <td>{c.department?.departmentName || '—'}</td>
                  <td>{c.credits}</td>
                  <td>{c.instructorName || '—'}</td>
                  <td>{c.semester || '—'}</td>
                  <td>
                    {c.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/courses/edit/${c.courseId}`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c.courseId)}
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
