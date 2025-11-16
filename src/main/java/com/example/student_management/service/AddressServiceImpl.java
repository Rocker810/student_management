package com.example.student_management.service;

import com.example.student_management.enums.AddressType;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.model.Address;
import com.example.student_management.repository.AddressRepository;
import com.example.student_management.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {
    private final AddressRepository addressRepository;
    private final StudentRepository studentRepository;

    public AddressServiceImpl(AddressRepository addressRepository, StudentRepository studentRepository) {
        this.addressRepository = addressRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public Address createAddress(Address address) {
        // Verify student exists
        if (address.getStudent() != null && address.getStudent().getStudentId() != null) {
            studentRepository.findById(address.getStudent().getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + address.getStudent().getStudentId()));
        }

        // If this is primary, unset other primary addresses for this student
        if (address.getIsPrimary() != null && address.getIsPrimary()) {
            List<Address> existingAddresses = addressRepository
                    .findByStudentStudentId(address.getStudent().getStudentId());
            for (Address existing : existingAddresses) {
                if (existing.getIsPrimary()) {
                    existing.setIsPrimary(false);
                    addressRepository.save(existing);
                }
            }
        }

        // Set timestamps
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());

        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Override
    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));
    }

    @Override
    public List<Address> getAddressesByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return addressRepository.findByStudentStudentId(studentId);
    }

    @Override
    public List<Address> getAddressesByStudentAndType(Long studentId, AddressType type) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return addressRepository.findByStudentStudentIdAndAddressType(studentId, type);
    }

    @Override
    public Address getPrimaryAddressByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return addressRepository.findByStudentStudentIdAndIsPrimaryTrue(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No primary address found for student id: " + studentId));
    }

    @Override
    public Address updateAddress(Long id, Address addressDetails) {
        Address address = getAddressById(id);

        // If setting as primary, unset other primary addresses
        if (addressDetails.getIsPrimary() != null && addressDetails.getIsPrimary() &&
                !address.getIsPrimary()) {
            List<Address> existingAddresses = addressRepository.findByStudentStudentId(address.getStudent().getStudentId());
            for (Address existing : existingAddresses) {
                if (existing.getIsPrimary() && !existing.getAddressId().equals(id)) {
                    existing.setIsPrimary(false);
                    addressRepository.save(existing);
                }
            }
        }

        // Update fields
        address.setAddressType(addressDetails.getAddressType());
        address.setStreetAddress(addressDetails.getStreetAddress());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setPostalCode(addressDetails.getPostalCode());
        address.setCountry(addressDetails.getCountry());
        address.setIsPrimary(addressDetails.getIsPrimary());
        address.setUpdatedAt(LocalDateTime.now());

        return addressRepository.save(address);
    }

    @Override
    public Address setPrimaryAddress(Long addressId, Long studentId) {
        Address address = getAddressById(addressId);

        // Verify address belongs to student
        if (!address.getStudent().getStudentId().equals(studentId)) {
            throw new RuntimeException("Address does not belong to student");
        }

        // Unset other primary addresses
        List<Address> existingAddresses = addressRepository.findByStudentStudentId(studentId);
        for (Address existing : existingAddresses) {
            if (existing.getIsPrimary()) {
                existing.setIsPrimary(false);
                addressRepository.save(existing);
            }
        }

        // Set this as primary
        address.setIsPrimary(true);
        address.setUpdatedAt(LocalDateTime.now());

        return addressRepository.save(address);
    }

    @Override
    public void deleteAddress(Long id) {
        Address address = getAddressById(id);
        addressRepository.delete(address);
    }

    @Override
    public void deleteAllAddressesByStudent(Long studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        addressRepository.deleteByStudentStudentId(studentId);
    }

}
