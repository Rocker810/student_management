package com.example.student_management.service;

import com.example.student_management.model.Courses;

import java.util.List;

public interface CourseService {
    // Create
    Courses createCourse(Courses course);

    // Read
    List<Courses> getAllCourses();
    Courses getCourseById(Long id);
    Courses getCourseByCourseCode(String courseCode);
    List<Courses> getCoursesByDepartment(Long departmentId);
    List<Courses> getCoursesBySemester(String semester);
    List<Courses> getActiveCourses();
    List<Courses> searchCoursesByName(String name);
    List<Courses> getCoursesWithAvailableSeats();

    // Update
    Courses updateCourse(Long id, Courses course);
    Courses activateCourse(Long id);
    Courses deactivateCourse(Long id);

    // Delete
    void deleteCourse(Long id);

    // Validation
    boolean existsByCourseCode(String courseCode);

    // Statistics
    long countEnrollmentsInCourse(Long courseId);
    boolean hasAvailableSeats(Long courseId);
}
