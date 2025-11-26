import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">University SMS</h2>

      <nav className="nav-links">
        <NavLink to="/" className="nav-item">
          🏠 Dashboard
        </NavLink>

        <h4 className="nav-header">Management</h4>
        <NavLink to="/students" className="nav-item">
          🎓 Students
        </NavLink>
        <NavLink to="/departments" className="nav-item">
          🏢 Departments
        </NavLink>
        <NavLink to="/courses" className="nav-item">
          📘 Courses
        </NavLink>
        <NavLink to="/addresses" className="nav-item">
          📍 Addresses
        </NavLink>
        <NavLink to="/enrollments" className="nav-item">
          📝 Enrollments
        </NavLink>
        <NavLink to="/fees" className="nav-item">
          💲 Fees
        </NavLink>
      </nav>
    </div>
  );
}
