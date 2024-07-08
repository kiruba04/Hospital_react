import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import "./navBar.css"; // Import your CSS file
import "./Register.css";

function Register(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [lastname,setLastname]=useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [gender,setGender]=useState('')
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [error, setError] = useState('');
   
  const defa =() =>{
       setUsername('');
        setAddress('');
        setBloodType('');
        setConfirmPassword('');
        setDateOfBirth('');
        setEmail('');
        setMedicalHistory('');
        setPassword('');
        setPhone('');
        setError('');
        setGender('');
        setLastname('');
       
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const newUser = {
      username: username,
      lastname:lastname,
      email: email,
      password: password,
      gender:gender,
      bloodType: bloodType,
      dateOfBirth: dateOfBirth,
      phone: phone,
      address: address,
      medicalHistory: medicalHistory
    };

    try {
      const response = await axios.post('https://hospitalerp-node.onrender.com/api/auth/register', newUser);
      console.log(response.data);
      props.onHide();
      defa()
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
        setError('Email is already registered. Please use a different email.');
      } else {
        setError('Email is already register.');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='custom-modal'>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        className="custom-modal-content"
        dialogClassName="custom-modal-dialogheight"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title id="contained-modal-title-vcenter" className="text-center w-100">
            Register Here
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="password-field">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button variant="outline-secondary" onClick={toggleShowPassword}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="password-field">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button variant="outline-secondary" onClick={toggleShowPassword}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>gender</Form.Label>
              <Form.Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="bloodType">
              <Form.Label>Blood Type</Form.Label>
              <Form.Select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                required
              >
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Form.Select>
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

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="medicalHistory">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter medical history"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
              />

            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}

            <div className="text-center">
              <Button variant="outline-success btnclass" type="submit">Register</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Register;
