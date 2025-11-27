// src/pages/Courses/CoursesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../services/api';
import '../../styles/Table.css';

function CoursesList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.get();
            setCourses(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseAPI.delete(`/${id}`);
                fetchCourses();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete course');
            }
        }
    };

    if (loading) return <div className="loading">Loading courses...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Courses</h1>
                <Link to="/courses/add" className="btn btn-primary">
                    ➕ Add New Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <p className="no-data">No courses found.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Credits</th>
                            <th>Department</th>
                            <th>Instructor</th>
                            <th>Capacity</th>
                            <th>Semester</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td><strong>{course.courseCode}</strong></td>
                                <td>{course.courseName}</td>
                                <td>{course.credits}</td>
                                <td>{course.department?.departmentName || 'N/A'}</td>
                                <td>{course.instructorName || 'N/A'}</td>
                                <td>{course.maxStudents}</td>
                                <td>{course.semester}</td>
                                <td>
                    <span className={`badge ${course.isActive ? 'active' : 'inactive'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                                </td>
                                <td className="actions">
                                    <Link to={`/courses/edit/${course.courseId}`} className="btn btn-sm btn-edit">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(course.courseId)}
                                        className="btn btn-sm btn-delete"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CoursesList;