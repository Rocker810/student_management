package com.example.student_management.repository;

import com.example.student_management.enums.StudentStatus;
import com.example.student_management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Find student by student number
    Optional<Student> findByStudentNumber(String studentNumber);

    // Find student by email
    Optional<Student> findByEmail(String email);

    // Check if student number exists
    boolean existsByStudentNumber(String studentNumber);

    // Check if email exists
    boolean existsByEmail(String email);

    // Find all students in a department
    List<Student> findByDepartmentDepartmentId(Long departmentId);

    // Find students by status (Active, Inactive, etc.)
    List<Student> findByStudentStatus(StudentStatus status);

    // Find students by first name or last name (case-insensitive)
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    // Custom query: Find students with GPA above a threshold
    @Query("SELECT s FROM Student s WHERE s.gpa >= :minGpa")
    List<Student> findStudentsWithMinGpa(@Param("minGpa") Double minGpa);

    // Count students by department
    long countByDepartmentDepartmentId(Long departmentId);
}
