package com.example.student_management.service;

import com.example.student_management.enums.EnrollmentStatus;
import com.example.student_management.model.Enrollments;

import java.util.List;

public interface EnrollmentService {
    // Create
    Enrollments createEnrollment(Enrollments enrollment);
    Enrollments enrollStudentInCourse(Long studentId, Long courseId);

    // Read
    List<Enrollments> getAllEnrollments();
    Enrollments getEnrollmentById(Long id);
    List<Enrollments> getEnrollmentsByStudent(Long studentId);
    List<Enrollments> getEnrollmentsByCourse(Long courseId);
    List<Enrollments> getEnrollmentsByStatus(EnrollmentStatus status);
    Enrollments getEnrollmentByStudentAndCourse(Long studentId, Long courseId);

    // Update
    Enrollments updateEnrollment(Long id, Enrollments enrollment);
    Enrollments updateEnrollmentStatus(Long id, EnrollmentStatus status);
    Enrollments updateGrade(Long id, String grade, Double gradePoints);
    Enrollments updateAttendance(Long id, Double attendancePercentage);

    // Delete
    void deleteEnrollment(Long id);
    void withdrawEnrollment(Long id);
    void deleteAllEnrollmentsByStudent(Long studentId);

    // Validation
    boolean isStudentEnrolledInCourse(Long studentId, Long courseId);
    boolean canEnrollInCourse(Long studentId, Long courseId);

    // Statistics
    long countEnrollmentsByStudent(Long studentId);
    long countEnrollmentsByCourse(Long courseId);
    List<Enrollments> getCompletedEnrollments(Long studentId);
    Double calculateStudentGpa(Long studentId);
}
