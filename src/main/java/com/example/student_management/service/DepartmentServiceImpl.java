package com.example.student_management.service;

import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.model.Department;
import com.example.student_management.repository.CourseRepository;
import com.example.student_management.repository.DepartmentRepository;
import com.example.student_management.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public Department createDepartment(Department department)
    {
        if (departmentRepository.existsByDepartmentCode(department.getDepartmentCode())) {
            throw new RuntimeException("Department code already exists: " + department.getDepartmentCode());
        }

        // Set timestamps
        department.setCreatedAt(LocalDateTime.now());
        department.setUpdatedAt(LocalDateTime.now());
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments()
    {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    @Override
    public Department getDepartmentByCode(String code) {
        return departmentRepository.findByDepartmentCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with code: " + code));
    }

    @Override
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = getDepartmentById(id);

        // Check if code is being changed and already exists
        if (!department.getDepartmentCode().equals(departmentDetails.getDepartmentCode()) &&
                departmentRepository.existsByDepartmentCode(departmentDetails.getDepartmentCode())) {
            throw new RuntimeException("Department code already exists: " + departmentDetails.getDepartmentCode());
        }

        // Update fields
        department.setDepartmentCode(departmentDetails.getDepartmentCode());
        department.setDepartmentName(departmentDetails.getDepartmentName());
        department.setHeadOfDepartment(departmentDetails.getHeadOfDepartment());
        department.setEmail(departmentDetails.getEmail());
        department.setPhone(departmentDetails.getPhone());
        department.setBuilding(departmentDetails.getBuilding());
        department.setEstablishedYear(departmentDetails.getEstablishedYear());
        department.setUpdatedAt(LocalDateTime.now());

        return departmentRepository.save(department);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);

        // Check if department has students
        long studentCount = studentRepository.countByDepartmentDepartmentId(id);
        if (studentCount > 0) {
            throw new RuntimeException("Cannot delete department with " + studentCount + " students");
        }

        // Check if department has courses
        long courseCount = courseRepository.countByDepartmentDepartmentId(id);
        if (courseCount > 0) {
            throw new RuntimeException("Cannot delete department with " + courseCount + " courses");
        }

        departmentRepository.delete(department);
    }

    @Override
    public boolean existsByCode(String code)
    {
        return departmentRepository.existsByDepartmentCode(code);
    }

    @Override
    public long countStudentsInDepartment(Long departmentId)
    {
        getDepartmentById(departmentId);
        return studentRepository.countByDepartmentDepartmentId(departmentId);
    }

    @Override
    public long countCoursesInDepartment(Long departmentId)
    {
        getDepartmentById(departmentId);
        return courseRepository.countByDepartmentDepartmentId(departmentId);
    }



}
