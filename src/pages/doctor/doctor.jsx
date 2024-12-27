import NavBar from "../../component/navbar/NavBar1.jsx"
import Doctor from "../../component/doctorprofile/doctorprofile.jsx"
import Welcome from "../../component/welcome/welcome.jsx"
import "./doctor.css"

const Doctorpage =() =>{
    return(
        <>
        <NavBar />
        <Welcome />
        <div className='align'>
        <Doctor/>
        </div>
        </>
    )
}
export default Doctorpage;