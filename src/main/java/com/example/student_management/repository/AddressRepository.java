package com.example.student_management.repository;

import com.example.student_management.enums.AddressType;
import com.example.student_management.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByStudentStudentId(Long studentId);

    // Find addresses by type (Permanent or Current)
    List<Address> findByStudentStudentIdAndAddressType(Long studentId, AddressType addressType);

    // Find primary address for a student
    Optional<Address> findByStudentStudentIdAndIsPrimaryTrue(Long studentId);

    // Find addresses by city
    List<Address> findByCity(String city);

    // Find addresses by state
    List<Address> findByState(String state);

    // Delete all addresses for a student
    void deleteByStudentStudentId(Long studentId);
}
