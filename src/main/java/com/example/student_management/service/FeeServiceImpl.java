package com.example.student_management.service;

import com.example.student_management.model.Fee;
import com.example.student_management.model.Student;
import com.example.student_management.enums.FeeType;
import com.example.student_management.enums.PaymentStatus;
import com.example.student_management.enums.PaymentMethod;
import com.example.student_management.repository.FeeRepository;
import com.example.student_management.repository.StudentRepository;
import com.example.student_management.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FeeServiceImpl implements FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    // Constructor injection
    public FeeServiceImpl(FeeRepository feeRepository,
                          StudentRepository studentRepository) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
    }


    @Override
    public Fee createFee(Fee fee) {
        // Validate student exists AND set it
        if (fee.getStudent() != null && fee.getStudent().getStudentId() != null) {
            var student = studentRepository.findById(fee.getStudent().getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + fee.getStudent().getStudentId()));
            fee.setStudent(student);  // ✅ Set the fetched student
        }

        // Set default values
        if (fee.getPaidAmount() == null) {
            fee.setPaidAmount(BigDecimal.ZERO);
        }
        if (fee.getPaymentStatus() == null) {
            fee.setPaymentStatus(PaymentStatus.Pending);
        }

        // Set timestamps
        fee.setCreatedAt(LocalDateTime.now());
        fee.setUpdatedAt(LocalDateTime.now());

        return feeRepository.save(fee);
    }

    @Override
    public Fee createFeeForStudent(Long studentId, String semester, FeeType feeType,
                                   BigDecimal amount, LocalDate dueDate) {
        // Verify student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Create fee
        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setSemester(semester);
        fee.setFeeType(feeType);
        fee.setAmount(amount);
        fee.setPaidAmount(BigDecimal.ZERO);
        fee.setDueDate(dueDate);
        fee.setPaymentStatus(PaymentStatus.Pending);
        fee.setCreatedAt(LocalDateTime.now());
        fee.setUpdatedAt(LocalDateTime.now());

        return feeRepository.save(fee);
    }

    @Override
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @Override
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee not found with id: " + id));
    }

    @Override
    public List<Fee> getFeesByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return feeRepository.findByStudentStudentId(studentId);
    }

    @Override
    public List<Fee> getFeesBySemester(String semester) {
        return feeRepository.findBySemester(semester);
    }

    @Override
    public List<Fee> getFeesByStudentAndSemester(Long studentId, String semester) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return feeRepository.findByStudentStudentIdAndSemester(studentId, semester);
    }

    @Override
    public List<Fee> getFeesByStatus(PaymentStatus status) {
        return feeRepository.findByPaymentStatus(status);
    }

    @Override
    public List<Fee> getPendingFeesByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return feeRepository.findByStudentStudentIdAndPaymentStatus(studentId, PaymentStatus.Pending);
    }

    @Override
    public List<Fee> getOverdueFees() {
        return feeRepository.findOverdueFees(LocalDate.now());
    }

    @Override
    public Fee updateFee(Long id, Fee feeDetails) {
        Fee fee = getFeeById(id);

        // Verify student exists if changed AND set it
        if (feeDetails.getStudent() != null && feeDetails.getStudent().getStudentId() != null) {
            var student = studentRepository.findById(feeDetails.getStudent().getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + feeDetails.getStudent().getStudentId()));
            feeDetails.setStudent(student);
        }

        // ✅ FIX: Update ALL fields including payment status and payment date
        fee.setStudent(feeDetails.getStudent());
        fee.setSemester(feeDetails.getSemester());
        fee.setFeeType(feeDetails.getFeeType());
        fee.setAmount(feeDetails.getAmount());
        fee.setPaidAmount(feeDetails.getPaidAmount());
        fee.setDueDate(feeDetails.getDueDate());
        fee.setPaymentDate(feeDetails.getPaymentDate());  // ✅ Now updates payment date
        fee.setPaymentStatus(feeDetails.getPaymentStatus());  // ✅ Now updates payment status
        fee.setPaymentMethod(feeDetails.getPaymentMethod());  // ✅ Now updates payment method
        fee.setTransactionId(feeDetails.getTransactionId());  // ✅ Now updates transaction ID
        fee.setUpdatedAt(LocalDateTime.now());

        return feeRepository.save(fee);
    }

    @Override
    public Fee updatePaymentStatus(Long id, PaymentStatus status) {
        Fee fee = getFeeById(id);
        fee.setPaymentStatus(status);
        fee.setUpdatedAt(LocalDateTime.now());
        return feeRepository.save(fee);
    }

    @Override
    public Fee makePayment(Long id, BigDecimal paymentAmount, String paymentMethod,
                           String transactionId) {
        Fee fee = getFeeById(id);

        // Validate payment amount
        if (paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero");
        }

        // Calculate new paid amount
        BigDecimal newPaidAmount = fee.getPaidAmount().add(paymentAmount);

        // Validate payment doesn't exceed total amount
        if (newPaidAmount.compareTo(fee.getAmount()) > 0) {
            throw new RuntimeException("Payment amount exceeds outstanding balance");
        }

        // Update fee
        fee.setPaidAmount(newPaidAmount);
        fee.setPaymentDate(LocalDate.now());

        // Convert String to PaymentMethod enum
        if (paymentMethod != null) {
            try {
                fee.setPaymentMethod(PaymentMethod.valueOf(paymentMethod));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid payment method: " + paymentMethod);
            }
        }

        fee.setTransactionId(transactionId);

        // Update payment status
        if (newPaidAmount.compareTo(fee.getAmount()) == 0) {
            fee.setPaymentStatus(PaymentStatus.Paid);
        } else {
            fee.setPaymentStatus(PaymentStatus.Partial);
        }

        fee.setUpdatedAt(LocalDateTime.now());

        return feeRepository.save(fee);
    }

    @Override
    public Fee makeFullPayment(Long id, String paymentMethod, String transactionId) {
        Fee fee = getFeeById(id);

        // Calculate outstanding balance
        BigDecimal outstandingBalance = fee.getAmount().subtract(fee.getPaidAmount());

        if (outstandingBalance.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Fee is already fully paid");
        }

        // Make full payment
        fee.setPaidAmount(fee.getAmount());
        fee.setPaymentDate(LocalDate.now());

        // Convert String to PaymentMethod enum
        if (paymentMethod != null) {
            try {
                fee.setPaymentMethod(PaymentMethod.valueOf(paymentMethod));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid payment method: " + paymentMethod);
            }
        }

        fee.setTransactionId(transactionId);
        fee.setPaymentStatus(PaymentStatus.Paid);
        fee.setUpdatedAt(LocalDateTime.now());

        return feeRepository.save(fee);
    }

    @Override
    public void deleteFee(Long id) {
        Fee fee = getFeeById(id);
        feeRepository.delete(fee);
    }

    @Override
    public void deleteAllFeesByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        feeRepository.deleteByStudentStudentId(studentId);
    }

    // ==================== STATISTICS ====================

    @Override
    public BigDecimal calculateTotalFees(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        BigDecimal total = feeRepository.calculateTotalFeesByStudent(studentId);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal calculateTotalPaid(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        BigDecimal totalPaid = feeRepository.calculateTotalPaidByStudent(studentId);
        return totalPaid != null ? totalPaid : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal calculateOutstandingBalance(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        BigDecimal outstanding = feeRepository.calculateOutstandingBalance(studentId);
        return outstanding != null ? outstanding : BigDecimal.ZERO;
    }

    @Override
    public long countPendingFees(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return feeRepository.countByStudentStudentIdAndPaymentStatus(studentId, PaymentStatus.Pending);
    }

    @Override
    public List<Fee> getFeesSummaryByStudent(Long studentId) {
        return getFeesByStudent(studentId);
    }
}