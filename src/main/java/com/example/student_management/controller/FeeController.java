package com.example.student_management.controller;

import com.example.student_management.enums.PaymentStatus;
import com.example.student_management.model.Fee;
import com.example.student_management.service.FeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @PostMapping
    public ResponseEntity<Fee> createFee(@RequestBody Fee fee) {
        Fee created = feeService.createFee(fee);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable Long id) {
        Fee fee = feeService.getFeeById(id);
        return ResponseEntity.ok(fee);
    }

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        List<Fee> fees = feeService.getAllFees();
        return ResponseEntity.ok(fees);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        Fee updated = feeService.updateFee(id, fee);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<Fee>> getFeesByStatus(@PathVariable PaymentStatus paymentStatus) {
        List<Fee> fees = feeService.getFeesByStatus(paymentStatus);
        return ResponseEntity.ok(fees);
    }
}
