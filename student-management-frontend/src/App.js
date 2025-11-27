// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Students
import StudentsList from './pages/Students/StudentsList';
import AddStudent from './pages/Students/AddStudent';
import EditStudent from './pages/Students/EditStudent';

// Departments
import DepartmentsList from './pages/Departments/DepartmentsList';
import AddDepartment from './pages/Departments/AddDepartment';
import EditDepartment from './pages/Departments/EditDepartment';

// Courses
import CoursesList from './pages/Courses/CoursesList';
import AddCourse from './pages/Courses/AddCourse';
import EditCourse from './pages/Courses/EditCourse';

// Addresses
import AddressesList from './pages/Addresses/AddressesList';
import AddAddress from './pages/Addresses/AddAddress';
import EditAddress from './pages/Addresses/EditAddress';

// Enrollments
import EnrollmentsList from './pages/Enrollments/EnrollmentsList';
import AddEnrollment from './pages/Enrollments/AddEnrollment';
import EditEnrollment from './pages/Enrollments/EditEnrollment';

// Fees
import FeesList from './pages/Fees/FeesList';
import AddFee from './pages/Fees/AddFee';
import EditFee from './pages/Fees/EditFee';

function App() {
  return (
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />

            <Route path="/departments" element={<DepartmentsList />} />
            <Route path="/departments/add" element={<AddDepartment />} />
            <Route path="/departments/edit/:id" element={<EditDepartment />} />

            <Route path="/courses" element={<CoursesList />} />
            <Route path="/courses/add" element={<AddCourse />} />
            <Route path="/courses/edit/:id" element={<EditCourse />} />

            <Route path="/addresses" element={<AddressesList />} />
            <Route path="/addresses/add" element={<AddAddress />} />
            <Route path="/addresses/edit/:id" element={<EditAddress />} />

            <Route path="/enrollments" element={<EnrollmentsList />} />
            <Route path="/enrollments/add" element={<AddEnrollment />} />
            <Route path="/enrollments/edit/:id" element={<EditEnrollment />} />

            <Route path="/fees" element={<FeesList />} />
            <Route path="/fees/add" element={<AddFee />} />
            <Route path="/fees/edit/:id" element={<EditFee />} />
          </Routes>
        </Layout>
      </BrowserRouter>
  );
}

export default App;