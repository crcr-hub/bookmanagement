import React from 'react'
import Navbar from './Navbar'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import Carosel from './Carosel'
import RawPost from '../userpages/RawPost'
import UserFooter from '../userpages/UserFooter'

function Home() {
  return (
    <div
    style={{
      backgroundImage: `url(${bgimage1})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '100vh',
      overflow: 'hidden', // prevent body scroll
    }}
  >
    {/* Fixed Navbar */}
    <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      <Navbar />
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

<div >
        <Carosel/>
        <RawPost genre="Fiction" title="Fiction  Books" />
        <RawPost genre="Crime" title="Crime  Books" />
      </div>
      <UserFooter/>
    </div>
  </div>
  )
}

export default Home
