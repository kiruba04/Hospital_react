import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Form, Row, Col, Container,Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCalendarDays, faUser, faTicket, faTag } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "./Logs.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CreateLog = () => {
  const { appointmentId } = useParams(); // Fetch appointment ID from the URL
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // Initialize with 5 prescription rows, including dosageAmount field
  const [prescriptions, setPrescriptions] = useState(
    Array(5).fill({ medicine: "", dosage: "", dosageAmount: "", duration: "", time: { morning: false, afternoon: false, night: false } })
  );

  // Initialize with 5 test rows
  const [tests, setTests] = useState(Array(5).fill({test:"",testimage:""})); // Initialize with 5 empty strings

  const [notes, setNotes] = useState("");

  const [isEditing, setIsEditing] = useState(false); // Flag for editing

  const[testname,setTestname] =useState(Array(5).fill(""));

  const[reviewdate,setReviewdate] = useState("");
    // Fetch appointment and log details on component mount
    useEffect(() => {
      const fetchDetails = async () => {
        try {
          // Fetch appointment details
          const response = await axios.get(`https://hospitalerp-node.onrender.com/api/appointment/${appointmentId}`);
          setAppointmentDetails(response.data);
    
          // Check if a log exists for this appointment
          const logResponse = await axios.get(`https://hospitalerp-node.onrender.com/api/logs/view/${appointmentId}`);
          if (logResponse.data) {
            setPrescriptions(() => logResponse.data.prescriptions || Array(5).fill({ medicine: "", dosage: "", dosageAmount: "", duration: "", time: { morning: false, afternoon: false, night: false } }));
            setTests(() => logResponse.data.tests || Array(5).fill({test:"",testimage:""}));
            setNotes(() => logResponse.data.notes || "");
            setTestname(() =>logResponse.data.testname|| Array(5).fill(""))
            setReviewdate(() => new Date( logResponse.data.reviewdate).toISOString().split('T')[0] || "")
            setIsEditing(true); // Set editing flag to true
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      };
    
      fetchDetails();
    }, [appointmentId]);
    
    

  // Add a new prescription row
  const addPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { medicine: "", dosage: "", dosageAmount: "", duration: "", time: { morning: false, afternoon: false, night: false } }]);
  };

  // Remove a prescription row
  const removePrescriptionRow = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  // Add a new test row
  const addTestRow = () => {
    setTests([...tests, {test:"",testimage:""}]); // Add an empty string for the new test
  };

  // Remove a test row
  const removeTestRow = (index) => {
    setTests(tests.filter((_, i) => i !== index));
  };




   // Handler to update the input value for each row
   const handleInputChange = (index, value) => {
    const updatedTestname = [...testname];
    updatedTestname[index] = value;
    setTestname(updatedTestname);
  };

  // Handler to delete a row based on index
  const handleDelete = (index) => {
    const updatedTestname = testname.filter((_, i) => i !== index);
    setTestname(updatedTestname);
  };

  // Handler to add a new row
  const handleAdd = () => {
    setTestname([...testname, ""]); // Add a new empty string to the array
  };

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const logData = {
              appointmentId,
              prescriptions,
              tests,
              notes,
              testname,
              reviewdate,
          };

          if (isEditing) {
              await axios.put(`https://hospitalerp-node.onrender.com/api/logs/edit/${appointmentId}`, logData);
              alert("Log updated successfully");
          } else {
              await axios.post("https://hospitalerp-node.onrender.com/api/logs/add", logData);
              alert("Log created successfully");
          }
      } catch (error) {
          console.error("Error submitting log:", error);
      }
  };

  // Prevent form submission on "Enter" key press
  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default "Enter" behavior
    }
  };

  //download pdf
  const downloadPrescription = () => {
    const doc = new jsPDF();
  
    // Set hospital details, logo, patient info
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Hospital Name", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("Address of the hospital", 105, 16, { align: "center" });
  
    // Add hospital logo if available
    const hospitalLogo = "https://th.bing.com/th/id/OIP.YKY8sKGTpEL81DAibyXOsgHaHa?w=182&h=182&c=7&pcl=1b1a19&r=0&o=5&dpr=2&pid=1.7"; // Add the path to your hospital logo
    if (hospitalLogo) {
      doc.addImage(hospitalLogo, "PNG", 10, 10, 30, 30); // Adjust logo position and size
    }
  
    // Patient information
    doc.setFontSize(12);
    doc.text(`Patient Name: ${appointmentDetails.patientname}`, 10, 50);
    doc.text(`Age: ${appointmentDetails.patientage}`, 10, 56);
    doc.text(`Gender: ${appointmentDetails.patientgender || "N/A"}`, 10, 62);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 50);
  
    // Prescription table columns
    const columns = [
      { header: "Medicine", dataKey: "medicine" },
      { header: "Dosage (mg/ml)", dataKey: "dosageAmount" },
      { header: "Duration (Days)", dataKey: "duration" },
      { header: "Dosage Time", dataKey: "dosage" },
      { header: "Morning", dataKey: "morning" },
      { header: "Afternoon", dataKey: "afternoon" },
      { header: "Night", dataKey: "night" },
    ];
  
    // Filter and create prescription table data, excluding rows where all fields are empty
    const rows = prescriptions
      .map((prescription) => ({
        medicine: prescription.medicine || "",
        dosageAmount: prescription.dosageAmount || "",
        duration: prescription.duration || "",
        dosage: prescription.dosage || "",
        morning: prescription.time.morning ? "Yes" : "",
        afternoon: prescription.time.afternoon ? "Yes" : "",
        night: prescription.time.night ? "Yes" : "",
      }))
      .filter((row) => {
        // Only include rows that have at least one non-empty value
        return Object.values(row).some((value) => value !== "");
      });
  
    // Add prescription table using autoTable
    if (rows.length > 0) {
      doc.autoTable({
        startY: 80, // Starting position of the table (below patient details)
        head: [columns.map(col => col.header)], // Table headers
        body: rows.map(row => columns.map(col => row[col.dataKey])), // Table data
        theme: "grid", // Theme for table design (grid, plain, striped)
        styles: {
          fontSize: 10, // Font size for table
          textColor: [40, 40, 40], // Text color for table
        },
        headStyles: {
          fillColor: [220, 220, 220], // Background color for headers
          textColor: [0, 0, 0], // Text color for headers
          fontSize: 12, // Font size for headers
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Adjust cell width for each column
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
        },
        margin: { top: 10 },
      });
    }
  
    // Save the generated PDF
    doc.save(`prescription-${appointmentDetails.patientname}.pdf`);
  };

  //handel image upload

  const handleImageUpload = async (event, index) => {
    const image = event.target.files[0]; // Get the selected file
    if (!image) return; // If no file is selected, return
  
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'zpbashqc');
  
    try {
      const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dsgdnskfj/image/upload', formData);
      const imageUrl = cloudinaryResponse.data.secure_url;
      
      // Update the specific test with the uploaded image URL
      setTests(
        tests.map((t, i) =>
          i === index ? { ...t, testimage: imageUrl } : t
        )
      );
    } catch (error) {
      console.error('Image upload failed. Please try again.', error);
    }
  };
  



  return (
    <Container>
      <h2 className="logtitle">Log details</h2>
      {appointmentDetails ? (
        <>
        <div className="logcontainer">
          <Row className="mb-4">
            <Col>
              <h3 className="logheading">Appointment Details</h3>
              <div className="details patient-card">
              <p className="detail"><strong><FontAwesomeIcon icon={faUser} />Patient Name :</strong> {appointmentDetails.patientname}</p>
              <p className="detail"><strong><FontAwesomeIcon icon={faTicket} />Token Number :</strong> {appointmentDetails.tokennumber}</p>
              <p className="detail"><strong><FontAwesomeIcon icon={faCalendarDays} />Date :</strong> {new Date(appointmentDetails.date).toLocaleDateString()}</p>
              <p className="detail"><strong><FontAwesomeIcon icon={faTag} />Reason :</strong> {appointmentDetails.symptom}</p>
              <p className="detail"> <strong><FontAwesomeIcon icon={faCalendarDays} />Age :</strong> {appointmentDetails.patientage}</p>
              </div>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit} onKeyDown={preventEnterSubmit}>
            {/* Prescription Table */}
            <h4 className="logheading">Prescription Details</h4>
            <Table striped bordered hover responsive id="prescription-content">
              <thead className="tableheading">
                <tr>
                  <th className="tablehead">Medicine Name</th>
                  <th className="tablehead">Dosage (mg/ml)</th> {/* New Dosage Column */}
                  <th className="tablehead">Duration (Days)</th>
                  <th className="tablehead">Time (Before/After Food)</th>
                  <th className="tablehead">When (Morning/Afternoon/Night)</th>
                  <th className="tablehead">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={prescription.medicine}
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, medicine: e.target.value } : p
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={prescription.dosageAmount} // Dosage amount input field
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, dosageAmount: e.target.value } : p
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={prescription.duration}
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, duration: e.target.value } : p
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="select"
                        value={prescription.dosage}
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, dosage: e.target.value } : p
                            )
                          )
                        }
                      >
                        <option value="">Select Dosage</option>
                        <option value="Before Food">Before Food</option>
                        <option value="After Food">After Food</option>
                      </Form.Control>
                    </td>
                    <td>
                      <Form.Check
                        inline
                        label="Morning"
                        type="checkbox"
                        checked={prescription.time.morning}
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, time: { ...p.time, morning: e.target.checked } } : p
                            )
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Afternoon"
                        type="checkbox"
                        checked={prescription.time.afternoon}
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, time: { ...p.time, afternoon: e.target.checked } } : p
                            )
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Night"
                        type="checkbox"
                        checked={prescription.time.night}
                        onChange={(e) =>
                          setPrescriptions(
                            prescriptions.map((p, i) =>
                              i === index ? { ...p, time: { ...p.time, night: e.target.checked } } : p
                            )
                          )
                        }
                      />
                    </td>
                    <td className="tableheading">
                      <Button variant="outline-danger" onClick={() => removePrescriptionRow(index)}>
                      <i class="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-info" onClick={addPrescriptionRow} className="mb-3">
            <i class="bi bi-plus-circle-fill"></i> Add Medicine
            </Button>
            <Button variant="success" onClick={downloadPrescription}  className="mb-3 download">
              Download <i class="bi bi-cloud-arrow-down-fill"></i>
            </Button>
            <Row>
              <Col lg={8} sm={12}>
            {/* Test Table */}
            <h4 className="logheading">Tests to be Done</h4>
            <Table striped bordered hover responsive>
            <thead>
    <tr className="tableheading">
      <th className="tablehead">Test Name</th>
      <th className="tablehead">Test Image</th>
      <th className="tablehead">Actions</th>
    </tr>
  </thead>
  <tbody>
    {tests.map((test, index) => (
      <tr key={index}>
        <td>
          <Form.Control
            type="text"
            value={test.test}
            onChange={(e) =>
              setTests(
                tests.map((t, i) =>
                  i === index ? { ...t, test: e.target.value } : t
                )
              )
            }
          />
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, index)}
              style={{ display: 'none' }}
              id={`file-input-${index}`}
              
            />
            <Button variant="outline-info"
              onClick={() => document.getElementById(`file-input-${index}`).click()}
            >
            Upload Report  <i class="bi bi-file-earmark-arrow-up-fill"></i>
            </Button>
            {test.testimage && (
              <>
                <img
                  src={test.testimage}
                  alt="Preview"
                  style={{ width: '50px',height:'50px', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={() => window.open(test.testimage, '_blank')}
                />
              </>
            )}
          </div>
        </td>
        <td className="tableheading">
          <Button variant="outline-danger" onClick={() => removeTestRow(index)}>
            <i className="bi bi-trash"></i>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
            </Table>
            <Button variant="outline-info" onClick={addTestRow} className="mb-3">
            <i class="bi bi-plus-circle-fill"></i> Add Test
            </Button>
              </Col>
             
            {/* Notes */}
            <Col lg={4} sm={12}>
            <h4 className="logheading">Doctor's Notes</h4>
            <Form.Control
              as="textarea"
              rows={12}
              value={notes}
              placeholder="Type you notes on there....."
              onChange={(e) => setNotes(e.target.value)}
              className="mb-3"
            />

          </Col>
          </Row>
          <Row>
          <Col lg={4} sm={12}>
            {/* Review Date */}
            <Form.Group className="mt-3">
              <h4 className="logheading">Review Date</h4>
              <Form.Control
                type="date"
                value={reviewdate}
                onChange={(e) => setReviewdate(e.target.value)}
              />
            </Form.Group>

           </Col>
           <Col lg={8} sm={12}>
      
      {/* Table */}
      <h3 className="text-center mb-4 logheading">Test to be taken</h3>

{/* Table */}
<Table striped bordered hover>
  <thead>
    <tr className="tableheading">
      <th className="tablehead">Test Name</th>
      <th className="tablehead">Actions</th>
    </tr>
  </thead>
  <tbody>
    {testname.map((test, index) => (
      <tr key={index}>
        <td>
          <Form.Control
            type="text"
            value={test}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter test name"
          />
        </td>
        <td className="tableheading" >
          <Button variant="danger" onClick={() => handleDelete(index)}>
          <i className="bi bi-trash"></i>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

{/* Add Button */}
<Row className="justify-content-center">
  <Col xs="auto">
    <Button variant="outline-info" onClick={handleAdd}>
    <i class="bi bi-plus-circle-fill"></i> Add Row
    </Button>
  </Col>
</Row>
</Col>
</Row>

          <Button variant="success" type="submit">{isEditing ? "Update Log" : "Create Log"}</Button>
          </Form>
         
          
          
          </div>
        </>
      ) : (
        <Spinner animation="border" variant="success" className="loader"/>
      )}
    </Container>
  );
};

export default CreateLog;
