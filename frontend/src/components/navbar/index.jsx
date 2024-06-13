import React from 'react';
import {FaBars} from 'react-icons/fa';
import styled from 'styled-components';
import {COLOR} from '../colors'
import sudokuImg from '../../assets/images/sudoku.png'
import { NavLink } from 'react-router-dom';


const BarIcon = styled.div`
  position: fixed;
  right:15px;  
  top:0px;
  font-size: 3.3rem;
  vertical-align:middle;
  color:${COLOR.secondaryColor};
  @media screen and (max-width: 768px){
    font-size: 2rem;
    top:32px;
  }
    z-index:2;
`;

const Logo = styled(NavLink)`
  position: fixed;
  left: 0px;
  top:0px;
  font-size:3.3rem;
  display:flex;
  text-decoration:none;
  align-items:center;
  vertical-align:middle;
  color: ${COLOR.secondaryColor};
  font-weight: bold;
  @media screen and (max-width: 768px){
    font-size: 2rem; 
    justify-content: flex-start;
  }
  z-index:2;
`

const SudokuLogo = () =>{
  return(
    
    <img src={sudokuImg} style={{height:"110px", width:"110px", padding: "0px", marginRight:"0px"}}/>

  )
};
const Navbar = ({toggle}) => {
  return (
    <div style={{height:'10px'}}>
    <Logo to='/'><SudokuLogo/>SUDOKU</Logo>
    <BarIcon onClick={toggle}>
    <FaBars />
    </BarIcon>
    </div>
  )
};

export default Navbar
