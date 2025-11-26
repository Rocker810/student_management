import React, { useEffect, useState } from 'react';
import {
  studentAPI,
  courseAPI,
  departmentAPI,
  feeAPI,
  enrollmentAPI,
  addressAPI,
} from '../../services/api';
import './dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    departments: 0,
    fees: 0,
    enrollments: 0,
    addresses: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [s, c, d, f, e, a] = await Promise.all([
          studentAPI.get('/'),
          courseAPI.get('/'),
          departmentAPI.get('/'),
          feeAPI.get('/'),
          enrollmentAPI.get('/'),
          addressAPI.get('/'),
        ]);

        setStats({
          students: s.data.length,
          courses: c.data.length,
          departments: d.data.length,
          fees: f.data.length,
          enrollments: e.data.length,
          addresses: a.data.length,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* ==== HEADER / HERO ==== */}
      <div className="dashboard-hero-advanced">
        <div className="hero-left">
          <img src="/logo192.png" alt="University Logo" className="hero-logo" />
          <div>
            <h1 className="hero-greeting">Student Management System Portal</h1>
            <p className="hero-subtitle">
              Centralized Student Management Dashboard
            </p>
          </div>
        </div>

        <div className="hero-right">
          <div className="today-box">
            <div className="today-label">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                timeZone: 'America/Chicago',
              })}
            </div>
            <div className="today-date">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'America/Chicago',
              })}
            </div>
            <div className="today-time">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Chicago',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ==== QUICK ACTIONS ==== */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions">
        <a href="/students/add" className="quick-btn">
          ➕ Add Student
        </a>
        <a href="/courses/add" className="quick-btn">
          📘 Add Course
        </a>
        <a href="/departments/add" className="quick-btn">
          🏛️ Add Department
        </a>
        <a href="/enrollments/add" className="quick-btn">
          📝 Add Enrollment
        </a>
        <a href="/fees/add" className="quick-btn">
          💵 Record Fee
        </a>
      </div>

      {/* ==== STAT CARDS ==== */}
      <h2 className="section-title mt-20">Statistics Overview</h2>

      <div className="stats-grid-advanced">
        <div className="stat-card-adv fade-in">
          <div className="stat-icon-adv">🎓</div>
          <div className="stat-value-adv">{stats.students}</div>
          <div className="stat-label-adv">Students</div>
        </div>

        <div className="stat-card-adv fade-in delay1">
          <div className="stat-icon-adv">📘</div>
          <div className="stat-value-adv">{stats.courses}</div>
          <div className="stat-label-adv">Courses</div>
        </div>

        <div className="stat-card-adv fade-in delay2">
          <div className="stat-icon-adv">🏛️</div>
          <div className="stat-value-adv">{stats.departments}</div>
          <div className="stat-label-adv">Departments</div>
        </div>

        <div className="stat-card-adv fade-in delay3">
          <div className="stat-icon-adv">📝</div>
          <div className="stat-value-adv">{stats.enrollments}</div>
          <div className="stat-label-adv">Enrollments</div>
        </div>

        <div className="stat-card-adv fade-in delay4">
          <div className="stat-icon-adv">🧾</div>
          <div className="stat-value-adv">{stats.fees}</div>
          <div className="stat-label-adv">Fees</div>
        </div>

        <div className="stat-card-adv fade-in delay5">
          <div className="stat-icon-adv">📍</div>
          <div className="stat-value-adv">{stats.addresses}</div>
          <div className="stat-label-adv">Addresses</div>
        </div>
      </div>

      {/* ==== RECENT ACTIVITY ==== */}
      <h2 className="section-title mt-20">Recent Activity</h2>
      <div className="activity-card">
        <p>No recent activity yet.</p>
        <small>Once data is added, recent updates appear here.</small>
      </div>
    </div>
  );
}
