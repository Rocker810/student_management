package com.example.student_management.controller;

import com.example.student_management.enums.EnrollmentStatus;
import com.example.student_management.model.Enrollments;
import com.example.student_management.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<Enrollments> createEnrollment(@RequestBody Enrollments enrollment) {
        Enrollments created = enrollmentService.createEnrollment(enrollment);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollments> getEnrollmentById(@PathVariable Long id) {
        Enrollments enrollment = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping
    public ResponseEntity<List<Enrollments>> getAllEnrollments() {
        List<Enrollments> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enrollments> updateEnrollment(@PathVariable Long id, @RequestBody Enrollments enrollment) {
        Enrollments updated = enrollmentService.updateEnrollment(id, enrollment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollments>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        List<Enrollments> enrollments = enrollmentService.getEnrollmentsByStudent(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollments>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        List<Enrollments> enrollments = enrollmentService.getEnrollmentsByCourse(courseId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Enrollments>> getEnrollmentsByStatus(@PathVariable EnrollmentStatus status) {
        List<Enrollments> enrollments = enrollmentService.getEnrollmentsByStatus(status);
        return ResponseEntity.ok(enrollments);
    }
}