package com.example.student_management.service;

import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.model.Courses;
import com.example.student_management.repository.CourseRepository;
import com.example.student_management.repository.DepartmentRepository;
import com.example.student_management.repository.EnrollmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseServiceImpl(CourseRepository courseRepository, DepartmentRepository departmentRepository,EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public Courses createCourse(Courses course) {
        // Check if course code already exists
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new RuntimeException("Course code already exists: " + course.getCourseCode());
        }

        // Verify department exists
        if (course.getDepartment() != null && course.getDepartment().getDepartmentId() != null) {
            departmentRepository.findById(course.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + course.getDepartment().getDepartmentId()));
        }

        // Set default values
        if (course.getMaxStudents() == null) {
            course.setMaxStudents(50);
        }
        if (course.getIsActive() == null) {
            course.setIsActive(true);
        }

        // Set timestamps
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    @Override
    public List<Courses> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Courses getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    @Override
    public Courses getCourseByCourseCode(String courseCode) {
        return courseRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with code: " + courseCode));
    }

    @Override
    public List<Courses> getCoursesByDepartment(Long departmentId) {
        // Verify department exists
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));

        return courseRepository.findByDepartmentDepartmentId(departmentId);
    }

    @Override
    public List<Courses> getCoursesBySemester(String semester) {
        return courseRepository.findBySemester(semester);
    }

    @Override
    public List<Courses> getActiveCourses() {
        return courseRepository.findByIsActiveTrue();
    }

    @Override
    public List<Courses> searchCoursesByName(String name) {
        return courseRepository.findByCourseNameContainingIgnoreCase(name);
    }

    @Override
    public List<Courses> getCoursesWithAvailableSeats() {
        return courseRepository.findCoursesWithAvailableSeats();
    }

    @Override
    public Courses updateCourse(Long id, Courses courseDetails) {
        Courses course = getCourseById(id);

        // Check if code is being changed and already exists
        if (!course.getCourseCode().equals(courseDetails.getCourseCode()) &&
                courseRepository.existsByCourseCode(courseDetails.getCourseCode())) {
            throw new RuntimeException("Course code already exists: " + courseDetails.getCourseCode());
        }

        // Verify department if changed
        if (courseDetails.getDepartment() != null &&
                courseDetails.getDepartment().getDepartmentId() != null) {
            departmentRepository.findById(courseDetails.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + courseDetails.getDepartment().getDepartmentId()));
        }

        // Update fields
        course.setCourseCode(courseDetails.getCourseCode());
        course.setCourseName(courseDetails.getCourseName());
        course.setCourseDescription(courseDetails.getCourseDescription());
        course.setCredits(courseDetails.getCredits());
        course.setDepartment(courseDetails.getDepartment());
        course.setInstructorName(courseDetails.getInstructorName());
        course.setMaxStudents(courseDetails.getMaxStudents());
        course.setSemester(courseDetails.getSemester());
        course.setIsActive(courseDetails.getIsActive());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    @Override
    public Courses activateCourse(Long id) {
        Courses course = getCourseById(id);
        course.setIsActive(true);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @Override
    public Courses deactivateCourse(Long id) {
        Courses course = getCourseById(id);
        course.setIsActive(false);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(Long id) {
        Courses course = getCourseById(id);

        // Check if course has enrollments
        long enrollmentCount = enrollmentRepository.countByCourseCourseId(id);
        if (enrollmentCount > 0) {
            throw new RuntimeException("Cannot delete course with " + enrollmentCount + " enrollments");
        }

        courseRepository.delete(course);
    }

    @Override
    public boolean existsByCourseCode(String courseCode) {
        return courseRepository.existsByCourseCode(courseCode);
    }

    @Override
    public long countEnrollmentsInCourse(Long courseId) {
        getCourseById(courseId); // Verify course exists
        return enrollmentRepository.countByCourseCourseId(courseId);
    }

    @Override
    public boolean hasAvailableSeats(Long courseId) {
        Courses course = getCourseById(courseId);
        long enrollmentCount = enrollmentRepository.countByCourseCourseId(courseId);
        return enrollmentCount < course.getMaxStudents();
    }
}
