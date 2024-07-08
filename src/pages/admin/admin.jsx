import Admincom from "../../component/adminDashboard/AdminDashboard.jsx"
import Welcome from "../../component/welcome/welcome.jsx"
import Alldoctor from "../../component/alldoctor/alldoctor.jsx"

const admin =()=>{
    return(
        <>
          <Welcome />
          <Admincom />
          <Alldoctor />
          
        </>
    )
}

export default admin