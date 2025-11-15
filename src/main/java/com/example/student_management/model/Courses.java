package com.example.student_management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Courses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;

    @NotBlank(message = "Course code is required")
    @Column(name = "course_code", nullable = false,unique = true)
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Column(name = "course_name",nullable = false)
    private String courseName;

    @Column(name = "course_description", columnDefinition = "TEXT")
    private String courseDescription;

    @NotNull(message = "Credits are required")
    @Column(name = "credits", nullable = false)
    private Integer credits;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "instructor_name")
    private String instructorName;

    @Column(name = "max_students")
    private Integer maxStudents = 50;

    @Column(name = "semester")
    private String semester;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


}
