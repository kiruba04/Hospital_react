import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Doctorlist.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AppointmentForm from './AppointmentForm';
import "../navbar/navBar.css";

const DoctorList = ({ userId }) => {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('https://hospital-gijl.onrender.com/api/doctor/getdoctor') // Replace with your API endpoint
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
      <div className="container">
        {categories.map((category, index) => (
          <div className="doctor-type" key={index}>
            <h2>{category}</h2>
            <div className="card-area1">
              {doctors.filter(doctor => doctor.category === category).map(doctor => (
                <div className="card1" key={doctor._id}>
                  <img src="https://thumbs.dreamstime.com/z/doctor-icon-logo-white-background-template-vector-97395631.jpg" alt={`Doctor ${doctor.username}`} width="150px" height="150px" />
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
