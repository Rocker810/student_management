package com.example.student_management.service;

import com.example.student_management.enums.AddressType;
import com.example.student_management.model.Address;

import java.util.List;

public interface AddressService {
    // Create
    Address createAddress(Address address);

    // Read
    List<Address> getAllAddresses();
    Address getAddressById(Long id);
    List<Address> getAddressesByStudent(Long studentId);
    List<Address> getAddressesByStudentAndType(Long studentId, AddressType type);
    Address getPrimaryAddressByStudent(Long studentId);

    // Update
    Address updateAddress(Long id, Address address);
    Address setPrimaryAddress(Long addressId, Long studentId);

    // Delete
    void deleteAddress(Long id);
    void deleteAllAddressesByStudent(Long studentId);
}
