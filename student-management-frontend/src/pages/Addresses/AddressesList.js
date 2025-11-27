// src/pages/Addresses/AddressesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addressAPI } from '../../services/api';
import '../../styles/Table.css';

function AddressesList() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressAPI.get();
            setAddresses(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await addressAPI.delete(`/${id}`);
                fetchAddresses();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete address');
            }
        }
    };

    if (loading) return <div className="loading">Loading addresses...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Addresses</h1>
                <Link to="/addresses/add" className="btn btn-primary">
                    ➕ Add New Address
                </Link>
            </div>

            {addresses.length === 0 ? (
                <p className="no-data">No addresses found.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Type</th>
                            <th>Street</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Postal Code</th>
                            <th>Country</th>
                            <th>Primary</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {addresses.map((address) => (
                            <tr key={address.addressId}>
                                <td>
                                    {address.student?.firstName} {address.student?.lastName}
                                </td>
                                <td>{address.addressType}</td>
                                <td>{address.streetAddress}</td>
                                <td>{address.city}</td>
                                <td>{address.state}</td>
                                <td>{address.postalCode}</td>
                                <td>{address.country}</td>
                                <td>{address.isPrimary ? '✓' : ''}</td>
                                <td className="actions">
                                    <Link to={`/addresses/edit/${address.addressId}`} className="btn btn-sm btn-edit">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(address.addressId)}
                                        className="btn btn-sm btn-delete"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AddressesList;