import React, { useEffect, useState } from 'react'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import { useDispatch, useSelector } from 'react-redux';
import bgimage1 from '../../assets/images/bgimage1.jpg'
import { addReadlistTitle, deleteReadList, getReadList, getReadlistTitle, getSingleReadList, moveDown, moveUp, removeReadlist, updateReadList } from '../../redux/authSlices';
import { Link, useNavigate } from 'react-router-dom';

function UserReadlist() {
    const {readList} = useSelector((state)=>state.auth)
    const {readlistTitle} = useSelector((state)=>state.auth)
    const [activeTitleId, setActiveTitleId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalName, setShowModalName] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [titleId,setTitleId] = useState(null);
    const [renameError, setRenameError] = useState('');

  console.log("readlinst",readList,newTitle)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getReadList())
        dispatch(getReadlistTitle())
    },[dispatch])
    
    const handleClick =(tid) =>{
      setActiveTitleId(tid);
      dispatch(getSingleReadList(tid))
    }

    useEffect(() => {
      if (readlistTitle?.length > 0 && !activeTitleId) {
        setActiveTitleId(readlistTitle[0].id);
      }
    }, [readlistTitle]);

    const handleMoveUp = async (bookId,titleId) => {
        try {
          const newItem = {bid : bookId,titleId:titleId}
          await dispatch(moveUp(newItem));      // Dispatch the async thunk
          await dispatch(getSingleReadList (titleId));     // Refresh the list to get updated order
        } catch (error) {
          console.error('Move up failed:', error);
        }
      };
      
      const handleMoveDown = async(bookId,titleId) => {
        try {
          const newItem = {bid : bookId,titleId:titleId}
            await dispatch(moveDown(newItem));      // Dispatch the async thunk
            await dispatch(getSingleReadList (titleId));       // Refresh the list to get updated order
          } catch (error) {
            console.error('Move up failed:', error);
          }
      };
      
      const handleRemove = async(bookId,titleId) => {
        try {
            await dispatch(removeReadlist(bookId));      
            await dispatch(getSingleReadList (titleId));      
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
<div style={{display:"flex"}}>
<aside className='col-md-2'>
                <div className='card'>
                    <h5 className='card-header'>Saved List</h5>
                    <div className='list-group list-group-flush'>
                    {readlistTitle && readlistTitle.length > 0 ?(

                            readlistTitle.map((list, index) => (
                              <div
                                key={list.id}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeTitleId === list.id ? 'active' : ''}`}
                                onClick={() => handleClick(list.id)}
                              >
                                <span style={{ cursor: "pointer" }}>{list.title}</span>

                                <div className="position-relative">
                                  <button
                                    className="btn btn-sm btn-light"
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();  // prevent triggering list click
                                      setOpenDropdownId(openDropdownId === list.id ? null : list.id);  // toggle
                                    }}
                                  >
                                    ⋮
                                  </button>

                                  {openDropdownId === list.id && (
                                    <ul
                                      className="dropdown-menu show"
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 30,
                                        zIndex: 999
                                      }}
                                    >
                                      <li>
                                        <button className="dropdown-item" onClick={(e) => {
                                          e.stopPropagation();
                                          setShowModalName(true)
                                          setTitleId(list.id)
                                          setOpenDropdownId(null);
                                          // handleRename(list.id)
                                        }}>
                                          ✏️ Change Name
                                        </button>
                                      </li>
                                      <li>
                                        <button className="dropdown-item text-danger" onClick={async(e) => {
                                          e.stopPropagation();
                                          await dispatch(deleteReadList(list.id));
                                          await dispatch(getReadList())
                                          await dispatch(getReadlistTitle())
                
                                          setOpenDropdownId(null);
                                          // handleDelete(list.id)
                                        }}>
                                          🗑 Delete
                                        </button>
                                      </li>
                                    </ul>
                                  )}
                                </div>
                              </div>
                              ))
                    ):("")   
                            }

                      <Link
                        className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                        onClick={() => setShowModal(true)}
                      >
                        NewList <span className="fw-bold">+</span>
                      </Link>
                    </div>
                   
                </div>
            </aside>
<div className="card p-4">
  <div className="row" style={{ color: 'black',width:"990px" }}>
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
                    ? `https://booksapp.in${item.book.images}`
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
              <div style={{width:"90%"}}>
                <h5 className="mb-1">{item.book.title}</h5>
                <p className="mb-0">Author: {item.book.author}</p>
                
              </div>
            </div>
            <div className="d-flex flex-column align-items-end gap-2" style={{width:"25%"}}>
              <button
                className="btn btn-sm btn-primary"
                disabled={index === 0}
                onClick={() => handleMoveUp(item.book.id,item.title)}
              >
                ↑ Move Up
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={index === readList.length - 1}
                onClick={() => handleMoveDown(item.book.id,item.title)}
              >
                ↓ Move Down
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemove(item.book.id,item.title )}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        </div>
      ))
  ) : (
    <div className="col-md-12 mb-3" style={{width:"800px"}}>
      <p className="text-muted">No Books Found.</p>
    </div>
    
  )}
  </div>
</div>
</div>
{showModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add New Readinglist</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new list title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button
                className="btn btn-primary"
                onClick={async () => {
                  const newItem = { title: newTitle };
                  try {
                    const result = await dispatch(addReadlistTitle(newItem));
                    if (result.payload && result.payload.id) {
                      await dispatch(getReadlistTitle());
                      await dispatch(getSingleReadList(result.payload.id))
                      setActiveTitleId(result.payload.id);
                    }     
                    setNewTitle('');
                    setShowModal(false);
                  } catch (error) {
                    console.error('Failed to add title:', error);
                  }
                }}
              >
                Add
              </button>

        </div>
      </div>
    </div>
  </div>
)}

{showModalName && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Change Readinglist Name</h5>
          <button type="button" className="btn-close" onClick={() => setShowModalName(false)}></button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new list title"
            value={newTitle}
            onChange={(e) => {setNewTitle(e.target.value)
              if (renameError){
                setRenameError("")
              }
            }}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => {setShowModalName(false)
            setNewTitle('');
            if (renameError){
              setRenameError("")
            }
          }}>Cancel</button>
          <button
                className="btn btn-primary"
                onClick={async () => {
                  const newItem = { title: newTitle, titleId: titleId };
                  setRenameError(''); // Reset previous error
                  try {
                    const result = await dispatch(updateReadList(newItem));
                    console.log("payload",result.payload)
                    if (result.payload?.error) {
                      setRenameError(result.payload.error);
                    } else if (result.payload?.id) {
                      await dispatch(getReadlistTitle());
                      await dispatch(getSingleReadList(result.payload.id));
                      setActiveTitleId(result.payload.id);
                      setNewTitle('');
                      setShowModalName(false);
                    }
                  } catch (error) {
                    setRenameError('Something went wrong.');
                    console.error('Failed to update title:', error);
                  }
                }}
              >
                Update
              </button>
              {renameError && (
                <div className="text-danger mt-2">
                  {renameError}
                </div>
              )}

        </div>
      </div>
    </div>
  </div>
)}



        </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UserReadlist
