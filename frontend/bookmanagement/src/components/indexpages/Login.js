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
    <MDBContainer className='my-5'>
    <MDBCard>
      <MDBRow className='g-0 d-flex align-items-center' style={{color:"black"}}>
        <MDBCol md='4'>
          <MDBCardImage src={image1} alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
        </MDBCol>
                    <MDBCol md='6'>
                    <div style={{ marginLeft: '100px' }} >
                    <h2 className="fw-bold mb-5">SignIn</h2>
                    <MDBCardBody >
                    <form onSubmit={handleSubmit}>
                        <MDBInput wrapperClass='mb-4' label='User Name' id='form1' type='text' value={username}
                    onChange={(e) => { 

                        if (backendError) {
                            setBackendError('')
                          }
                        setUsername(e.target.value)}} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password}
                    onChange={(e) => 
                    {
                        if (backendError) {
                            setBackendError('')
                          }
                    setPassword(e.target.value)}} />

                        <div className="d-flex justify-content-between mx-4 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                        <Link to={"/forgotpwd"}>Forgot password?</Link>
                        </div>
 
                        {backendError && (
                            <div className="alert alert-danger py-1 mb-2" role="alert">
                                {backendError}
                            </div>
                            )}
                <button type='submit'
                  className="btn btn-primary mb-4 w-100" 
                  style={{
                    transform: 'none',
                    boxShadow: 'none',
                    transition: 'none'
                  }}
                >
                  Sign in
                </button>
                <div className="text-center" >
                               <Link  to="/register"><p>Don't have an Account? SignUp Here</p></Link> 
                </div>
                    </form>
                    </MDBCardBody>
                    </div>
                    </MDBCol>

      </MDBRow>

    </MDBCard>
  </MDBContainer>
  </div>
  )
}

export default Login
