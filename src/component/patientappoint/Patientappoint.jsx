import Register from "../navbar/Register";
import Button from 'react-bootstrap/Button';
import "../adminDashboard/adminDashboard.css";
import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import DoctorList from '../category/Doctorlist';

const Patientappoint = () => {
    const [show, setShow] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userId, setUserId] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://hospitalerp-node.onrender.com/api/user/search/phone', {
                params: { phone: phoneNumber }
            });
            setUserId(response.data.id);
            setSearchResult(`User Name: ${response.data.username}`);
        } catch (error) {
            console.error("Error searching for phone number:", error);
            setSearchResult("User not found");
        }
    };

    return (
        <>
            <Container>
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
            </Container>

            <Register
                show={show}
                onHide={() => setShow(false)}
            />
        </>
    );
}

export default Patientappoint;
