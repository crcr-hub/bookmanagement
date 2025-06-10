import React, { useEffect, useState } from 'react'
import UserNavbar from './UserNavbar'
import { useDispatch, useSelector } from 'react-redux'
import {  updateUserProfile, userProfile } from '../../redux/authSlices'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import UserFooter from './UserFooter'

export default function UserProfile() {

    const {user_profile} = useSelector((state)=>state.auth)
    const [isEditing, setIsEditing] = useState(false)
    const [isPwdEditing, setIsPwdEditing] = useState(false)

    const [profileData, setProfileData] = useState({
      
        firstName: "",
        lastName: "",
        gender: "",
        email : "",
        place: "",
        mobile: "",
    })
    console.log("profile",profileData)
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    })

    const [originalProfileData, setOriginalProfileData] = useState({
       
        firstName: '',
        lastName: '',
        place: "",
        email: "",
        gender: "",
        mobile: "",
    })

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(userProfile()); // Fetch profile data on mount
    }, [dispatch])

    useEffect(() => {
        if (user_profile) {
            const initialProfileData = {
                
                firstName: user_profile.firstName || '',
                lastName: user_profile.lastName || '',
                place: user_profile.place || "",
                gender: user_profile.gender || "",
                email: user_profile.email || "",
                mobile: user_profile.mobile || "",
            }

            setProfileData(initialProfileData)
            setOriginalProfileData(initialProfileData)
        }
    }, [user_profile])

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const [errors, setErrors] = useState({})
    const containsHTMLTags = (input) => /<[^>]*>/.test(input)
    const hasAlphabets = (text) => /[a-zA-Z]/.test(text);
    const hasLettersOrNumbers = (text) => /[a-zA-Z0-9]/.test(text);

    const validate = () => {
        let newErrors = {}

        if (!profileData.firstName) {
            newErrors.firstName = "First name is required"
        } else if (containsHTMLTags(profileData.firstName)) {
            newErrors.firstName = "Invalid input (No HTML tags allowed)"
        }else if (!hasAlphabets(profileData.firstName)){newErrors.firstName = "First name must contain at least one alphabet";}

        if (!profileData.lastName) {
            newErrors.lastName = "Last name is required"
        } else if (containsHTMLTags(profileData.lastName)) {
            newErrors.lastName = "Invalid input (No HTML tags allowed)"
        }else if (!hasAlphabets(profileData.lastName)){newErrors.lastName = "Last name must contain at least one alphabet";}

        if (profileData.gender === "") newErrors.gender = "Gender is required"
        if (!profileData.email) {newErrors.email = "Email is required"}
        else if (!/\S+@\S+\.\S+/.test(profileData.email)) {newErrors.email = "Enter a valid email";}
        if (!profileData.place) {newErrors.place = "Place is required"}
        else if(!hasLettersOrNumbers(profileData.place)){newErrors.place = "Place Must Contain a character"}
        if (!profileData.mobile) {
            newErrors.mobile = "Mobile number is required"
        } else if (!/^\d{10}$/.test(profileData.mobile)) {
            newErrors.mobile = "Mobile number must be 10 digits Number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // Valid if no errors
    }

    const handleSaveClick = async () => {
        if (validate()) {
            try {
                const result = await dispatch(updateUserProfile(profileData))

                if (updateUserProfile.fulfilled.match(result)) {
                    await dispatch(userProfile())
                    setOriginalProfileData(profileData)
                    setIsEditing(false)
                } else {
                    console.error("Update failed:", result)
                    const payload = result.payload;
                    // Display backend error (could also check for specific fields like username or email)
                    let newErrors = {};
                    
                
                      if (payload?.firstName) {
                        newErrors.firstName = payload.firstName[0];  
                      }
                
                      if (payload?.email) {
                        newErrors.email = payload.email[0]; 
                      }
                
                      if (payload?.lastName) {
                        newErrors.lastName = payload.lastName[0];
                      }
                
                      if (payload?.place) {
                        newErrors.place = payload.place[0];
                      }
                      if (payload?.mobile){
                        newErrors.mobile = payload.mobile[0];
                      }
                      setErrors(newErrors)
                    
                }
            } catch (error) {
                console.error("An error occurred:", error)
            }
        }
    }

    const handleCancelClick = () => {
        setIsEditing(false)
        setProfileData(originalProfileData) // Revert changes back to the original data
        setErrors({})
    }

    const handleChangePwdClick = () => {
        setIsPwdEditing(true)
    }

    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            setErrors({ ...errors, password: "Passwords do not match" });
            return;
        }
    
        // try {
        //     const result = await dispatch(changePassword(passwordData));
    
        //     if (changePassword.fulfilled.match(result)) {
        //         setIsPwdEditing(false);
        //         setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        //         setErrors({});
    
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Success!',
        //             text: 'Password changed successfully',
        //             toast: true,
        //             position: 'top-end',
        //             timer: 3000,
        //             showConfirmButton: false,
        //         });
    
        //         dispatch(logoutUser()); // Logout only after success
        //     } else {
        //         throw new Error(result.payload?.error || 'Failed to change password');
        //     }
        // } catch (err) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: err.message || 'Something went wrong',
        //         toast: true,
        //         position: 'top-end',
        //         timer: 4000,
        //         showConfirmButton: false,
        //    });
        //}
    };
    
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

      <div className="container mt-2" style={{marginBottom:"50px"}}>
    <div className="profile-header mb-4">
        <h2 className="text-primary">Profile</h2>

    </div>
           
            <div className="card p-4 " >
                <div className="row mb-3" style={{color:'black'}}>



                    {isPwdEditing ? (
                        <div className="col-md-12">
                            <h4>Change Password</h4>
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="currentPassword"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={passwordData.confirm_password}
                                    onChange={(e) =>{ setPasswordData({ ...passwordData, confirm_password: e.target.value });
                                    setErrors({});
                                
                                }}
                                />
                            </div>
                            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                            <div className="text-center mt-4">
                                <button className="btn btn-success" onClick={handleChangePassword}>
                                    Change Password
                                </button>
                                <button className="btn btn-secondary ms-2" onClick={() => {setIsPwdEditing(false);
                                    setErrors({});
                                    setPasswordData({confirm_password:"",new_password:"",current_password:"" })
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    
                
                
                ) : (
                    <>
                      <h4>View and Update Your Details</h4>
                        <div className="col-md-5">
                            {/* Profile Form */}
                            <div className="form-group">
                         <label htmlFor="firstName" className="form-label fs-6">

                                { errors.firstName ? (
                                <span style={{ color: "red" }}>{errors.firstName}</span>
                                ) : (
                                "First Name"
                                )
                                }
                            </label>
                            {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, firstName: e.target.value });
                                                if (errors.firstName) {
                                                    setErrors({ ...errors, firstName: "" });
                                                  }
                                            }}
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.firstName}</p>
                                    )}
                            </div>

                        </div>


                        <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.lastName ? (
                                <span style={{ color: "red" }}>{errors.lastName}</span>
                              ) : (
                                "Last Name"
                              )
                            }
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, lastName: e.target.value });
                                                if (errors.lastName){
                                                    setErrors({...errors,lastName:""})
                                                }
                                           } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.lastName}</p>
                                    )}
                                </div>
                            </div>



                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.gender ? (
                                <span style={{ color: "red" }}>{errors.gender}</span>
                              ) : ( "Gender")
                            }
                                    </label>
                                    {isEditing ? (
                                         <select id="inputState" className="form-select" name="gender" value={profileData.gender} 
                                         onChange={(e) => {setProfileData({...profileData,gender:e.target.value});
                                         if (errors.gender){
                                            setErrors({...errors,gender:""})
                                           }
                                         }}>
                                         <option value="">Choose...</option>
                                         <option value="Male">Male</option>
                                         <option value="Female">Female</option>
                                         </select>
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.gender}</p>
                                    )}
                                </div>
                            </div>







                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">

                                    {
                              errors.place ? (<span style={{ color: "red" }}>{errors.place}</span>
                              ) : ("Place")
                            }
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.place}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, place: e.target.value });
                                                if(errors.place){
                                                    setErrors({...errors,place:""})
                                                  }
                                            } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.place}</p>
                                    )}
                                </div>
                            </div>


                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.email ? (
                                <span style={{ color: "red" }}>{errors.email}</span>
                              ) : ("Email")
                            } 
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.email}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, email: e.target.value });
                                                if (errors.email){
                                                    setErrors({...errors,email:""})
                                                  }
                                           } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.email}</p>
                                    )}
                                </div>
                            </div>

                                <div className="col-md-5">
                                    <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.mobile ? (<span style={{ color: "red" }}>{errors.mobile}</span>
                              ) : ("Mobile")
                            }
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.mobile}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, mobile: e.target.value });
                                                if(errors.mobile){
                                                    setErrors({...errors,mobile:""})
                                                  }
                                           } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.mobile}</p>
                                    )}
                                </div>
                            </div>
                        



                            {/* Rest of the profile fields */}
                            <div className="text-center mt-4">
                                {isEditing ? (
                                    <>
                                        <button className="btn btn-success" onClick={handleSaveClick}>
                                            Save Changes
                                        </button>
                                        <button className="btn btn-secondary ms-2" onClick={handleCancelClick}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-primary" onClick={handleEditClick}>
                                            Edit Profile
                                        </button>
                                        <button className="btn btn-primary ms-2" onClick={handleChangePwdClick}>
                                            Change Password
                                        </button>
                                    </>
                                )}
                            </div>
                        
                            </>
                    
                    )}
                </div>
            </div>
        </div>
        <UserFooter/>
        </div>
    </div>
  )
}
