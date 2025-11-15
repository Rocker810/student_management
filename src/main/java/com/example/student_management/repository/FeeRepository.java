package com.example.student_management.repository;

import com.example.student_management.enums.FeeType;
import com.example.student_management.enums.PaymentStatus;
import com.example.student_management.model.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    // Find all fees for a student
    List<Fee> findByStudentStudentId(Long studentId);

    // Find fees by semester
    List<Fee> findBySemester(String semester);

    // Find fees by student and semester
    List<Fee> findByStudentStudentIdAndSemester(Long studentId, String semester);

    // Find fees by payment status
    List<Fee> findByPaymentStatus(PaymentStatus status);

    // Find fees by fee type
    List<Fee> findByFeeType(FeeType feeType);

    // Find pending fees for a student
    List<Fee> findByStudentStudentIdAndPaymentStatus(Long studentId, PaymentStatus status);

    // Find overdue fees (due date passed and not fully paid)
    @Query("SELECT f FROM Fee f WHERE f.dueDate < :currentDate " +
            "AND (f.paymentStatus = com.example.student_management.enums.PaymentStatus.Pending " +
            "OR f.paymentStatus = com.example.student_management.enums.PaymentStatus.Partial)")
    List<Fee> findOverdueFees(@Param("currentDate") LocalDate currentDate);

    // Custom query: Total fees for a student
    @Query("SELECT SUM(f.amount) FROM Fee f WHERE f.student.studentId = :studentId")
    BigDecimal calculateTotalFeesByStudent(@Param("studentId") Long studentId);

    // Custom query: Total paid amount for a student
    @Query("SELECT SUM(f.paidAmount) FROM Fee f WHERE f.student.studentId = :studentId")
    BigDecimal calculateTotalPaidByStudent(@Param("studentId") Long studentId);

    // Custom query: Outstanding balance for a student
    @Query("SELECT SUM(f.amount - f.paidAmount) FROM Fee f WHERE f.student.studentId = :studentId " +
            "AND (f.paymentStatus = com.example.student_management.enums.PaymentStatus.Pending " +
            "OR f.paymentStatus = com.example.student_management.enums.PaymentStatus.Partial)")
    BigDecimal calculateOutstandingBalance(@Param("studentId") Long studentId);

    // Count pending fees for a student
    long countByStudentStudentIdAndPaymentStatus(Long studentId, PaymentStatus status);

    // Delete all fees for a student
    void deleteByStudentStudentId(Long studentId);
}
