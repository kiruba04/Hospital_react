import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import axios from 'axios';
import "../profile/Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarDays, faCalendarDay,faUser,faTicket,faVenusMars,faNotesMedical } from '@fortawesome/free-solid-svg-icons';

const DoctorInformation = () => {
  const [view, setView] = useState('profile');
  const [doctor, setDoctor] = useState({
    username: '',
    dateOfBirth: null,
    email: '',
    phone: '',
    category: '',
    availableAppointments: []
  });
  const [todayappointments, setTodayappointments] = useState([]);

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem('user'));
    if (storedDoctor) {
      setDoctor({
        ...storedDoctor,
        dateOfBirth: storedDoctor.dateofbirth ? new Date(storedDoctor.dateofbirth).toISOString().split('T')[0] : ''
      });
      fetchAppointments(storedDoctor._id);
    }
  }, []);
  const fetchAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`https://hospitalerp-node.onrender.com/api/appointments/doctor/${doctorId}`);
      setTodayappointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleDateChange = (e) => {
    setDoctor({ ...doctor, dateOfBirth: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://hospitalerp-node.onrender.com/api/doctor/${doctor._id}`, doctor, {
        withCredentials: true  // Ensure cookies are sent
      });
      if (response.status === 200) {
        localStorage.setItem('doctor', JSON.stringify(response.data));
        alert('Doctor information saved successfully!');
      } else {
        alert('Failed to save doctor information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating doctor information', error);
      alert('An error occurred while saving doctor information. Please try again.');
    }
  };

  const renderAppointmentSlotCard = (slot) => (
    <div className="patient-card" key={slot._id}>
      <h2>Available Slot</h2>
      <div className="detail"><FontAwesomeIcon icon={faCalendarDay} /><strong>Day:</strong> <span>{slot.Day}</span></div>
      <div className="detail"><FontAwesomeIcon icon={faClock} /><strong>Available Time:</strong> <span>{slot.startTime} - {slot.endTime}</span></div>
      <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Available Slots:</strong> <span>{slot.availaableslots}</span></div>
    </div>
  );

  const renderAppointmentCard = (appointment) => (
    <div className="patient-card" key={appointment._id}>
      <h2>Patient Details</h2>
      <div className="detail"><FontAwesomeIcon icon={faUser} /><strong>Patient name:</strong> <span>{appointment.patientname}</span></div>
      <div className='detail'><FontAwesomeIcon icon ={faCalendarDays}/><strong>Patient Age:</strong><span>{appointment.patientage}</span></div>
      <div className="detail"><FontAwesomeIcon icon={faVenusMars} /><strong>Gender:</strong> <span>{appointment.patientgender}</span></div>
      <div className="detail"><FontAwesomeIcon icon={faTicket} /><strong>Token Number:</strong> <span>{appointment.tokennumber}</span></div>
      <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Date:</strong> <span>{new Date(appointment.date).toLocaleDateString()}</span></div>
      <div className="detail"><FontAwesomeIcon icon={faNotesMedical} /><strong>Appointment Reason:</strong> <span>{appointment.symptom}</span></div>  
    </div>
  );

  return (
    <Container className="mt-5">
      <Row>
        <Col md={2}>
          <Nav className="flex-column">
            <Nav.Link active={view === 'profile'} onClick={() => setView('profile')} className="text-success sidenavfont">Profile</Nav.Link>
            <Nav.Link active={view === 'today appointment'} onClick={() => setView('today appointment')} className="text-success sidenavfont">Today's Appointment</Nav.Link>
            <Nav.Link active={view === 'appointments'} onClick={() => setView('appointments')} className="text-success sidenavfont">Appointment Slots</Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          {view === 'profile' && (
            <div>
              <h2 className='subhead'>Doctor Information</h2>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      name="username"
                      value={doctor.username}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      placeholder="Enter your category"
                      name="category"
                      value={doctor.category}
                      onChange={handleChange}
                    >
                        <option value="">Select specialization...</option>
                        <option value="Skincare">Skin care</option>
                        <option value="Bone care">Bone care</option>
                       <option value="Child care">Child care</option>
                    </Form.Control>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={doctor.dateOfBirth}
                      onChange={handleDateChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@company.com"
                      name="email"
                      value={doctor.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+12-345 678 910"
                      name="phone"
                      value={doctor.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                  Save All
                </Button>
              </Form>
            </div>
          )}

          {view === 'appointments' && (
            <div>
              <h2 className='subhead'>Available Appointment Slots</h2>
              <Row>
                {doctor.availableAppointments.map(renderAppointmentSlotCard)}
              </Row>
            </div>
          )}
          {view==='today appointment'&&(
            <div>
            <h3 className='subhead'>Today's Appointments</h3>
            {todayappointments.length === 0 ? (
              <p>No appointments for today.</p>
            ) : (
              <Row>
                {todayappointments.map(renderAppointmentCard)}
              </Row>
            )}
            </div>
          )
        }
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorInformation;
