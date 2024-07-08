import React, { useEffect, useState } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import "./alldoctor.css"
import Editdoctor from './Editdoctor'; // Adjust the import path as needed

const AllDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('https://hospital-gijl.onrender.com/api/doctor/getdoctor') // Replace with your API endpoint
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleSave = (updatedDoctor) => {
    setDoctors(doctors.map(doc => (doc._id === updatedDoctor._id ? updatedDoctor : doc)));
    handleCloseModal();
  };

  return (
    <>
      <div className="tableplacement">
        <Table striped bordered hover size="sm">
          <thead>
            <tr className="text-center">
              <th>No</th>
              <th>Username</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Category</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor._id}>
                <td>{index + 1}</td>
                <td>{doctor.username}</td>
                <td>{new Date(doctor.dateofbirth).toLocaleDateString()}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.category}</td>
                <td className="text-center">
                  <Button variant="outline-success" onClick={() => handleEditClick(doctor)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Editdoctor
        show={showModal}
        onHide={handleCloseModal}
        doctor={selectedDoctor}
        onSave={handleSave}
      />
    </>
  );
};

export default AllDoctor;
