import React, { useEffect } from 'react'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import { useDispatch, useSelector } from 'react-redux';
import bgimage1 from '../../assets/images/bgimage1.jpg'
import { getReadList, moveDown, moveUp, removeReadlist } from '../../redux/authSlices';
import { useNavigate } from 'react-router-dom';

function UserReadlist() {
    const {readList} = useSelector((state)=>state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(readList)
    useEffect(()=>{
        dispatch(getReadList())
    },[dispatch])

    const handleMoveUp = async (bookId) => {
        try {
          await dispatch(moveUp(bookId));      // Dispatch the async thunk
          await dispatch(getReadList());       // Refresh the list to get updated order
        } catch (error) {
          console.error('Move up failed:', error);
        }
      };
      
      const handleMoveDown = async(bookId) => {
        try {
            await dispatch(moveDown(bookId));      // Dispatch the async thunk
            await dispatch(getReadList());       // Refresh the list to get updated order
          } catch (error) {
            console.error('Move up failed:', error);
          }
      };
      
      const handleRemove = async(bookId) => {
        try {
            await dispatch(removeReadlist(bookId));      
            await dispatch(getReadList());       
          } catch (error) {
            console.error('Move up failed:', error);
          }
      };

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
  <h2 className="text-primary">Your List</h2>
</div>

<div className="card p-4">
  <div className="row" style={{ color: 'black' }}>
  {readList && readList.length > 0 ? (
    [...readList]
      .sort((a, b) => a.number - b.number)
      .map((item, index) => (
        <div className="col-md-12 mb-3" key={item.book.id}>
          <div className="d-flex align-items-center justify-content-between border p-3 rounded">
            <div className="d-flex align-items-center">
                <div style={{marginRight:"5px"}}>
                {item.number}
                </div>
            
              <img  onClick={()=> handlieClick(item.book.id)}
                src={
                  item.book.images
                    ? `http://127.0.0.1:8000${item.book.images}`
                    : '/default-book.jpg'
                }
                alt={item.book.title}
                style={{
                  width: '60px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                  marginRight: '15px',
                  cursor:"pointer"
                }}
              />
              <div>
                <h5 className="mb-1">{item.book.title}</h5>
                <p className="mb-0">Author: {item.book.author}</p>
                
              </div>
            </div>
            <div className="d-flex flex-column align-items-end gap-2">
              <button
                className="btn btn-sm btn-primary"
                disabled={index === 0}
                onClick={() => handleMoveUp(item.book.id)}
              >
                ↑ Move Up
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={index === readList.length - 1}
                onClick={() => handleMoveDown(item.book.id)}
              >
                ↓ Move Down
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemove(item.book.id)}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        </div>
      ))
  ) : (
    <p className="text-muted">You haven't added any books to your Readlist yet.</p>
  )}
  </div>
</div>
        </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UserReadlist
