
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/home/home";
import Appointment from "./pages/appointment/appointment"
import Dashboard from"./pages/dashboard/dashboard"
import Admin from "./pages/admin/admin"
import Doctor from "./pages/doctor/doctor"
import Receptionist from "./pages/receptionist/receptionist"
import About from "./pages/abort/abort";
import CreateLog from "./pages/createLog/createLog";  
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
/*secure*/
import AdminRoute from './Routes/adminroute';
import DoctorRoute from './Routes/doctorroute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Appointment" element={<Appointment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminRoute element={Admin} />} />
          <Route path="/doctor" element={<DoctorRoute element={Doctor} />} />
          <Route path="/receptionist" element={<Receptionist />} />
          <Route path="/about" element={<About />} />
          <Route path="/create-log/:appointmentId" element={<CreateLog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;