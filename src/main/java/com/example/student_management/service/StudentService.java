package com.example.student_management.service;

import com.example.student_management.enums.StudentStatus;
import com.example.student_management.model.Student;

import java.util.List;

public interface StudentService {
    // Create operations
    Student createStudent(Student student);

    // Read operations
    List<Student> getAllStudents();
    Student getStudentById(Long id);
    Student getStudentByStudentNumber(String studentNumber);
    Student getStudentByEmail(String email);
    List<Student> getStudentsByDepartment(Long departmentId);
    List<Student> getStudentsByStatus(StudentStatus status);
    List<Student> searchStudentsByName(String name);

    // Update operations
    Student updateStudent(Long id, Student student);
    Student updateStudentStatus(Long id, StudentStatus status);

    // Delete operations
    void deleteStudent(Long id);

    // Validation/Check operations
    boolean existsByStudentNumber(String studentNumber);
    boolean existsByEmail(String email);

    // Statistics operations
    long countStudentsByDepartment(Long departmentId);
    List<Student> getStudentsWithMinGpa(Double minGpa);
}
