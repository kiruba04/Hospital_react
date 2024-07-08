import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import axios from 'axios';
import "./Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faTicket, faUser, faCalendarDay, faCalendarDays, faClock } from '@fortawesome/free-solid-svg-icons';

const UserInformation = () => {
  const [view, setView] = useState('profile');
  const [user, setUser] = useState({
    username: '',
    lastname: '',
    dateOfBirth: null,
    gender: '',
    email: '',
    phone: '',
    address: '',
    bloodType: ''
  });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        ...storedUser,
        dateOfBirth: storedUser.dateOfBirth ? new Date(storedUser.dateOfBirth).toISOString().split('T')[0] : ''
      });
      fetchAppointments(storedUser._id);
    }
  }, []);

  const fetchAppointments = async (userId) => {
    try {
      const response = await axios.get(`https://hospitalerp-node.onrender.com/api/appointments/${userId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleDateChange = (e) => {
    setUser({ ...user, dateOfBirth: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://hospitalerp-node.onrender.com/api/user/${user._id}`, user, {
        withCredentials: true  // Ensure cookies are sent
      });
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        alert('User information saved successfully!');
      } else {
        alert('Failed to save user information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user information', error);
      alert('An error occurred while saving user information. Please try again.');
    }
  };

  const categorizeAppointments = (appointments) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayAppointments = [];
    const pastAppointments = [];
    const futureAppointments = [];

    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date).setHours(0, 0, 0, 0);

      if (appointmentDate === today) {
        todayAppointments.push(appointment);
      } else if (appointmentDate < today) {
        pastAppointments.push(appointment);
      } else {
        futureAppointments.push(appointment);
      }
    });

    return { todayAppointments, pastAppointments, futureAppointments };
  };

  const deleteappointment = async (appointmentId) => {
    try {
      await axios.delete(`https://hospitalerp-node.onrender.com/api/appointment/delete/${appointmentId}`);
      setAppointments(appointments.filter(app => app._id !== appointmentId));
    } catch (err) {
      console.log(err);
    }
  };

  const { todayAppointments, pastAppointments, futureAppointments } = categorizeAppointments(appointments);
 
  const renderAppointmentCard = (appointment) => {
    const appointmentDate = new Date(appointment.date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    const isCancelable = appointmentDate >= today;
    

    return (
      <div className="patient-card" key={appointment._id}>
        <h2>Appointment Details</h2>
        <div className="detail"><FontAwesomeIcon icon={faUserDoctor} /><strong>Doctor Name:</strong> <span>{appointment.doctorid.username}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faClock} /><strong>Available Time:</strong> <span>{appointment.time}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Date:</strong> <span>{new Date(appointment.date).toLocaleDateString()}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faCalendarDay} /><strong>Day:</strong> <span>{appointment.day}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faUser} /><strong>Username:</strong> <span>{user.username}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faTicket} /><strong>Token Number:</strong> <span>{appointment.tokennumber}</span></div>
        {isCancelable && (
          <div className='detail d-flex justify-content-center'>
            <Button variant='outline-danger' onClick={() => deleteappointment(appointment._id)}>Cancel</Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={2}>
          <Nav className="flex-column">
            <Nav.Link active={view === 'profile'} onClick={() => setView('profile')} className="text-success sidenavfont">Profile</Nav.Link>
            <Nav.Link active={view === 'appointments'} onClick={() => setView('appointments')} className="text-success sidenavfont">Appointments</Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          {view === 'profile' && (
            <div>
              <h2 className='subhead'>General information</h2>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your first name"
                      name="firstName"
                      value={user.username}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Also your last name"
                      name="lastName"
                      value={user.lastname}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formBirthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={user.dateOfBirth}
                      onChange={handleDateChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      value={user.gender}
                      onChange={handleChange}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Control>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@company.com"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+12-345 678 910"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your home address"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formBloodType">
                    <Form.Label>Blood Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="bloodType"
                      value={user.bloodType}
                      onChange={handleChange}
                    >
                      <option value="">Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Form.Control>
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
              <h2 className='subhead'>Appointments</h2>
              <h3 className='subhead'>Today's Appointments</h3>
              {todayAppointments.length === 0 ? (
                <p>No appointments for today.</p>
              ) : (
                <Row>
                  {todayAppointments.map(renderAppointmentCard)}
                </Row>
              )}

              
             <h3 className='subhead'>Future Appointments</h3>
              {futureAppointments.length === 0 ? (
                <p>No future appointments found.</p>
              ) : (
                <Row>
                  {futureAppointments.map(renderAppointmentCard)}
                </Row>
              )}

              <h3 className='subhead'>Past Appointments</h3>
              {pastAppointments.length === 0 ? (
                <p>No past appointments found.</p>
              ) : (
                <Row>
                  {pastAppointments.map(renderAppointmentCard)}
                </Row>
              )}

            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserInformation;
