import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{backgroundColor: '#e3f2fd'}}>
    <div className="container">
        <Link to="/" className="navbar-brand">BooksAPP</Link>
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
            <Link to='/teacherregister' className="nav-link " aria-current="page" >
           
            </Link>
            </li>
            
            <li className="nav-item">
            <Link className="nav-link " aria-current="page" to="/">
            
            </Link>
            </li>

           




            <li className="nav-item">
            <Link className="nav-link" to="/loginpage">
            <button type="button" className="btn btn-outline-secondary btn-sm">LogIn</button>
            </Link>




            
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/register">
            <button type="button" className="btn btn-secondary btn-sm">SignUp</button>
            </Link>
            </li>
           
           
        </ul>
       
        </div>
    </div>
</nav>

  )
}

export default Navbar
