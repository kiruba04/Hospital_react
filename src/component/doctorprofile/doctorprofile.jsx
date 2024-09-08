import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav, Badge,InputGroup } from 'react-bootstrap';
import axios from 'axios';
import "../profile/Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarDays, faCalendarDay, faUser, faTicket, faVenusMars, faNotesMedical,faTag } from '@fortawesome/free-solid-svg-icons';
import Editdoctor from '../alldoctor/Editdoctor'
import Alert from 'react-bootstrap/Alert';
import './doctorprofile.css';
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
  const [futureappointments, setFutureappointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [alertStates, setAlertStates] = useState({}); // To track alerts for each appointment
 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username,setUsername]= useState('');
  const [notes,setNotes]=useState([]);
  const [details,setDetails]=useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [userid,setuserid]=useState('');
  const [docid,setDocid]=useState('');
  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem('user'));
    if (storedDoctor) {
      setDoctor({
        ...storedDoctor,
        dateOfBirth: storedDoctor.dateofbirth ? new Date(storedDoctor.dateofbirth).toISOString().split('T')[0] : ''
      });
      fetchAppointments(storedDoctor._id);
      fetchFutureAppointments(storedDoctor._id);
      setDocid(storedDoctor._id);
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

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const fetchFutureAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`https://hospitalerp-node.onrender.com/api/future/${doctorId}`);
      const groupedAppointments = response.data.reduce((acc, appointment) => {
        const date = new Date(appointment.date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appointment);
        return acc;
      }, {});
      setFutureappointments(groupedAppointments);
    } catch (error) {
      console.error('Error fetching future appointments', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleDateChange = (e) => {
    setDoctor({ ...doctor, dateOfBirth: e.target.value });
  };
  const handleSave = (updatedDoctor) => {
    // Update the doctor's information in the state
    setDoctor({
      ...doctor,
      username: updatedDoctor.username,
      dateOfBirth: updatedDoctor.dateOfBirth,
      email: updatedDoctor.email,
      phone: updatedDoctor.phone,
      category: updatedDoctor.category,
      availableAppointments: updatedDoctor.availableAppointments,
    });
  
    // Optionally update local storage if required
    localStorage.setItem('user', JSON.stringify({
      ...doctor,
      username: updatedDoctor.username,
      dateOfBirth: updatedDoctor.dateOfBirth,
      email: updatedDoctor.email,
      phone: updatedDoctor.phone,
      category: updatedDoctor.category,
      availableAppointments: updatedDoctor.availableAppointments,
    }));
  
    // Close the modal and reset selected doctor
    handleCloseModal();
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


  const handleSearch = async () => {
    try {
      const response = await axios.get('https://hospitalerp-node.onrender.com/api/user/search/phone', {
        params: { phone: phoneNumber }
      });

      
      if (response.data) {
        setUsername(response.data.username);
        setuserid(response.data.id);
        
        const noteResponse = await axios.get(`https://hospitalerp-node.onrender.com/api/notes/${response.data.id}`);
        setNotes(noteResponse.data);  // Assuming `noteResponse.data` is an array of notes
  
      } else {
        setUsername('');
        setNotes([]);
        console.error('No user found with this phone number');
      }
    } catch (error) {
      console.error("Error searching for phone number:", error);
    }
  };
  
  

  const renderAppointmentSlotCard = (slot) => {
    return (
      slot.available === true && (
        <div className="patient-card" key={slot._id}>
          <h2>Available Slot</h2>
          <div className="detail">
            <FontAwesomeIcon icon={faCalendarDay} />
            <strong>Day:</strong> <span>{slot.Day}</span>
          </div>
          <div className="detail">
            <FontAwesomeIcon icon={faClock} />
            <strong>Available Time:</strong> <span>{slot.startTime} - {slot.endTime}</span>
          </div>
          <div className="detail">
            <FontAwesomeIcon icon={faCalendarDays} />
            <strong>Available Slots:</strong> <span>{slot.availaableslots}</span>
          </div>
        </div>
      )
    );
  };
  

  const renderAppointmentCard = (appointment) => {
    const alertInfo = alertStates[appointment._id] || {}; // Get the alert info for the current appointment

    return (
      <div className="patient-card" key={appointment._id}>
        <h2>Patient Details</h2>
        <div className="detail"><FontAwesomeIcon icon={faUser} /><strong>Patient name:</strong> <span>{appointment.patientname}</span></div>
        <div className='detail'><FontAwesomeIcon icon={faCalendarDays} /><strong>Patient Age:</strong><span>{appointment.patientage}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faVenusMars} /><strong>Gender:</strong> <span>{appointment.patientgender}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faTicket} /><strong>Token Number:</strong> <span>{appointment.tokennumber}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Date:</strong> <span>{new Date(appointment.date).toLocaleDateString()}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faNotesMedical} /><strong>Appointment Reason:</strong> <span>{appointment.symptom}</span></div>
        <div className="detail"><FontAwesomeIcon icon={faTag} /><strong>Appointment Status:</strong> <span>{appointment.status}</span></div>
        {alertInfo.message && (
          <Alert variant={alertInfo.variant} onClose={() => setAlertStates({ ...alertStates, [appointment._id]: null })} dismissible>
            {alertInfo.message}
          </Alert>
        )}
        <div className="mt-3">
          <Button variant="success" onClick={() => handleAppointmentStatusChange(appointment._id, 'Conformed')}>Conformed</Button>{' '}
          <Button variant="danger" onClick={() => handleAppointmentStatusChange(appointment._id, 'Canceled')}>Cancel</Button>
        </div>
      </div>
    );
  };

  
  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`https://hospitalerp-node.onrender.com/api/appointments/${appointmentId}/status`, { status: newStatus });
      if (response.status === 200) {
        // Update the local state to reflect the status change
        setTodayappointments(todayappointments.map(appointment => 
          appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment
        ));

        // Set alert message and variant for the specific appointment
        setAlertStates({
          ...alertStates,
          [appointmentId]: { message: `Appointment status updated to ${newStatus}!`, variant: 'success' }
        });
      }
    } catch (error) {
      console.error('Error updating appointment status', error);
      // Set error alert message and variant for the specific appointment
      setAlertStates({
        ...alertStates,
        [appointmentId]: { message: 'Failed to update appointment status. Please try again.', variant: 'danger' }
      });
    }
  };
  const renderNoteCard = (note) => (
    <div className="patient-card" key={note._id}>
      <div className="detail">
        <FontAwesomeIcon icon={faCalendarDays} />
        <strong>Date:</strong> <span>{new Date(note.date).toLocaleDateString()}</span>
      </div>
      <div className="detail">
        <FontAwesomeIcon icon={faNotesMedical} />
        <strong>Note:</strong> <span>{note.notes}</span>
      </div>
    </div>
  );
 
  const handlecreate = async () =>{
    const notesmaking={
      userid:userid,
      doctorid:docid,
      date:dateOfBirth,
      notes:details
    }
    try{
    const res =  await axios.post('https://hospitalerp-node.onrender.com/api/notes/create', notesmaking)
    if(res){
     
      const newNote = res.data;

      // Update the notes state with the newly created note
      setNotes(prevNotes => [...prevNotes, newNote]);
   

    // Reset the date and notes fields
    setDateOfBirth('');
    setDetails('');
    }
    }
    catch{
      console.log('Error')
    }
  }

  const renderFutureAppointments = () => {
    return Object.keys(futureappointments).map(date => (
      <div key={date}>
        <h3 className='datefont'>{date}</h3>
        {futureappointments[date].map(renderAppointmentCard)}
      </div>
    ));
  };

  return (
    <>
    <Container className="mt-5">
      <Row>
        <Col md={2}>
          <Nav className="flex-column">
            <Nav.Link active={view === 'profile'} onClick={() => setView('profile')} className={`text-success sidenavfont ${view === 'profile' ? 'active' : ''}`}>Profile</Nav.Link>
            <Nav.Link active={view === 'today appointment'} onClick={() => setView('today appointment')} className={`text-success sidenavfont ${view === 'today appointment' ? 'active' : ''}`}>Today's Appointment <Badge pill bg="primary">{todayappointments.length}</Badge></Nav.Link>
            <Nav.Link active={view === 'futureappointment'} onClick={() => setView('futureappointment')} className={`text-success sidenavfont ${view === 'futureappointment' ? 'active' : ''}`}>Future Appointment</Nav.Link>
            <Nav.Link active={view === 'appointments'} onClick={() => setView('appointments')} className={`text-success sidenavfont ${view === 'appointments' ? 'active' : ''}`}>Appointment Slots</Nav.Link>
            <Nav.Link active={view === 'patient history'} onClick={() => setView('patient history')} className={`text-success sidenavfont ${view === 'patient history' ? 'active' : ''}`}>Patient History</Nav.Link>
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
                <option value="Orthopaedics Surgeon">Orthopaedics Surgeon</option>
                <option value="Gastroentrotopy & Pediatrics">Gastroentrotopy & Pediatrics</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                <option value="ENT">ENT</option>
                <option value="Dermatology">Dermatology</option>
                      
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
              <h2 className='subhead'>Edit Appointment time</h2>
              <Row>
                {doctor.availableAppointments.map(renderAppointmentSlotCard)}
              </Row>
              <Button variant="outline-success" onClick={() => handleEditClick(doctor)}>Edit</Button>
            </div>
          )}

          {view === 'today appointment' && (
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
          )}

          {view === 'futureappointment' && (
            <div>
              <h3 className='subhead'>Future Appointments</h3>
              {Object.keys(futureappointments).length === 0 ? (
                <p>No future appointments.</p>
              ) : (
                renderFutureAppointments()
              )}
              
            </div>
          )}
          
          {view === 'patient history' && (
            <div>
              <h3 className='subhead'>Patient History</h3>
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

                                {notes.length === 0 ? (
                                  <p> No notes. </p>
                                    ) : (
                                    <Row>
                                        {notes.map(renderNoteCard)}
                                    </Row>
                                  )}
                                {username &&
                                
                                <Row>
                                  <Col md={8}>
                                  <Form.Group className="mb-3" controlId="dateOfBirth">
                                        <Form.Label>Date</Form.Label>
                                            <Form.Control
                                                 type="date"
                                                  value={dateOfBirth}
                                                  onChange={(e) => setDateOfBirth(e.target.value)}
                                                  required
                                              />
                                    </Form.Group>
                                   <Form.Group className="mb-3" controlId="address">
                                        <Form.Label>Add notes</Form.Label>
                                                <Form.Control
                                                  as="textarea"
                                                  placeholder="Enter notes about patient"
                                                  value={details}
                                                  onChange={(e) => setDetails(e.target.value)}
                                                  required
                                                />
                                     </Form.Group>
                                     <Button variant="outline-primary" onClick={handlecreate}>
                                                Add notes
                                      </Button>

                                  </Col>
                                </Row>
                                }


            </div>
          )}
        </Col>
      </Row>
    </Container>
     <Editdoctor
     show={showModal}
     onHide={handleCloseModal}
     doctor={selectedDoctor}
     onSave={handleSave}
   />
   </>
  );
};

export default DoctorInformation;
