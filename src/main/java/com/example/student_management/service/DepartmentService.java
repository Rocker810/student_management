package com.example.student_management.service;

import com.example.student_management.model.Department;

import java.util.List;

public interface DepartmentService {
    // Create
    Department createDepartment(Department department);

    // Read
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
    Department getDepartmentByCode(String code);

    // Update
    Department updateDepartment(Long id, Department department);

    // Delete
    void deleteDepartment(Long id);

    // Validation
    boolean existsByCode(String code);

    // Statistics
    long countStudentsInDepartment(Long departmentId);
    long countCoursesInDepartment(Long departmentId);
}
