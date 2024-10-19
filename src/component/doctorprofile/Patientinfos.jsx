import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../adminDashboard/adminDashboard.css";
import "./doctorprofile.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faUser, faCalendarDays, faTag, faVenusMars, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';

const Patientinfos = () => {
    const [doctorid, setDoctorid] = useState("");
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [logStatus, setLogStatus] = useState({});  // Track log status for each appointment

    const todayDate = new Date().toISOString().split("T")[0];
    console.log(todayDate)
    // Memoize the search function to prevent re-creation on every render
    const handleDoctorAppointmentSearch = useCallback(async () => {
        setDoctorAppointments([]);
        setLogStatus({});  // Reset log status for new search
        try {
            const appointmentsResponse = await axios.get(`https://hospitalerp-node.onrender.com/api/appointments/doctor/date/${doctorid}`, {
                params: { fromDate, toDate }
            });
            const sortedAppointments = appointmentsResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setDoctorAppointments(sortedAppointments);

            // Check if each appointment has a log
            for (const appointment of sortedAppointments) {
                checkLogExistence(appointment._id);
            }
        } catch (error) {
            console.error("Error searching for doctor's appointments:", error);
        }
    }, [doctorid, fromDate, toDate]);

    // Function to check if a log exists for the given appointment ID
    const checkLogExistence = async (appointmentId) => {
        try {
            const logResponse = await axios.get(`https://hospitalerp-node.onrender.com/api/logs/view/${appointmentId}`);
            if (logResponse.data) {
                setLogStatus((prev) => ({ ...prev, [appointmentId]: true }));  // Log exists
            }
        } catch (error) {
            setLogStatus((prev) => ({ ...prev, [appointmentId]: false }));  // Log does not exist
        }
    };

    useEffect(() => {
        const storedDoctor = JSON.parse(localStorage.getItem('user'));
        if (storedDoctor) {
            setDoctorid(storedDoctor._id);
        }

        // Set the initial values for fromDate and toDate only if they are empty
        if (!fromDate) setFromDate(todayDate);
        if (!toDate) setToDate(todayDate);
    }, [fromDate, toDate, todayDate]); // Remove handleDoctorAppointmentSearch from dependencies

    useEffect(() => {
        handleDoctorAppointmentSearch();
    }, [doctorid, fromDate, toDate, handleDoctorAppointmentSearch]);

    // Render the appointment card with log buttons
    const renderAppointmentCarddoc = (appointment) => {
        const hasLog = logStatus[appointment._id];

        return (
            <div className="patient-card" key={appointment._id}>
                <div className="detail"><FontAwesomeIcon icon={faUser} /><strong>Patient name :</strong> <span>{appointment.patientname}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Patient Age :</strong><span>{appointment.patientage}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faVenusMars} /><strong>Gender :</strong> <span>{appointment.patientgender}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faTicket} /><strong>Token Number :</strong> <span>{appointment.tokennumber}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faCalendarDays} /><strong>Date :</strong> <span>{new Date(appointment.date).toLocaleDateString()}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faNotesMedical} /><strong>Appointment Reason :</strong> <span>{appointment.symptom}</span></div>
                <div className="detail"><FontAwesomeIcon icon={faTag} /><strong>Appointment Status :</strong> <span>{appointment.status}</span></div>

                {/* Log Buttons */}
                <div className="log-buttons">
                    {hasLog ? (
                        <>
                            <Button variant="outline-primary" className="view-btn">View Log</Button>
                            <Link to={`/create-log/${appointment._id}`}>
                                <Button variant="outline-warning" className="edit-btn">Edit Log</Button>
                            </Link>
                        </>
                    ) : (
                        <Link to={`/create-log/${appointment._id}`}>
                            <Button variant="outline-success" className="create-btn">Create Log</Button>
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="subhead">Search Doctor's Appointments</h2>
            <div className="date-range-inputs">
                <label>
                    From Date:
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </label>
                <label>
                    To Date:
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </label>
                <Button variant="outline-success" className="searchbtn" onClick={handleDoctorAppointmentSearch}>Search</Button>
            </div>

            {doctorAppointments.length > 0 ? (
                <Row>
                    {doctorAppointments.map(renderAppointmentCarddoc)}
                </Row>
            ) : (
                <Alert variant="warning">No appointments found within the specified date range</Alert>
            )}
        </div>
    );
};

export default Patientinfos;
