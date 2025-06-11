import React, { useEffect } from 'react'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'
import { useDispatch, useSelector } from 'react-redux'
import { addToReadlist, subscriptionList } from '../../redux/authSlices'
import { useNavigate } from 'react-router-dom'

function UserSubscription() {
    const {subscriptionBooks} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(subscriptionBooks)
    useEffect(()=>{
        dispatch(subscriptionList())
    },[dispatch])

    const handleGoButton = ()=>{
        navigate("/readlist")
    }
    const handleAddButton =async(bid)=>{
        await dispatch(addToReadlist(bid));
        await dispatch(subscriptionList())
    }
    const handlieClick =(bid)=>{
        navigate(`/book/${bid}`)
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
        <h2 className="text-primary">Subscribed BOOKS</h2>

    </div>
            <div className="card p-4">
                <div className="row" style={{color:'black'}}>
                {subscriptionBooks && subscriptionBooks.length > 0 ?(
                     subscriptionBooks.map((book, index) => (
                        <div key={book.id || index} className="col-md-3 mb-4">
                        <div className="card h-100"  >
                            <div style={{cursor:"pointer",height:"90%"}} onClick={()=> handlieClick(book.id)}>
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
                            <div>
                                {book.isinreadlist?(
                                         <button style={{
                                            width: "100%",
                                            backgroundColor: "#4B0082", // soft green color
                                            color: "white",
                                            padding: "10px 0",
                                            marginTop: "15px",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                            transition: "background-color 0.3s ease"
                                        }}
                                        onMouseOver={(e) => (e.target.style.backgroundColor = "#800080")}
                                        onMouseOut={(e) => (e.target.style.backgroundColor = "#4B0082")}
                                             onClick={handleGoButton}
                                        >
                                        Go to Readlist</button>
                                ):(
                                    <button style={{
                                        width: "100%",
                                        backgroundColor: "#4CAF50", // soft green color
                                        color: "white",
                                        padding: "10px 0",
                                        marginTop: "15px",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        transition: "background-color 0.3s ease"
                                    }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                                         onClick={()=>{
                                            handleAddButton(book.id)}}
                                    >
                                    Add to Readlist</button>
                                )}
                           
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

export default UserSubscription
