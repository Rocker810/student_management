// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, courseAPI, departmentAPI, enrollmentAPI, feeAPI } from '../../services/api';
import '../../styles/Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        departments: 0,
        enrollments: 0,
        pendingFees: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [studentsRes, coursesRes, departmentsRes, enrollmentsRes, feesRes] = await Promise.all([
                studentAPI.get(),
                courseAPI.get(),
                departmentAPI.get(),
                enrollmentAPI.get(),
                feeAPI.get(),
            ]);

            const pendingFees = feesRes.data.filter(
                fee => fee.paymentStatus === 'Pending' || fee.paymentStatus === 'Partial'
            ).length;

            setStats({
                students: studentsRes.data.length,
                courses: coursesRes.data.length,
                departments: departmentsRes.data.length,
                enrollments: enrollmentsRes.data.length,
                pendingFees: pendingFees,
            });
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-details">
                        <h3>Students</h3>
                        <p className="stat-number">{stats.students}</p>
                        <Link to="/students">View All →</Link>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon">📚</div>
                    <div className="stat-details">
                        <h3>Courses</h3>
                        <p className="stat-number">{stats.courses}</p>
                        <Link to="/courses">View All →</Link>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-details">
                        <h3>Departments</h3>
                        <p className="stat-number">{stats.departments}</p>
                        <Link to="/departments">View All →</Link>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">📝</div>
                    <div className="stat-details">
                        <h3>Enrollments</h3>
                        <p className="stat-number">{stats.enrollments}</p>
                        <Link to="/enrollments">View All →</Link>
                    </div>
                </div>

                <div className="stat-card red">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                        <h3>Pending Fees</h3>
                        <p className="stat-number">{stats.pendingFees}</p>
                        <Link to="/fees">View All →</Link>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/students/add" className="action-btn">
                        <span className="action-icon">➕</span>
                        Add New Student
                    </Link>
                    <Link to="/courses/add" className="action-btn">
                        <span className="action-icon">➕</span>
                        Add New Course
                    </Link>
                    <Link to="/enrollments/add" className="action-btn">
                        <span className="action-icon">➕</span>
                        Enroll Student
                    </Link>
                    <Link to="/fees/add" className="action-btn">
                        <span className="action-icon">➕</span>
                        Add Fee Record
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;