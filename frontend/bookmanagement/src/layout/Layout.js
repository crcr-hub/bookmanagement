import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../components/indexpages/Login'
import PrivateRoute from './PrivateRoute';
import UserHome from '../components/userpages/UserHome';
import Register from '../components/indexpages/Register';
import Home from '../components/indexpages/Home';
import UserProfile from '../components/userpages/UserProfile';
import UserAddBook from '../components/userpages/UserAddBook';
import UesrMyBooks from '../components/userpages/UesrMyBooks';
import UserUpdateBook from '../components/userpages/UserUpdateBook';
import UserBookDetails from '../components/userpages/UserBookDetails';
import UserSubscription from '../components/userpages/UserSubscription';
import UserReadlist from '../components/userpages/UserReadlist';


function Layout() {
  return (
   <Routes>
    <Route path='' element={<Home/>} />
    <Route path="/loginpage" element={<Login/> } />
    <Route path='/register' element={<Register/>} />
    <Route path='/userhome' element={<PrivateRoute><UserHome/></PrivateRoute>}/>
    <Route path='/profile' element={<PrivateRoute><UserProfile/></PrivateRoute>} />
    <Route path='/addbook' element={<PrivateRoute><UserAddBook/></PrivateRoute>} />
    <Route path='/mybooks' element={<PrivateRoute><UesrMyBooks/></PrivateRoute>} />
    <Route path='/update/:bid' element={<PrivateRoute><UserUpdateBook/></PrivateRoute>} />
    <Route path='/book/:bid' element={<PrivateRoute><UserBookDetails/></PrivateRoute>} />
    <Route path='/subscription' element={<PrivateRoute><UserSubscription/></PrivateRoute>} />
    <Route path='/readlist' element={<PrivateRoute><UserReadlist/></PrivateRoute>} />
   </Routes>
  )
}

export default Layout
