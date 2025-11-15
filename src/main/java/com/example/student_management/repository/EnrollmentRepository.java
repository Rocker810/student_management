package com.example.student_management.repository;

import com.example.student_management.enums.EnrollmentStatus;
import com.example.student_management.model.Enrollments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollments,Long> {
    // Find all enrollments for a student
    List<Enrollments> findByStudentStudentId(Long studentId);

    // Find all enrollments for a course
    List<Enrollments> findByCourseCourseId(Long courseId);

    // Find enrollments by status
    List<Enrollments> findByStatus(EnrollmentStatus status);

    // Find enrollments for a student with specific status
    List<Enrollments> findByStudentStudentIdAndStatus(Long studentId, EnrollmentStatus status);

    // Check if student is enrolled in a course
    boolean existsByStudentStudentIdAndCourseCourseId(Long studentId, Long courseId);

    // Find specific enrollment
    Optional<Enrollments> findByStudentStudentIdAndCourseCourseId(Long studentId, Long courseId);

    // Count enrollments for a course
    long countByCourseCourseId(Long courseId);

    // Count enrollments for a student
    long countByStudentStudentId(Long studentId);

    // Custom query: Find enrollments with grade
    @Query("SELECT e FROM Enrollments e WHERE e.student.studentId = :studentId " +
            "AND e.grade IS NOT NULL")
    List<Enrollments> findCompletedEnrollmentsByStudent(@Param("studentId") Long studentId);

    // Custom query: Calculate average GPA for a student
    @Query("SELECT AVG(e.gradePoints) FROM Enrollments e WHERE e.student.studentId = :studentId " +
            "AND e.gradePoints IS NOT NULL")
    Double calculateAverageGpa(@Param("studentId") Long studentId);

    // Delete all enrollments for a student
    void deleteByStudentStudentId(Long studentId);
}
