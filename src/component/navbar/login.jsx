import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./navBar.css"; // Import your CSS file

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword,setShowPassword]=useState(false)

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password
    };

    try {
        const response = await axios.post('https://hospital-gijl.onrender.com/api/auth/login', loginData, {
            withCredentials: true  // Ensure cookies are sent
          }); 
      const { userType,user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      // Call the onLoginSuccess prop to update the login state in NavBar
      props.onLoginSuccess(userType);

      // Navigate based on userType
      switch (userType) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'receptionist':
          navigate('/receptionist');
          break;  
        case 'normal':
        default:
          navigate('/');
          break;
      }
      setEmail('')
      setPassword('')
      setError('')
      
      props.onHide();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during login. Please try again later.');
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
        className="custom-modal-content"
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title id="contained-modal-title-vcenter" className="text-center w-100">
            Login Here
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleLogin}>
            {error && <p className="error-message">{error}</p>}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
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
            <div className="text-center">
              <Button variant="outline-success btnclass" type="submit">Login</Button>
              <Button variant="link" className="forgot-password-link">Forgot Password?</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
