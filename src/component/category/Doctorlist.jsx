import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Doctorlist.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AppointmentForm from './AppointmentForm';
import "../navbar/navBar.css";
import Alert from 'react-bootstrap/Alert';

const DoctorList = ({ userId }) => {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8800/api/doctor/getdoctor') // Replace with your API endpoint
      .then(response => {
        setDoctors(response.data);
        const categories = [...new Set(response.data.map(doctor => doctor.category))];
        setCategories(categories);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const handleAppointmentClick = (doctorId) => {
    setSelectedDoctor(doctorId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className='aligntop'>
<Alert variant="info" className="note">
  <strong>Note:</strong>
  <ul>
    <li>Patients will be given an appointment on a first-come, first-served basis.</li>
    <li>Appointments may be canceled by the doctor due to unforeseen emergency conditions.</li>
    <li>Appointment status must be checked by logging into the application.</li>
  </ul>
</Alert>


      <div className="container">
        {categories.map((category, index) => (
          <div className="doctor-type" key={index}>
            <h2>{category}</h2>
            <div className="card-area1">
              {doctors.filter(doctor => doctor.category === category).map(doctor => (
                <div className="card1" key={doctor._id}>
                  <img src={doctor.imageUrl || "https://static.vecteezy.com/system/resources/previews/000/421/716/original/vector-doctor-icon.jpg"} alt={`Doctor ${doctor.username}`} className="image-preview" />
                  <div className="card-content1">
                    <h3>Dr. {doctor.username}</h3>
                    <p><strong>Designation:</strong> MBBS</p>
                    <Button variant="outline-success" className="Reserve" onClick={() => handleAppointmentClick(doctor._id)}>Appointment</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Modal show={showModal} onHide={handleModalClose} centered
          className="custom-modal-content"
          dialogClassName="custom-modal-dialog">
          <Modal.Header closeButton>
            <Modal.Title>Book Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDoctor && <AppointmentForm doctorId={selectedDoctor} userId={userId} onHide={handleModalClose} />}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

DoctorList.propTypes = {
  userId: PropTypes.string
};

DoctorList.defaultProps = {
  userId: null
};

export default DoctorList;
