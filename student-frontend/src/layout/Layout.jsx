// src/layout/Layout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout-root">
      <Sidebar />
      <main className="layout-main">
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
}
