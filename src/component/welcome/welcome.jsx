
import '../first/first.css'
import './welcome.css';

const welcome =() =>{
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return(
        <>
        <div className='animated-text-wel text'>
      Welcome,
      </div>
      <div className='animated-text-2-wel text-success text'> 
      {storedUser.username}!
      </div>
      </>
    )
}

export default welcome