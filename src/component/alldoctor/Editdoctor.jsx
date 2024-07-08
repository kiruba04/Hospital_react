import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import "../navbar/navBar.css";

function AddDoctor({ show, onHide, doctor, onSave }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState({
    Monday: { available: false, startTime: '', endTime: '', token: '' },
    Tuesday: { available: false, startTime: '', endTime: '', token: '' },
    Wednesday: { available: false, startTime: '', endTime: '', token: '' },
    Thursday: { available: false, startTime: '', endTime: '', token: '' },
    Friday: { available: false, startTime: '', endTime: '', token: '' },
    Saturday: { available: false, startTime: '', endTime: '', token: '' },
    Sunday: { available: false, startTime: '', endTime: '', token: '' },
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (doctor) {
      setUsername(doctor.username);
      setDateOfBirth(doctor.dateofbirth ? new Date(doctor.dateofbirth).toISOString().split('T')[0] : '');
      setEmail(doctor.email);
      setPhone(doctor.phone);
      setCategory(doctor.category);
      setAvailability(doctor.availableAppointments.reduce((acc, appointment) => {
        acc[appointment.Day] = {
          available: appointment.available,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          token: appointment.availaableslots
        };
        return acc;
      }, {}));
    } else {
      resetForm();
    }
  }, [doctor]);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setDateOfBirth('');
    setEmail('');
    setPhone('');
    setCategory('');
    setAvailability({
      Monday: { available: false, startTime: '', endTime: '', token: '' },
      Tuesday: { available: false, startTime: '', endTime: '', token: '' },
      Wednesday: { available: false, startTime: '', endTime: '', token: '' },
      Thursday: { available: false, startTime: '', endTime: '', token: '' },
      Friday: { available: false, startTime: '', endTime: '', token: '' },
      Saturday: { available: false, startTime: '', endTime: '', token: '' },
      Sunday: { available: false, startTime: '', endTime: '', token: '' },
    });
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedDoctor = {
      _id: doctor._id,
      username: username,
      password: password,
      dateofbirth: dateOfBirth,
      email: email,
      phone: phone,
      category: category,
      availableAppointments: Object.entries(availability).map(([day, details]) => ({
        Day: day,
        available: details.available,
        startTime: details.startTime,
        endTime: details.endTime,
        availaableslots: details.token,
      })),
    };

    try {
      const response = await axios.put(`https://hospitalerp-node.onrender.com/api/doctor/update-doctor/${doctor._id}`, updatedDoctor, {
        withCredentials: true
      });
      console.log(response.data);
      onSave(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
        setError('Email is already registered. Please use a different email.');
      } else {
        setError('Update failed. Please try again.');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const renderAvailabilityFields = (day) => (
    <div key={day}>
      <Form.Group className="mb-3">
        <Form.Label>{day}</Form.Label>
        <Form.Check
          type="checkbox"
          label="Available"
          checked={availability[day].available}
          onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
        />
        {availability[day].available && (
          <>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={availability[day].startTime}
              onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
              required
            />
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={availability[day].endTime}
              onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
              required
            />
            <Form.Label>Available Slots</Form.Label>
            <Form.Control
              type="number"
              value={availability[day].token}
              onChange={(e) => handleAvailabilityChange(day, 'token', e.target.value)}
              required
            />
          </>
        )}
      </Form.Group>
    </div>
  );

  return (
    <div className='custom-modal'>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        className="custom-modal-content"
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title id="contained-modal-title-vcenter" className="text-center w-100">
            {doctor ? 'Edit Doctor' : 'Register Doctor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            {!doctor && (
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <div className="password-field">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button variant="outline-secondary" onClick={toggleShowPassword}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="dateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select specialization...</option>
                <option value="Skincare">Skin care</option>
                <option value="Bone care">Bone care</option>
                <option value="Child care">Child care</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Appointments</Form.Label>
              {Object.keys(availability).map(day => renderAvailabilityFields(day))}
            </Form.Group>

            <div className="text-center">
              <Button variant="success" type="submit">
                {doctor ? 'Update' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddDoctor;
