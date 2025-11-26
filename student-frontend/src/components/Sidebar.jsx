// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive ? 'sidebar-link active' : 'sidebar-link';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">SMS Portal</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>
          🏠 Dashboard
        </NavLink>

        <div className="sidebar-section">Management</div>

        <NavLink to="/students" className={linkClass}>
          🎓 Students
        </NavLink>
        <NavLink to="/departments" className={linkClass}>
          🏢 Departments
        </NavLink>
        <NavLink to="/courses" className={linkClass}>
          📘 Courses
        </NavLink>
        <NavLink to="/addresses" className={linkClass}>
          📍 Addresses
        </NavLink>
        <NavLink to="/enrollments" className={linkClass}>
          📝 Enrollments
        </NavLink>
        <NavLink to="/fees" className={linkClass}>
          💲 Fees
        </NavLink>
      </nav>
    </aside>
  );
}
