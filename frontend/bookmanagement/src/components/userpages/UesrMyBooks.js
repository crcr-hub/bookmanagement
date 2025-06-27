import React, { useEffect, useState } from 'react'
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
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 4;
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = mybooks?.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(mybooks?.length / booksPerPage);
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
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
                  {currentBooks && currentBooks.length > 0 ? (
                    currentBooks.map((book, index) => (
                      <div key={book.id || index} className="col-md-3 mb-4">
                        <div className="card h-100" style={{cursor:"pointer"}} onClick={() => handleiClick(book.id)}>
                          <img src={book.images ? `https://bookapp.solutions${book.images}` : '/default-book.jpg'} className="card-img-top" alt={book.title}/>
                          <div className="card-body">
                            <h5 className="card-title">
                              {book.title.length > 25 ? book.title.substring(0,25) + '.......' : book.title}
                            </h5>
                            <p className="card-text">{book.author}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (<p> You are not Registered any Books</p>)}
                </div>


                {totalPages > 1 && (
  <div className="d-flex justify-content-center mt-4">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
        onClick={() => handlePageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
)}
            </div>
        </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UesrMyBooks
