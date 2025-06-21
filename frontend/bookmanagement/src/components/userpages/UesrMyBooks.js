import React, { useEffect } from 'react'
import UserFooter from './UserFooter';
import UserNavbar from './UserNavbar';
import bgimage1 from '../../assets/images/bgimage1.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { getMyBooks } from '../../redux/authSlices';
import { useNavigate } from 'react-router-dom';

function UesrMyBooks() {
    const {mybooks} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(mybooks)
    useEffect(()=>{
        console.log("tyeejkh")
        dispatch(getMyBooks())
    },[dispatch])
    const handleiClick =(bid)=>{
        navigate(`/update/${bid}`)

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
<div className="container mt-2" style={{marginBottom:"50px"}}>
    <div className="profile-header mb-4">
        <h2 className="text-primary">Your BOOKS</h2>

    </div>
            <div className="card p-4">
                <div className="row" style={{color:'black'}}>
                {mybooks && mybooks.length > 0 ?(
                     mybooks.map((book, index) => (
                        <div key={book.id || index} className="col-md-3 mb-4">
                        <div className="card h-100" style={{cursor:"pointer"}} onClick={() => handleiClick(book.id)}>
                            <img src={book.images ? `http://127.0.0.1:8000${book.images}` : '/default-book.jpg'} className="card-img-top" alt={book.title}/>
                            <div className="card-body">
                            <h5 className="card-title">{book.title.length > 25 ?(
                                book.title.substring(0,25) +'.......'
                            ):(
                                book.title
                            )}</h5>
                            <p className="card-text">{book.author}</p>
                            </div>
                        </div>
                        </div>
                    ))
                ):(<p> You are not Registered any Books</p>) }
                        </div>
            </div>
        </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UesrMyBooks
