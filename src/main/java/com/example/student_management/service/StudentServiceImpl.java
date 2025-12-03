package com.example.student_management.service;

import com.example.student_management.enums.StudentStatus;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.model.Student;
import com.example.student_management.repository.DepartmentRepository;
import com.example.student_management.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public StudentServiceImpl(StudentRepository studentRepository,
                              DepartmentRepository departmentRepository) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public Student createStudent(Student student)
    {
        if(studentRepository.existsByStudentNumber(student.getStudentNumber()))
        {
            throw new RuntimeException("Student number already exists" + student.getStudentNumber());
        }
        if(studentRepository.existsByEmail(student.getEmail()))
        {
            throw new RuntimeException("Email already exists" + student.getEmail());
        }
        if (student.getDepartment() != null && student.getDepartment().getDepartmentId() != null) {
            var department = departmentRepository.findById(student.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + student.getDepartment().getDepartmentId()));
            student.setDepartment(department);  // ✅ FIX: Actually set the fetched department
        }

        // Set default values
        if (student.getStudentStatus() == null) {
            student.setStudentStatus(StudentStatus.Active);
        }

        // Set timestamps
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public Student getStudentByStudentNumber(String studentNumber) {
        return studentRepository.findByStudentNumber(studentNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with student number: " + studentNumber));
    }

    @Override
    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
    }

    @Override
    public List<Student> getStudentsByDepartment(Long departmentId) {
        // Verify department exists
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));

        return studentRepository.findByDepartmentDepartmentId(departmentId);
    }

    @Override
    public List<Student> getStudentsByStatus(StudentStatus status) {
        return studentRepository.findByStudentStatus(status);
    }

    @Override
    public List<Student> searchStudentsByName(String name) {
        return studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        // Find existing student
        Student student = getStudentById(id);

        // Validation 1: Check if student number is being changed and already exists
        if (!student.getStudentNumber().equals(studentDetails.getStudentNumber()) &&
                studentRepository.existsByStudentNumber(studentDetails.getStudentNumber())) {
            throw new RuntimeException("Student number already exists: " + studentDetails.getStudentNumber());
        }

        // Validation 2: Check if email is being changed and already exists
        if (!student.getEmail().equals(studentDetails.getEmail()) &&
                studentRepository.existsByEmail(studentDetails.getEmail())) {
            throw new RuntimeException("Email already exists: " + studentDetails.getEmail());
        }

        // Validation 3: Verify department exists if changed
        if (studentDetails.getDepartment() != null &&
                studentDetails.getDepartment().getDepartmentId() != null) {
            departmentRepository.findById(studentDetails.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + studentDetails.getDepartment().getDepartmentId()));
        }

        // Update fields
        student.setStudentNumber(studentDetails.getStudentNumber());
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setGender(studentDetails.getGender());
        student.setDepartment(studentDetails.getDepartment());
        student.setEnrollmentDate(studentDetails.getEnrollmentDate());
        student.setStudentStatus(studentDetails.getStudentStatus());
        student.setGpa(studentDetails.getGpa());
        student.setUpdatedAt(LocalDateTime.now());

        // Save and return
        return studentRepository.save(student);

    }
    @Override
    public Student updateStudentStatus(Long id, StudentStatus status) {
        Student student = getStudentById(id);
        student.setStudentStatus(status);
        student.setUpdatedAt(LocalDateTime.now());
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    @Override
    public boolean existsByStudentNumber(String studentNumber)
    {
        return studentRepository.existsByStudentNumber(studentNumber);
    }

    @Override
    public boolean existsByEmail(String email)
    {
        return studentRepository.existsByEmail(email);
    }

    @Override
    public long countStudentsByDepartment(Long departmentId)
    {
        return studentRepository.countByDepartmentDepartmentId(departmentId);
    }

    @Override
    public List<Student> getStudentsWithMinGpa(Double minGpa)
    {
        return studentRepository.findStudentsWithMinGpa(minGpa);
    }
    @Override
    public List<Student> searchStudents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return studentRepository.findAll();
        }
        return studentRepository.searchStudents(keyword.trim());
    }

    @Override
    public List<Student> filterStudents(StudentStatus status, Long departmentId, BigDecimal minGpa) {
        return studentRepository.filterStudents(status, departmentId, minGpa);
    }

}
