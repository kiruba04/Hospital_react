
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

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
  <>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Appointment" element={<Appointment/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/admin" element ={<Admin/>}/>
        <Route path="/doctor" element ={<Doctor/>}/>
        <Route path='/receptionist' element ={<Receptionist/>}/>
      </Routes>
    </BrowserRouter>

  </>
  );
}

export default App;
