
import React from 'react'
import {Route , Routes} from 'react-router-dom'
import Home from "./pages/home/home"
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Register from './pages/register/Register'



export default function Router() {

  return (
    <>
    <Routes>
    <Route exact path='/' element={<Home/>}/>
    <Route exact path="/timeline/:username" element={<Profile/>}/>
    <Route exact path="/login" element={<Login/>}/>
    <Route exact path="/register" element={<Register/>}/>
    </Routes>
    </>
  )
}
