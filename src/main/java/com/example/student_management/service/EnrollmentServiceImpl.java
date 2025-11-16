package com.example.student_management.service;

import com.example.student_management.enums.EnrollmentStatus;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.model.Courses;
import com.example.student_management.model.Enrollments;
import com.example.student_management.repository.CourseRepository;
import com.example.student_management.repository.EnrollmentRepository;
import com.example.student_management.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    // Constructor injection
    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository,
                                 StudentRepository studentRepository,
                                 CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    // ==================== CREATE ====================

    @Override
    public Enrollments createEnrollment(Enrollments enrollment) {
        // Validate student exists
        if (enrollment.getStudent() != null && enrollment.getStudent().getStudentId() != null) {
            studentRepository.findById(enrollment.getStudent().getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + enrollment.getStudent().getStudentId()));
        }

        // Validate course exists
        if (enrollment.getCourse() != null && enrollment.getCourse().getCourseId() != null) {
            courseRepository.findById(enrollment.getCourse().getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Course not found with id: " + enrollment.getCourse().getCourseId()));
        }

        // Check if student is already enrolled in this course
        if (enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(
                enrollment.getStudent().getStudentId(),
                enrollment.getCourse().getCourseId())) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        // Check if course has available seats
        Courses course = enrollment.getCourse();
        long enrollmentCount = enrollmentRepository.countByCourseCourseId(course.getCourseId());
        if (enrollmentCount >= course.getMaxStudents()) {
            throw new RuntimeException("Course is full. No available seats.");
        }

        // Set default values
        if (enrollment.getEnrollmentDate() == null) {
            enrollment.setEnrollmentDate(LocalDate.now());
        }
        if (enrollment.getStatus() == null) {
            enrollment.setStatus(EnrollmentStatus.Enrolled);
        }

        // Set timestamps
        enrollment.setCreatedAt(LocalDateTime.now());
        enrollment.setUpdatedAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollments enrollStudentInCourse(Long studentId, Long courseId) {
        // Verify student exists
        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Verify course exists
        var course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Check if already enrolled
        if (enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(studentId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        // Check course capacity
        long enrollmentCount = enrollmentRepository.countByCourseCourseId(courseId);
        if (enrollmentCount >= course.getMaxStudents()) {
            throw new RuntimeException("Course is full. No available seats.");
        }

        // Create enrollment
        Enrollments enrollment = new Enrollments();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setStatus(EnrollmentStatus.Enrolled);
        enrollment.setCreatedAt(LocalDateTime.now());
        enrollment.setUpdatedAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }

    // ==================== READ ====================

    @Override
    public List<Enrollments> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @Override
    public Enrollments getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
    }

    @Override
    public List<Enrollments> getEnrollmentsByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return enrollmentRepository.findByStudentStudentId(studentId);
    }

    @Override
    public List<Enrollments> getEnrollmentsByCourse(Long courseId) {
        // Verify course exists
        courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        return enrollmentRepository.findByCourseCourseId(courseId);
    }

    @Override
    public List<Enrollments> getEnrollmentsByStatus(EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status);
    }

    @Override
    public Enrollments getEnrollmentByStudentAndCourse(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentStudentIdAndCourseCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enrollment not found for student " + studentId + " and course " + courseId));
    }

    // ==================== UPDATE ====================

    @Override
    public Enrollments updateEnrollment(Long id, Enrollments enrollmentDetails) {
        Enrollments enrollment = getEnrollmentById(id);

        // Update fields
        if (enrollmentDetails.getGrade() != null) {
            enrollment.setGrade(enrollmentDetails.getGrade());
        }
        if (enrollmentDetails.getGradePoints() != null) {
            enrollment.setGradePoints(enrollmentDetails.getGradePoints());
        }
        if (enrollmentDetails.getAttendancePercentage() != null) {
            enrollment.setAttendancePercentage(enrollmentDetails.getAttendancePercentage());
        }
        if (enrollmentDetails.getStatus() != null) {
            enrollment.setStatus(enrollmentDetails.getStatus());
        }

        enrollment.setUpdatedAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollments updateEnrollmentStatus(Long id, EnrollmentStatus status) {
        Enrollments enrollment = getEnrollmentById(id);
        enrollment.setStatus(status);
        enrollment.setUpdatedAt(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollments updateGrade(Long id, String grade, Double gradePoints) {
        Enrollments enrollment = getEnrollmentById(id);
        enrollment.setGrade(grade);
        enrollment.setGradePoints(gradePoints != null ?
                java.math.BigDecimal.valueOf(gradePoints) : null);
        enrollment.setStatus(EnrollmentStatus.Completed);
        enrollment.setUpdatedAt(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollments updateAttendance(Long id, Double attendancePercentage) {
        Enrollments enrollment = getEnrollmentById(id);
        enrollment.setAttendancePercentage(
                java.math.BigDecimal.valueOf(attendancePercentage));
        enrollment.setUpdatedAt(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    // ==================== DELETE ====================

    @Override
    public void deleteEnrollment(Long id) {
        Enrollments enrollment = getEnrollmentById(id);
        enrollmentRepository.delete(enrollment);
    }

    @Override
    public void withdrawEnrollment(Long id) {
        Enrollments enrollment = getEnrollmentById(id);
        enrollment.setStatus(EnrollmentStatus.Withdrawn);
        enrollment.setUpdatedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
    }

    @Override
    public void deleteAllEnrollmentsByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        enrollmentRepository.deleteByStudentStudentId(studentId);
    }

    // ==================== VALIDATION ====================

    @Override
    public boolean isStudentEnrolledInCourse(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(studentId, courseId);
    }

    @Override
    public boolean canEnrollInCourse(Long studentId, Long courseId) {
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(studentId, courseId)) {
            return false;
        }

        // Check if course is available
        Courses course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        long enrollmentCount = enrollmentRepository.countByCourseCourseId(courseId);
        return enrollmentCount < course.getMaxStudents();
    }

    // ==================== STATISTICS ====================

    @Override
    public long countEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.countByStudentStudentId(studentId);
    }

    @Override
    public long countEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.countByCourseCourseId(courseId);
    }

    @Override
    public List<Enrollments> getCompletedEnrollments(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return enrollmentRepository.findCompletedEnrollmentsByStudent(studentId);
    }

    @Override
    public Double calculateStudentGpa(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Double gpa = enrollmentRepository.calculateAverageGpa(studentId);
        return gpa != null ? gpa : 0.0;
    }
}
