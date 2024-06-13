
import './App.css';
import React, { useState } from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages';
import Practice from './pages/practice';
import Sidebar from './components/sidebar';
import SignUp from './pages/signup'
import Login from './pages/login'
import Leaderboard from './pages/leaderboard'
import Logout from './pages/logout'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/logout' element = {<Logout/>}></Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
