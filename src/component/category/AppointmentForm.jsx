import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

function AppointmentForm({ doctorId, userId, onHide }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [tokenNumber, setTokenNumber] = useState(null);
  const [patientname,setPatientname]=useState('')
  const [patientgender,setPatientgender]=useState('')
  const [patientage,setPatientage]=useState('')
  const [totalToken, setTotalToken] = useState('');
  const [error, setError] = useState('');
  const [symptom, setSymptom] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/doctor/info/${doctorId}`)
      .then(response => {
        generateAvailableDays(response.data.availableAppointments);
      })
      .catch(error => console.error(error));
  }, [doctorId]);

  const generateAvailableDays = (availableAppointments) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableDays = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date();
      currentDay.setDate(currentDay.getDate() + i);
      const dayName = daysOfWeek[currentDay.getDay()];

      const dayInfo = availableAppointments.find(appointment => appointment.Day === dayName && appointment.available);
      if (dayInfo) {
        availableDays.push({
          date: currentDay.toISOString().split('T')[0],
          ...dayInfo
        });
      }
    }

    setAvailableDays(availableDays);
  };

  const handleDateChange = async (selectedDate) => {
    setDate(selectedDate);
    console.log(selectedDate);
    const dayInfo = availableDays.find(day => day.date === selectedDate);
    setSelectedDayInfo(dayInfo);
    if (dayInfo) {
      setTime(`${dayInfo.startTime} - ${dayInfo.endTime}`);
      setTotalToken(dayInfo.availaableslots);
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointmentsbydate?doctorid=${doctorId}&date=${selectedDate}`);
        const existingAppointments = response.data;
        const tokenNumber = existingAppointments.length;

        if (tokenNumber <= dayInfo.availaableslots) {
          setTokenNumber(tokenNumber);
        } else {
          setTokenNumber("full");
          setError("Appointment full")
        }
      } catch (error) {
        console.error(error);
        setTokenNumber("Error fetching appointments");
      }
    } else {
      setTime('');
      setTokenNumber(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (tokenNumber === "full" || tokenNumber === "Error fetching appointments") {
      setError("Cannot book appointment: Slots are full or there was an error.");
      return;
    }

    let userIdToUse = userId;
    if (!userIdToUse) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser._id) {
        setError('Login in to make appointment');
        console.error("User ID not found in local storage");
        return;
      }
      userIdToUse = storedUser._id;
    }

    const newAppointment = {
      userid: userIdToUse,
      doctorid: doctorId,
      date: date,
      day: new Date(date).toLocaleString('en-US', { weekday: 'long' }),
      time: time,
      symptom: symptom,
      tokennumber: tokenNumber,
      patientname:patientname,
      patientage:patientage,
      patientgender:patientgender
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/appointments`, newAppointment);
      console.log(response.data);
      onHide();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="info">{error}</Alert>}
      <Form.Group className="mb-3" controlId="date">
        <Form.Label>Select Date</Form.Label>
        <Form.Control
          as="select"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          required
        >
          <option value="">Select a date</option>
          {availableDays.map((day, index) => (
            <option key={index} value={day.date}>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {selectedDayInfo && (
        <>
          <Form.Group className="mb-3" controlId="symptom">
            <Form.Label>Symptom</Form.Label>
            <Form.Control
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="symptom">
            <Form.Label>patient name</Form.Label>
            <Form.Control
              value={patientname}
              onChange={(e) => setPatientname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="symptom">
            <Form.Label>patient Age</Form.Label>
            <Form.Control
              value={patientage}
              onChange={(e) => setPatientage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="symptom">
            <Form.Label>patient gender</Form.Label>
            <Form.Select
              value={patientgender}
              onChange={(e) => setPatientgender(e.target.value)}
              required
            >
             <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="time">
            <Form.Label>Available Time</Form.Label>
            <Form.Control
              type="text"
              value={time}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="totalToken">
            <Form.Label>Total Token</Form.Label>
            <Form.Control
              type="text"
              value={totalToken-tokenNumber}
              readOnly
            />
          </Form.Group>
        </>
      )}
      <div className="text-center">
        <Button 
          variant="outline-success" 
          type="submit" 
          disabled={tokenNumber === "full" || tokenNumber === "Error fetching appointments"}
        >
          Book Appointment
        </Button>
      </div>
    </Form>
    </>
  );
}

export default AppointmentForm;
