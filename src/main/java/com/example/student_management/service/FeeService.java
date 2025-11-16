package com.example.student_management.service;

import com.example.student_management.enums.FeeType;
import com.example.student_management.enums.PaymentStatus;
import com.example.student_management.model.Fee;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface FeeService {

    // Create
    Fee createFee(Fee fee);
    Fee createFeeForStudent(Long studentId, String semester, FeeType feeType,
                            BigDecimal amount, LocalDate dueDate);

    // Read
    List<Fee> getAllFees();
    Fee getFeeById(Long id);
    List<Fee> getFeesByStudent(Long studentId);
    List<Fee> getFeesBySemester(String semester);
    List<Fee> getFeesByStudentAndSemester(Long studentId, String semester);
    List<Fee> getFeesByStatus(PaymentStatus status);
    List<Fee> getPendingFeesByStudent(Long studentId);
    List<Fee> getOverdueFees();

    // Update
    Fee updateFee(Long id, Fee fee);
    Fee updatePaymentStatus(Long id, PaymentStatus status);
    Fee makePayment(Long id, BigDecimal paymentAmount, String paymentMethod, String transactionId);
    Fee makeFullPayment(Long id, String paymentMethod, String transactionId);

    // Delete
    void deleteFee(Long id);
    void deleteAllFeesByStudent(Long studentId);

    // Statistics & Calculations
    BigDecimal calculateTotalFees(Long studentId);
    BigDecimal calculateTotalPaid(Long studentId);
    BigDecimal calculateOutstandingBalance(Long studentId);
    long countPendingFees(Long studentId);
    List<Fee> getFeesSummaryByStudent(Long studentId);
}
