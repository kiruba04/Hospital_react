import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import "../navbar/navBar.css";

function AddDoctor(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availability, setAvailability] = useState({
    Monday: { available: false, startTime: '', endTime: '', token: '' },
    Tuesday: { available: false, startTime: '', endTime: '', token: '' },
    Wednesday: { available: false, startTime: '', endTime: '', token: '' },
    Thursday: { available: false, startTime: '', endTime: '', token: '' },
    Friday: { available: false, startTime: '', endTime: '', token: '' },
    Saturday: { available: false, startTime: '', endTime: '', token: '' },
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setDateOfBirth('');
    setEmail('');
    setPhone('');
    setCategory('');
    setImage(null);
    setImagePreview(null);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let imageUrl = null;
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'zpbashqc');

      try {
        const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dsgdnskfj/image/upload', formData);
        imageUrl = cloudinaryResponse.data.secure_url;
      } catch (error) {
        setError('Image upload failed. Please try again.');
        return;
      }
    }

    const newUser = {
      username: username,
      password: password,
      dateofbirth: dateOfBirth,
      email: email,
      phone: phone,
      category: category,
      imageUrl: imageUrl,
      availableAppointments: Object.entries(availability).map(([day, details]) => ({
        Day: day,
        available: details.available,
        startTime: details.startTime,
        endTime: details.endTime,
        availaableslots: details.token,
      })),
    };

    try {
      const response = await axios.post('https://hospitalerp-node.onrender.com/api/doctor/add-doctor', newUser, {
        withCredentials: true
      });
      console.log(response.data);
      props.onHide();
      resetForm();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
        setError('Email is already registered. Please use a different email.');
      } else {
        setError('Registration failed. Please try again.');
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

  const applyToAll = () => {
    setAvailability(prev => {
      const monday = prev.Monday;
      const newAvailability = Object.keys(prev).reduce((acc, day) => {
        acc[day] = { ...monday };
        return acc;
      }, {});
      return newAvailability;
    });
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
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        className="custom-modal-content"
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title id="contained-modal-title-vcenter" className="text-center w-100">
            Register Doctor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleSubmit}>
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
                <option value="Orthopaedics Surgeon">Orthopaedics Surgeon</option>
                <option value="Gastroentrotopy & Pediatrics">Gastroentrotopy & Pediatrics</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                <option value="ENT">ENT</option>
                <option value="Dermatology">Dermatology</option>

              </Form.Control>
            </Form.Group>

            {imagePreview && (
              <div className="mb-3">
                <Form.Label>Profile Image Preview</Form.Label>
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                </div>
              </div>
            )}

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Appointments</Form.Label>
              <Button variant="outline-info" onClick={applyToAll} className='applyall'>Apply to all</Button>
              {Object.keys(availability).map(day => renderAvailabilityFields(day))}
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center">
              <Button variant="success" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddDoctor;
