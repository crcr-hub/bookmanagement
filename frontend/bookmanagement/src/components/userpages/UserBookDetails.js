import React, { useEffect } from 'react'
import UserNavbar from './UserNavbar'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import UserFooter from './UserFooter'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { bookDetail, subscribeBook } from '../../redux/authSlices'

function UserBookDetails() {
    const {bid} = useParams()
    const {user_details} = useSelector((state)=>state.auth)
    const {singlebook} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
        if(bid){
            dispatch(bookDetail(bid))
        }
        
    },[dispatch])

    const subscribeButton = async()=>{
        if (singlebook.book){
            await dispatch(subscribeBook(singlebook.book.id));
            await  dispatch(bookDetail(bid));
        }
       
    }

    const goToButton =()=>{
        navigate('/subscription')
    }
    const goToMyBook = ()=>{
        navigate('/mybooks')
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
        {/* <h2 className="text-primary">BOOK</h2> */}

    </div>
           
            <div className="card p-4">            
                    
                        <div className="row" style={{color:'black'}}>
                        <div
                                className="col-md-6"
                                style={{
                                   
                                    width: "320px",
                                    border: "1px solid grey", // thinner and grey
                                    marginTop: "30px",
                                    borderRadius: "8px", // optional: to match the image's rounded corners
                                    padding: "10px" // optional: space between image and border
                                }}
                                >
                                <img
                                    src={singlebook.book && singlebook.book.images ? `http://127.0.0.1:8000${singlebook.book.images}` : '/default-book.jpg'}
                                    alt="Preview"
                                    style={{
                                    height: "450px",
                                    width: "290px",
                                    borderRadius: "10px",
                                    position: "relative",
                                    marginTop: "10px"
                                    }}
                                />
                                {singlebook && singlebook.owner?
                                 (<button style={{
                                    width: "290px",
                                    backgroundColor: "#7B68EE", // soft green color
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
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#4169E1")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#7B68EE")}
                                onClick={goToMyBook}
                                >
                                Go to My Books </button>):
                                singlebook && singlebook.subscribed?
                                (

                                    <button style={{
                                        width: "290px",
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
                                    onMouseOver={(e) => (e.target.style.backgroundColor = "#F08080")}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                                    onClick={goToButton}
                                    >
                                    Go to Subscription </button> ) :
                                    (
                                        <button style={{
                                            width: "290px",
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
                                        onClick={subscribeButton}
                                        >
                                        Subscribe </button>
                                    )}
                             
                                </div>



                        <div className="col-md-6">
                                <div className="form-group" style={{height:'550px',marginTop:"50px",position: 'relative',marginLeft:"40px" }}>

                                                  <h3>{singlebook.book?.title? singlebook.book.title :"No Title availble Now"}</h3>   
                                                  <div>
                                                    <h6>by <span>{singlebook.book?.author? singlebook.book.author:"Author not available"}</span></h6>
                                                    <h6> <span>{singlebook.book?.description? singlebook.book.description:""}</span></h6>
                                                    </div>  
                                                    <div style={{ display: "flex", marginTop: "50px", gap: "20px", justifyContent: "center" }}>
                                                            {[
                                                                { label: "Publish Date", value: singlebook.book?.publicationDate || "" },
                                                                { label: "Language", value: singlebook.book?.language || "" },
                                                                { label: "No. Pages", value: singlebook.book?.nopage || "" }
                                                            ].map((item, index) => (
                                                                <div
                                                                key={index}
                                                                style={{
                                                                    border: '1px solid grey',
                                                                    width: "200px",
                                                                    height: "60px",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    fontFamily: "Arial, sans-serif", // use custom font here if needed
                                                                    padding: "5px"
                                                                }}
                                                                >
                                                                <p style={{ margin: "0", fontSize: "12px", color: "grey", fontWeight: "bold" }}>{item.label}</p>
                                                                <h6 style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: "normal" }}>{item.value}</h6>
                                                                </div>
                                                            ))}
                                            </div>             
                                </div>                                      
                            </div>
                            </div>   
            </div>
        </div>
      <UserFooter/>

    </div>
   
  </div>
  )
}

export default UserBookDetails
