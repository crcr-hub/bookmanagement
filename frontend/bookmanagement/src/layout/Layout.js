import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../components/indexpages/Login'
import PrivateRoute from './PrivateRoute';
import UserHome from '../components/userpages/UserHome';
import Register from '../components/indexpages/Register';
import Home from '../components/indexpages/Home';


function Layout() {
  return (
   <Routes>
    <Route path='' element={<Home/>} />
    <Route path="loginpage" element={<Login/> } />
    <Route path='register' element={<Register/>} />
    <Route path='/userhome' element={<PrivateRoute><UserHome/></PrivateRoute>}/>
   </Routes>
  )
}

export default Layout
