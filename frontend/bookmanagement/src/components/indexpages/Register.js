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
                navigate('/loginpage')
              }
            
          }
        
      };
  
  return (
    <div>
        <Navbar />
       <div className="container-fluid my-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-0 align-items-center" style={{ marginTop: "-80px", position: "relative", color: 'black' }}>
            <div className="col-md-4" style={{ marginTop: "-100px" }}>
              <img src={image2} className="img-fluid rounded-4 shadow" alt="" style={{ height: "400px" }} />
            </div>

            <div className="col-md-7 offset-md-1">
              <div className="card my-5 p-4" style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                <div className="card-body text-center">
                  <h2 className="fw-bold mb-4">Sign Up</h2>

                  <div className="row mb-3">
                    <div className="col-md-4 mb-2">
                      <label className="form-label">
                        {errors.firstName ? <span className="text-danger">{errors.firstName}</span> : "First Name"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setUserData({ ...userData, firstName: e.target.value });
                          if (errors.firstName) setErrors({ ...errors, firstName: "" });
                        }}
                      />
                    </div>

                    <div className="col-md-4 mb-2">
                      <label className="form-label">
                        {errors.lastName ? <span className="text-danger">{errors.lastName}</span> : "Last Name"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={userData.lastName}
                        onChange={(e) => {
                          setUserData({ ...userData, lastName: e.target.value });
                          if (errors.lastName) setErrors({ ...errors, lastName: "" });
                        }}
                      />
                    </div>

                    <div className="col-md-4 mb-2">
                      <label htmlFor="genderSelect" className="form-label">
                        {errors.gender ? <span className="text-danger">{errors.gender}</span> : "Select Gender"}
                      </label>
                      <select
                        id="genderSelect"
                        className="form-select"
                        value={userData.gender}
                        onChange={(e) => {
                          setUserData({ ...userData, gender: e.target.value });
                          if (errors.gender) setErrors({ ...errors, gender: "" });
                        }}
                      >
                        <option value="">Choose..</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6 mb-2">
                      <label className="form-label">
                        {errors.place ? <span className="text-danger">{errors.place}</span> : "Place"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={userData.place}
                        onChange={(e) => {
                          setUserData({ ...userData, place: e.target.value });
                          if (errors.place) setErrors({ ...errors, place: "" });
                        }}
                      />
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="form-label">
                        {errors.email ? <span className="text-danger">{errors.email}</span> : "Email"}
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={userData.email}
                        onChange={(e) => {
                          setUserData({ ...userData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                      />
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="form-label">
                        {errors.mobile ? <span className="text-danger">{errors.mobile}</span> : "Mobile"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={userData.mobile}
                        onChange={(e) => {
                          setUserData({ ...userData, mobile: e.target.value });
                          if (errors.mobile) setErrors({ ...errors, mobile: "" });
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">
                      {errors.username ? <span className="text-danger">{errors.username}</span> : "Username"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={userData.username}
                      onChange={(e) => {
                        setUserData({ ...userData, username: e.target.value });
                        if (errors.username) setErrors({ ...errors, username: "" });
                      }}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">
                      {errors.password ? <span className="text-danger">{errors.password}</span> : "Password"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={userData.password}
                      onChange={(e) => {
                        setUserData({ ...userData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {errors.password2 ? <span className="text-danger">{errors.password2}</span> : "Repeat Password"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={userData.password2}
                      onChange={(e) => {
                        setUserData({ ...userData, password2: e.target.value });
                        if (errors.password2) setErrors({ ...errors, password2: "" });
                      }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Sign Up
                  </button>

                  <div className="text-center">
                    <Link to="/loginpage">Already have an account? Sign In Here</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
