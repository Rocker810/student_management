// src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination">
      <button
        className="btn-outline"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Prev
      </button>
      <div style={{ fontWeight: 700 }}>
        {page} / {totalPages}
      </div>
      <button
        className="btn-outline"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
