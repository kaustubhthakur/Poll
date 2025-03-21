import React from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/homepage/HomePage'
import RegisterPage from './pages/registerpage/RegisterPage'
import LoginPage from './pages/loginpage/LoginPage'
import Profile from './components/profile/Profile'
import CreatePoll from './components/createpoll/CreatePoll'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/registerpage' element={<RegisterPage/>} />
      <Route path='/loginpage' element={<LoginPage/>} />
      <Route path='/profile' element={<Profile/>} />
     <Route path='/createpoll' element={<CreatePoll/>} />
    </Routes>
  )
}

export default App