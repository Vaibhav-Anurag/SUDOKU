import React, {useState} from 'react'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import Puzzle from '../components/puzzle';



const Practice = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () =>{
    setIsOpen(!isOpen);
  }
  return (
    <>
    <div>
      <Sidebar isOpen = {isOpen} toggle = {toggle}/>
      <Navbar toggle= {toggle}/>
    </div>
      <Puzzle/>
    </>

  )
}

export default Practice