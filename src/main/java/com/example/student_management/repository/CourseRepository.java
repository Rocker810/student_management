package com.example.student_management.repository;

import com.example.student_management.model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Courses,Long> {
    // Find course by course code
    Optional<Courses> findByCourseCode(String courseCode);

    // Check if course code exists
    boolean existsByCourseCode(String courseCode);

    // Find courses by department
    List<Courses> findByDepartmentDepartmentId(Long departmentId);

    // Find courses by semester
    List<Courses> findBySemester(String semester);

    // Find active courses only
    List<Courses> findByIsActiveTrue();

    // Find courses by credits
    List<Courses> findByCredits(Integer credits);

    // Find courses by instructor
    List<Courses> findByInstructorNameContainingIgnoreCase(String instructorName);

    // Search courses by name (partial match, case-insensitive)
    List<Courses> findByCourseNameContainingIgnoreCase(String courseName);

    // Custom query: Find courses with available seats
    @Query("SELECT c FROM Courses c WHERE " +
            "(SELECT COUNT(e) FROM Enrollments e WHERE e.course.courseId = c.courseId " +
            "AND e.status = com.example.student_management.enums.EnrollmentStatus.Enrolled) < c.maxStudents")
    List<Courses> findCoursesWithAvailableSeats();

    // Count courses by department
    long countByDepartmentDepartmentId(Long departmentId);
}
