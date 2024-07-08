import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminDashboard.css'; // Ensure this is the correct path to your CSS file
import Button from 'react-bootstrap/Button';
import AddDoctor from './AddDoctor';

const AdminDashboard = () => {

   const [addshow,setAddshow] = useState(false);

  return (
    <>
      <div className='alignment'>
        <section id="dashboard" className="my-5">
          <Container>
            <h2 className="text-left mb-4 line">Dashboard</h2>
            <Row className="g-4">
              <Col xs={12} md={4}>
                <Card className="text-center shadow-sm custom-card">
                  <Card.Body>
                    <Card.Title>Total Patients</Card.Title>
                    <Card.Text>120</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={4}>
                <Card className="text-center shadow-sm custom-card">
                  <Card.Body>
                    <Card.Title>Total Staff</Card.Title>
                    <Card.Text>50</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={4}>
                <Card className="text-center shadow-sm custom-card">
                  <Card.Body>
                    <Card.Title>Total Appointments</Card.Title>
                    <Card.Text>30</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <h2 className="text-left mb-4 line">Add Doctor</h2>
            <Button variant="outline-success"onClick={() => setAddshow(true)} >Add Doctor</Button>
          </Container>
        </section>
      </div>
      <AddDoctor
      show={addshow}
      onHide={() => setAddshow(false)}
      />
    </>
  );
};

export default AdminDashboard;
