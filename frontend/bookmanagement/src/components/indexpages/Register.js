import React, { useState } from 'react'
import Navbar from './Navbar';
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRow,
    MDBCol,
  }
  from 'mdb-react-ui-kit';
import { useDispatch } from 'react-redux';
import {  Link, useNavigate } from 'react-router-dom';
import image2 from '../../assets/images/image2.jpg'
import { registerUser } from '../../redux/authSlices';

function Register() {
    const dispatch = useDispatch()
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState('');
  const [userData,setUserData] = useState({
        username: "",
        password: "",
        password2 :"",
        email: "",
        role: "student",
        firstName: "",
        lastName: "",
        gender: "",
        username: "",
        place: "",
        mobile :""
      })
  const [errors, setErrors] = useState({});    
  const containsHTMLTags = (input) => /<[^>]*>/.test(input);
  const hasAlphabets = (text) => /[a-zA-Z]/.test(text);
  const hasLettersOrNumbers = (text) => /[a-zA-Z0-9]/.test(text);

  const validate = () => {
        let newErrors = {};
    
        if (!userData.firstName) {
          newErrors.firstName = "First name is required";}
        else if (containsHTMLTags(userData.firstName)){
          newErrors.firstName = "Invalid input (No HTML tags allowed)";

        }else if (!hasAlphabets(userData.firstName)) {
          newErrors.firstName = "First name must contain at least one alphabet";
        } 
        if (!userData.lastName) {newErrors.lastName = "Last name is required";}
        else if (containsHTMLTags(userData.lastName)) {
          newErrors.lastName = "Invalid input (No HTML tags allowed)";
      }else if (!hasAlphabets(userData.lastName)) {
        newErrors.lastName = "Last name must contain at least one alphabet";
      } 
      
        if (userData.gender === "") newErrors.gender = "Gender is required";
        if (!userData.username) {newErrors.username = "Username is required";}
        else if(!hasLettersOrNumbers(userData.username)){
          newErrors.username = "Username must contain a character";
        }
        if (!userData.place) {newErrors.place = "Place is required";}
        else if (!hasLettersOrNumbers(userData.place)){
          newErrors.place = "Place must contain a Character"
        }
        if (!userData.mobile){newErrors.mobile = "Mobile number is required";} 
        else if (!/^\d{10}$/.test(userData.mobile)){newErrors.mobile = "Mobile number must be 10 digits";} 
        
        if (!userData.email) {newErrors.email = "Email is required";}
        else if (!/\S+@\S+\.\S+/.test(userData.email)) {newErrors.email = "Enter a valid email";}
        if (!userData.password){ newErrors.password = "Password is required";}
        else if (userData.password.length < 8) {newErrors.password = "Password must be at least 8 characters";}
        if (userData.password !== userData.password2) newErrors.password2 = "Passwords do not match";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Valid if no errors
      };

  const handleSubmit =  async(e) => {
        e.preventDefault();
        setBackendError('');
        if (validate()) {
            
            const resultAction = await dispatch(registerUser(userData));
            if (registerUser.rejected.match(resultAction)) {
                const payload = resultAction.payload;
                // Display backend error (could also check for specific fields like username or email)
                let newErrors = {};
                if (payload?.detail) {
                    setBackendError(payload.detail);
                  }
            
                  if (payload?.username) {
                    newErrors.username = payload.username[0];  
                  }
            
                  if (payload?.email) {
                    console.log("yes email", payload.email[0])
                    newErrors.email = payload.email[0]; 
                  }
            
                  if (payload?.password) {
                    newErrors.password = payload.password[0];
                  }
            
                  if (payload?.password2) {
                    newErrors.password2 = payload.password2[0];
                  }
                  setErrors(newErrors)
              } else {
                navigate('loginpage')
              }
            
          }
        
      };
  
  return (
    <div>
        <Navbar/>
       <MDBContainer fluid className='my-5'>
 <form onSubmit={handleSubmit}>
      <MDBRow className='g-0 align-items-center'  style={{ marginTop: "-80px", position: "relative" }}>
        
        
      <MDBCol col='4' style={{marginTop:"-100px"}}>
          <img  src={image2} class="w-55 rounded-4 shadow-4" alt="" fluid style={{height:"400px"}}/>
        </MDBCol>
        
        
        <MDBCol md='7'>

          <MDBCard className='my-5 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)',  backdropFilter: 'blur(30px)'}}>
            <MDBCardBody className='p-1 shadow-5 text-center' > 
              <h2 className="fw-bold mb-5">SignUp</h2>
              <MDBRow>
                <MDBCol col='4'>
              
                  <MDBInput wrapperClass='mb-2' label=
                            {
                              errors.firstName ? (
                                <span style={{ color: "red" }}>{errors.firstName}</span>
                              ) : (
                                "First Name"
                              )
                            }
      onChange={(e)=>{setUserData({...userData, firstName:e.target.value});
      if (errors.firstName) {
        setErrors({ ...errors, firstName: "" });
      }
      }} type='text' />
       
                </MDBCol>

                <MDBCol col='4'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.lastName ? (
                                <span style={{ color: "red" }}>{errors.lastName}</span>
                              ) : (
                                "Last Name"
                              )
                            } value={userData.lastName} 
      onChange={(e) => {setUserData({...userData,lastName:e.target.value})
                            if (errors.lastName){
                                setErrors({...errors,lastName:""})
                            }
                            
      
      }} id='form2' type='text'/>
                </MDBCol>



                <MDBCol col="4">
      <div className="mb-2">
        
        <select
          id="genderSelect"
          className="form-select"
          value={userData.gender} 
      onChange={(e) => {setUserData({...userData,gender:e.target.value})
      if (errors.gender){
        setErrors({...errors,gender:""})
       }
      }} >
          <option value="">
         Choose..
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="genderSelect" className="form-label">
        {
                              errors.gender ? (
                                <span style={{ color: "red" }}>{errors.gender}</span>
                              ) : (
                                "Select Gender"
                              )
                            }
        </label>
      </div>

    
    </MDBCol>

              </MDBRow>
              <MDBRow>
              






                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.place ? (
                                <span style={{ color: "red" }}>{errors.place}</span>
                              ) : ("Place")
                            }  value={userData.place}
                          onChange={(e)=> {setUserData({...userData,place:e.target.value});
                          if (errors.place){
                            setErrors({...errors,place:""})
                          }
                          }} id='form2' type='text'/>
                </MDBCol>
              
                <MDBCol col='4'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.email ? (<span style={{ color: "red" }}>{errors.email}</span>
                              ) : ("Email")
                            } value={userData.email} 
      onChange={(e) => {setUserData({...userData,email:e.target.value});
      if(errors.email){
        setErrors({...errors,email:""})
      }
      }} id='form1' type='email'/>
                </MDBCol>

                <MDBCol col='4'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.mobile ? (<span style={{ color: "red" }}>{errors.mobile}</span>
                              ) : ("Mobile")
                            }  value={userData.mobile} 
      onChange={(e) => {setUserData({...userData, mobile:e.target.value});
      if(errors.mobile){
        setErrors({...errors,mobile:""})
      }
      }} id='form2' type='text'/>
                </MDBCol>
              </MDBRow>

              <MDBInput wrapperClass='mb-2' label= {
                              errors.username ? (
                                <span style={{ color: "red" }}>{errors.username}</span>
                              ) : ( "Username")
                            }  value={userData.username} 
      onChange={(e) => {setUserData({...userData,username:e.target.value});
      if(errors.username){
        setErrors({...errors,username:""})
      }
      }} id='form3' type='text'/>
              <MDBInput wrapperClass='mb-2' label={
                              errors.password ? (
                                <span style={{ color: "red" }}>{errors.password}</span>
                              ) : ( "Password")
                            } value={userData.password} 
      onChange={(e) => {setUserData({...userData,password:e.target.value});
      if(errors.password){
        setErrors({...errors,password:""})
      }
      }} id='form4' type='password'/>
      <MDBInput wrapperClass='mb-2' label={
                              errors.password2 ? (
                                <span style={{ color: "red" }}>{errors.password2}</span>
                              ) : ( "Repeat Password")
                            } value={userData.password2} 
      onChange={(e) => {setUserData({...userData,password2:e.target.value});
      if(errors.password2){
        setErrors({...errors,password2:""})
      }
      }} id='form4' type='password'/>
 
        <button className="btn btn-primary w-100 mb-2" style={{ height: '40px' }}>
          Sign Up
        </button>

              {/* <MDBBtn className='w-100 mb-2' size='md'>sign up</MDBBtn> */}

              <div className="text-center">

               <Link  to="/loginpage"><p>Already have Account? SignIn Here</p></Link> 

               

              </div>

            </MDBCardBody>
          </MDBCard>
        </MDBCol>

       

      </MDBRow>
      </form>

    </MDBContainer>
    </div>
  )
}

export default Register
