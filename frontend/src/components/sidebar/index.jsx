import React from 'react'
import styled from 'styled-components'
import {FaTimes} from  'react-icons/fa'
import {COLOR} from '../colors'
import {NavLink} from 'react-router-dom'
import { useGlobalState } from '../states'

const SidebarContainer = styled.aside`
  position: fixed;
  z-index:10;
  width:100%;
  height:100%;
  background: ${COLOR.tertiaryColor};
  display:grid;
  align-items:center;
  top:0;
  left:0;
  transition:0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
  top: ${({ isOpen })=>(isOpen ? '0' : '-100%') };
`;
const CloseIcon = styled(FaTimes)`
  position:fixed;
  right:15px;  
  top:36px;
  font-size: 3rem;
  color:${COLOR.primaryColor};
`;
const Icon = styled.div`
  position:absolute;
  top:1.2rem;
  right:1.5rem;
  background:transparent;
  font-size:2rem;
  cursor:pointer;
  outline:none;
`;

const SidebarWrapper=styled.div`
  color:${COLOR.primaryColor};
`;

const SidebarLink = styled(NavLink)`
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 1.5rem;
  text-decoration:none;
  list-style:none;
  transition: 0.2s ease-in-out;
  color: ${COLOR.primaryColor};
  cursor:pointer;

  &: hover{
    color:${COLOR.fourthColor};
    transition:0.2s ease-in-out;
  }
`;



const SideBtnWrap = styled.div`
    display:flex;
    justify-content: center;
    margin-top:20px;
`;

const SidebarRoute = styled(NavLink)`
  border-radius:50px;
  background: ${COLOR.fourthColor};
  white-space: nowrap;
  padding: 16px 64px;
  color: ${COLOR.primaryColor};
  font-size:16px;
  outline:none;
  border:none;
  cursor:pointer;
  transition: all 0.2s ease-in-out;
  text-decoration:none;
  &: hover{
    transition: all 0.2s ease-in-out;
    background: ${COLOR.primaryColor};
    color:${COLOR.fourthColor};
  }
`
const SidebarMenu = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6,80px);
  text-align:center;
  @media screem and (max-width:480px){
    grid-template-rows: repeat(6,60px);
  }
`

const Sidebar = ({isOpen, toggle}) => {

  const [isLoggedIn] = useGlobalState('isLoggedIn');
  return (
    <>
<SidebarContainer isOpen={isOpen} onClick={toggle}>
  <Icon onClick={toggle}>
    <CloseIcon/>
  </Icon>
  <SidebarWrapper>
    <SidebarMenu>
      <SidebarLink to="/">
        Home
      </SidebarLink>
      {/* <SidebarLink to="Solver">
        Solver
      </SidebarLink> */}
      <SidebarLink to="/leaderboard">
        Leaderboard
      </SidebarLink>
      {!isLoggedIn && <SidebarLink to ='/signup'>SignUp</SidebarLink>}
      <SidebarLink to ='/practice'>
        Practice
      </SidebarLink>
      {isLoggedIn && <SidebarLink to ='/logout'>Logout</SidebarLink>}
      <SideBtnWrap>
        {!isLoggedIn && <SidebarRoute to='/login'>Log-in</SidebarRoute>}
    </SideBtnWrap>
    </SidebarMenu>
  </SidebarWrapper>
</SidebarContainer>
    </>
  )
}

export default Sidebar
