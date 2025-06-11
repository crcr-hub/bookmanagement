import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser, userDetails } from '../../redux/authSlices'
import './button.css'

function UserNavbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user_details} = useSelector((state)=>state.auth)
    const handleLogout =()=>{
        dispatch(logoutUser(navigate))
    }
    const handleRegister =()=>{
        navigate('/addbook')
    }
    useEffect (()=>{
        dispatch(userDetails())
    },[dispatch])
  return (
    <nav className="navbar navbar-expand-lg" style={{backgroundColor: '#e3f2fd',marginTop:"5px"}}>
    <div className="container">
        <Link to="/userhome" className="navbar-brand">BooksAPP</Link>
        <div className="dropdown">
                <div className="dropdown-menu">
             
                </div>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <form className="d-flex" role="search">
            <input className="form-control me-2 " style={{ width: '400px ' }} type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
       

        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >
            <li className="nav-item">
            <Link className="nav-link " aria-current="page" to="">
          
            </Link>
            </li>




            <li className="nav-item">
            <Link className="nav-link" to="/addbook">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleRegister}>Register Your Book</button>
            </Link>
            </li>
             <li className="nav-item">
                        <Link className="nav-link " aria-current="page" to="">
                        <div style={{ position: "relative", display: "inline-block" }}>
                       
                  
                </div>
                        </Link>
                        </li>




              {/* <li className="nav-item dropdown position-relative">
              <div style={{ padding: "5px 10px", margin: "0 10px", display: "inline-block" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "grey",
                            cursor: "pointer",
                            marginTop: "5px",
                          }}
                          width="25"
                          height="25"
                          fill="currentColor"
                          className="bi bi-bell"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                        </svg>
                        
                  </div>
                              
            <ul className="dropdown-menu" data-bs-auto-close="false" 
            style={{width: "500px",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
              
                  
                 <span style={{marginLeft:"5px"}}>Notification</span>
                 
                  <li>
                 
                    
                  </li>
                  
                </ul>
            </li> */}



            <li className="nav-item dropdown">
           <div style={{border:"5px"}}>
             
                </div>
            </li>
            
            {/* <li className="nav-item">
           
            <button type="button" className="btn btn-secondary btn-sm nav-link"  onClick={handleLogout}>LogOut</button>
           
            </li> */}
            <li className="nav-item dropdown">
            <button 
            className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
             
             {user_details && user_details.name ? user_details.name : "user"}
            </button>
            <ul className="dropdown-menu" data-bs-auto-close="false">
              
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mybooks">
                      My Books
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/subscription">
                      Subscriptions
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/readlist">
                      Reading List
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                 
                  
                  <li>
                  <button class="cta" onClick={handleLogout} >
                            <span class="hover-underline-animation"> Logout </span>
                            <svg
                                id="arrow-horizontal"
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="10"
                                viewBox="0 0 46 16"
                            >
                                <path
                                id="Path_10"
                                data-name="Path 10"
                                d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                                transform="translate(30)"
                                ></path>
                            </svg>
                            </button>
                  </li>
                </ul>
            </li>
           
          
            <li className='nav-item'>
           

            </li>
           
           
        </ul>
       
        </div>
    </div>
</nav>
  )
}

export default UserNavbar
