import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/authSlices';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import image1 from '../../assets/images/image1.jpg'
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox
  }
  from 'mdb-react-ui-kit';

function Login() {
  const [username, setUsername] = useState('');  // Local state for email
  const [password, setPassword] = useState('');  // Local state for password
const [backendError, setBackendError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleSubmit =async(e)=>{
        e.preventDefault();
        setBackendError(''); // Clear previous error

            try {
                await dispatch(loginUser({ username, password, navigate })).unwrap();
                // navigate happens inside thunk on success
            } catch (error) {
                // error will be what you returned from rejectWithValue
                if (error?.detail) {
                setBackendError(error.detail); // e.g., "No active account found"
                } else {
                setBackendError("Login failed. Please try again.");
                }
            }
    }
  return (
    <div>
        <Navbar/>
        <div className="container my-5">
        <div className="card">
          <div className="row g-0 align-items-center" style={{ color: 'black' }}>
            <div className="col-md-4">
              <img src={image1} alt="phone" className="img-fluid rounded-start" style={{width:"90%"}} />
            </div>

            <div className="col-md-6 offset-md-1">
              <div style={{ marginLeft: '40px' }}>
                <h2 className="fw-bold mb-4">Sign In</h2>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="form1" className="form-label">User Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="form1"
                        value={username}
                        onChange={(e) => {
                          if (backendError) setBackendError('');
                          setUsername(e.target.value);
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="form2" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="form2"
                        value={password}
                        onChange={(e) => {
                          if (backendError) setBackendError('');
                          setPassword(e.target.value);
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberCheck" />
                        <label className="form-check-label" htmlFor="rememberCheck">
                          Remember me
                        </label>
                      </div>
                      <Link to="/forgotpwd" className="text-decoration-none">Forgot password?</Link>
                    </div>

                    {backendError && (
                      <div className="alert alert-danger py-1 mb-3" role="alert">
                        {backendError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                      style={{
                        transform: 'none',
                        boxShadow: 'none',
                        transition: 'none'
                      }}
                    >
                      Sign in
                    </button>

                    <div className="text-center">
                      <Link to="/register" className="text-decoration-none">
                        Don't have an Account? Sign Up Here
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  </div>
  )
}

export default Login
