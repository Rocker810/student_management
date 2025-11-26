// src/components/FormCard.jsx
import React from 'react';

export default function FormCard({ children, title, backUrl }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
      <div style={{ width: '100%', maxWidth: 720 }}>
        {backUrl && (
          <div style={{ marginBottom: 12 }}>
            <a
              href={backUrl}
              className="btn-outline"
              style={{ textDecoration: 'none' }}
            >
              ← Back
            </a>
          </div>
        )}
        {title && <h2 className="page-title">{title}</h2>}
        <div className="form-card">{children}</div>
      </div>
    </div>
  );
}
