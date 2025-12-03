package com.example.student_management.repository;

import com.example.student_management.enums.StudentStatus;
import com.example.student_management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
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

    @Query("SELECT s FROM Student s WHERE " +
            "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.studentNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(@Param("keyword") String keyword);

    // Filter by status AND department
    List<Student> findByStudentStatusAndDepartmentDepartmentId(StudentStatus status, Long departmentId);

    // Filter by GPA range
    @Query("SELECT s FROM Student s WHERE s.gpa BETWEEN :minGpa AND :maxGpa")
    List<Student> findByGpaBetween(@Param("minGpa") BigDecimal minGpa, @Param("maxGpa") BigDecimal maxGpa);

    // Combined filter query
    @Query("SELECT s FROM Student s WHERE " +
            "(:status IS NULL OR s.studentStatus = :status) AND " +
            "(:departmentId IS NULL OR s.department.departmentId = :departmentId) AND " +
            "(:minGpa IS NULL OR s.gpa >= :minGpa)")
    List<Student> filterStudents(
            @Param("status") StudentStatus status,
            @Param("departmentId") Long departmentId,
            @Param("minGpa") BigDecimal minGpa
    );
}
