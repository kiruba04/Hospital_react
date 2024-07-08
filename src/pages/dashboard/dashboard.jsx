import NavBar from "../../component/navbar/NavBar1.jsx"
import Profile from "../../component/profile/profile.jsx"
import Welcome from "../../component/welcome/welcome.jsx"
import './dashboard.css'

const dashboard =()=>
    {
    
        return (
            <>
            
            <NavBar />
            <Welcome />
            <div className='align'>
            <Profile />
            </div>
            
            </>
        )
    }
    
    export default dashboard