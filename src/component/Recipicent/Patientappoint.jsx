import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import DoctorList from '../category/Doctorlist';
import Register from "../navbar/Register";
import "../adminDashboard/adminDashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faTicket, faUser, faCalendarDay, faCalendarDays, faClock, faTag, faVenusMars,faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import '../profile/Profile.css';

const Patientappoint = () => {
    const [view, setView] = useState('makeAppointment');
    const [show, setShow] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberSearch, setPhoneNumberSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchResult1, setSearchResult1] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [username, setUsername] = useState(null);
    const [doctorPhoneNumber, setDoctorPhoneNumber] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [doctorSearchResult, setDoctorSearchResult] = useState(null);


    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/search/phone`, {
                params: { phone: phoneNumber }
            });
            setUserId(response.data.id);
            setSearchResult(`User Name: ${response.data.username}`);
        } catch (error) {
            console.error("Error searching for phone number:", error);
            setSearchResult("User not found");
        }
    };

    const handleDoctorAppointmentSearch = async () => {
        setDoctorAppointments([]);
        try {
            const doctorResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/doctor/phone`, {
                params: { phone: doctorPhoneNumber }
            });
    
            const appointmentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/doctor/date/${doctorResponse.data.id}`, {
                params: { fromDate, toDate }
            });
            
    
            const sortedAppointments = appointmentsResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setDoctorAppointments(sortedAppointments);
            setDoctorSearchResult(`Doctor Name: ${doctorResponse.data.username}`);
        } catch (error) {
            console.error("Error searching for doctor's appointments:", error);
            setDoctorSearchResult("Doctor not found or no appointments within the specified date range.");
        }
    };
    
    const handleSearchAppointment = async () => {
        setAppointments([]);
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/search/phone`, {
                params: { phone: phoneNumberSearch }
            });
            setUsername(userResponse.data.username);

            const appointmentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/${userResponse.data.id}`);
            const sortedAppointments = appointmentResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAppointments(sortedAppointments);
            setSearchResult1(`User Name: ${userResponse.data.username}`);
        } catch (error) {
            console.error("Error searching for appointments:", error);
            setSearchResult1("User not found");
        }
    };

    const renderAppointmentCard = (appointment) => {
        return (
            <div className="patient-card" key={appointment._id}>
                <div className="detail"><FontAwesomeIcon icon={faUserDoctor} /><strong>Doctor Name:</strong> <span>{appointment.doctorid.username}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faClock} /><strong>Available Time:</strong> <span>{appointment.time}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Date:</strong> <span>{new Date(appointment.date).toLocaleDateString()}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faCalendarDay} /><strong>Day:</strong> <span>{appointment.day}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faUser} /><strong>Username:</strong> <span>{username}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faTicket} /><strong>Token Number:</strong> <span>{appointment.tokennumber}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faTag} /><strong>Appointment Status:</strong> <span>{appointment.status}</span></div>
            </div>
        );
    };
    const renderAppointmentCarddoc = (appointment) => {
        return (
            <div className="patient-card" key={appointment._id}>
                <div className="detail"><FontAwesomeIcon icon={faUser} /><strong>Patient name:</strong> <span>{appointment.patientname}</span></div>
                <div className='detail'><FontAwesomeIcon icon={faCalendarDays} /><strong>Patient Age:</strong><span>{appointment.patientage}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faVenusMars} /><strong>Gender:</strong> <span>{appointment.patientgender}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faTicket} /><strong>Token Number:</strong> <span>{appointment.tokennumber}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Date:</strong> <span>{new Date(appointment.date).toLocaleDateString()}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faNotesMedical} /><strong>Appointment Reason:</strong> <span>{appointment.symptom}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faTag} /><strong>Appointment Status:</strong> <span>{appointment.status}</span></div>
            </div>
        );
    };
    return (
        <>
            <Container>
                <Row>
                    <Col md={2}>
                        <Nav className="flex-column">
                            <Nav.Link active={view === 'makeAppointment'} onClick={() => setView('makeAppointment')} className="text-success sidenavfont">Make Appointment</Nav.Link>
                            <Nav.Link active={view === 'patientHistory'} onClick={() => setView('patientHistory')} className="text-success sidenavfont">Patient History</Nav.Link>
                            <Nav.Link active={view === 'doctorAppointment'} onClick={() => setView('doctorAppointment')} className="text-success sidenavfont">Doctor Appointment</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={10}>
                        {view === 'makeAppointment' && (
                            <>
                                <h2 className="text-left mb-4 line">Add Patient</h2>
                                <Row className="mb-3">
                                    <Col md={8}>
                                        <InputGroup>
                                            <Form.Control
                                                placeholder="Search by phone number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                            <Button variant="outline-primary" onClick={handleSearch}>
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                {searchResult && (
                                    <Row className="mb-3">
                                        <Col>
                                            <Alert variant={userId ? "success" : "danger"}>
                                                {searchResult}
                                            </Alert>
                                        </Col>
                                    </Row>
                                )}
                                {userId && (
                                    <Row className="mb-3">
                                        <Col>
                                            <DoctorList userId={userId} />
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    <Col>
                                        <Button variant="outline-success" onClick={() => setShow(true)}>Add patient</Button>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {view === 'patientHistory' && (
                            <div>
                                <h2 className="text-left mb-4 line">Patient History</h2>
                                <Row className="mb-3">
                                    <Col md={8}>
                                        <InputGroup>
                                            <Form.Control
                                                placeholder="Search by phone number"
                                                value={phoneNumberSearch}
                                                onChange={(e) => setPhoneNumberSearch(e.target.value)}
                                            />
                                            <Button variant="outline-primary" onClick={handleSearchAppointment}>
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Col>
                                </Row>

                                {searchResult1 && (
                                    <Row className="mb-3">
                                        <Col>
                                           
                                                {searchResult1}
                                 <Row>
                                        {appointments.length > 0 ? (
                                            appointments.map(renderAppointmentCard)
                                        ) : (
                                            <Alert variant="warning">No appointments found</Alert>
                                        )}
                                </Row>
                                    
                                        </Col>
                                    </Row>
                                )}



                            </div>
                        )}

{view === 'doctorAppointment' && (
    <div >
        <h2 className="text-left mb-4 line">Doctor Appointment</h2>
        <Row className="mb-3">
            <Col md={8}>
                <InputGroup>
                    <Form.Control
                        placeholder="Search by doctor's phone number"
                        value={doctorPhoneNumber}
                        onChange={(e) => setDoctorPhoneNumber(e.target.value)}
                        className='mb-3'
                    />
                </InputGroup>
                <InputGroup>
                    <Form.Control
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <Form.Control
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    <Button variant="outline-primary" onClick={handleDoctorAppointmentSearch}>
                        Search
                    </Button>
                </InputGroup>
            </Col>
        </Row>

        {doctorSearchResult && (
            <Row className="mb-3">
                <Col>
                    <Alert variant={doctorAppointments.length > 0 ? "success" : "danger"}>
                        {doctorSearchResult}
                    </Alert>
                </Col>
            </Row>
        )}

        <Row>
            {doctorAppointments.length > 0 ? (
                doctorAppointments.map(renderAppointmentCarddoc)
            ) : (
                <Alert variant="warning">No appointments found within the specified date range</Alert>
            )}
        </Row>
    </div>
)}

                    </Col>
                </Row>
            </Container>

            <Register
                show={show}
                onHide={() => setShow(false)}
            />
        </>
    );
}

export default Patientappoint;
