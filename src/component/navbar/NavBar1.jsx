import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./navBar.css"; // Ensure this CSS file exists and is correctly applied
import Login from "./login.jsx"; // Adjust the path if necessary
import Register from "./Register.jsx";

function NavBar1() {
  const [loginShow, setLoginShow] = useState(false);
  const [registerShow, setRegisterShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {

    // Check if the user is already logged in
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://hospitalerp-node.onrender.com/api/auth/checkAuth', {
          withCredentials: true // Ensure cookies are sent
        });
        if (response.data.auth && response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserType(response.data.userType);
        }
      } catch (error) {
        console.error('Error checking login status', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Make a POST request to your logout endpoint
      await axios.post('https://hospitalerp-node.onrender.com/api/auth/logout', {}, {
        withCredentials: true // Ensure cookies are sent
      });

      // Delete the 'access_token' cookie
      document.cookie = 'access_token=; max-age=0; domain=localhost; path=/';
       
      localStorage.removeItem('user');

      // Update local state to reflect logout
      setIsLoggedIn(false);
      setUserType('');

      // Navigate the user back to the homepage or desired route
      navigate('/');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  const handleLoginSuccess = (userType) => {
    setIsLoggedIn(true);
    setUserType(userType);
    setLoginShow(false);
  };

  return (
    <>
      {['lg'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-transparent mb-3 fixed-top navtext">
          <Container fluid>
            <Navbar.Brand href="/">Hospital</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Hospital
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3 d-flex">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/Appointment">Appointment</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  {isLoggedIn && storedUser ? (
                    <>
                      <Nav.Link href={storedUser.isAdmin ? '/admin' : userType === 'doctor' ? '/doctor' :userType==='receptionist'?'/receptionist': '/dashboard'} className='username'>
                        {storedUser.username}
                      </Nav.Link>
                      <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <Button className='btn-custom-success' onClick={() => setLoginShow(true)}>Login</Button>
                      <Button variant="outline-success" onClick={() => setRegisterShow(true)}>Sign Up</Button>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      <Login
        show={loginShow}
        onHide={() => setLoginShow(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Register
        show={registerShow}
        onHide={() => setRegisterShow(false)}
      />
    </>
  );
}

export default NavBar1;
