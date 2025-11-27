// src/layout/Layout.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path) ? 'active' : '';
    };

    return (
        <div className="layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>SMS</h2>
                    <button
                        className="toggle-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                        <span className="icon">📊</span>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>

                    <Link to="/students" className={`nav-item ${isActive('/students')}`}>
                        <span className="icon">👨‍🎓</span>
                        {sidebarOpen && <span>Students</span>}
                    </Link>

                    <Link to="/departments" className={`nav-item ${isActive('/departments')}`}>
                        <span className="icon">🏢</span>
                        {sidebarOpen && <span>Departments</span>}
                    </Link>

                    <Link to="/courses" className={`nav-item ${isActive('/courses')}`}>
                        <span className="icon">📚</span>
                        {sidebarOpen && <span>Courses</span>}
                    </Link>

                    <Link to="/enrollments" className={`nav-item ${isActive('/enrollments')}`}>
                        <span className="icon">📝</span>
                        {sidebarOpen && <span>Enrollments</span>}
                    </Link>

                    <Link to="/addresses" className={`nav-item ${isActive('/addresses')}`}>
                        <span className="icon">📍</span>
                        {sidebarOpen && <span>Addresses</span>}
                    </Link>

                    <Link to="/fees" className={`nav-item ${isActive('/fees')}`}>
                        <span className="icon">💰</span>
                        {sidebarOpen && <span>Fees</span>}
                    </Link>
                </nav>
            </aside>

            <div className="main-content">
                <header className="header">
                    <h1>Student Management System</h1>
                </header>
                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;