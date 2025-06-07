import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../redux/authSlices'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import Carosel from '../indexpages/Carosel'
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'


function UserHome() {
    const dispatch = useDispatch()
    const handleLogout =()=>{
        dispatch(logoutUser())
    }
  return (
    <div
    style={{
      backgroundImage: `url(${bgimage1})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
     
      overflow: 'hidden', // prevent body scroll
    }}
  >
    {/* Fixed Navbar */}
    <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
    <UserNavbar/>
    </div>

    {/* Scrollable Content Below Navbar */}

   
    <div
      style={{
        marginTop: '50px', // adjust this based on your Navbar height
        height: 'calc(100vh - 50px)',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // optional for modern effect
        padding: '2rem',
        
      }}
    >

{/* <div style={{ minHeight: '200vh' }}> */}
<div>
        <Carosel/>
        <h2>Welcome to the Home Page</h2>
        <p>Scroll down to see the effect. The navbar and background remain fixed.</p>
        {/* Add your actual page content here */}
      </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UserHome
