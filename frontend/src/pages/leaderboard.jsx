import React, {useState, useEffect} from 'react'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import axios from 'axios';
import styled from 'styled-components';
import {COLOR} from '../components/colors'
import { setGlobalState } from '../components/states';

const baseUrl = import.meta.env.VITE_REACT_BACKEND || 'http://localhost:3001';

const LeaderboardStyle = styled.div`
    display: flex;
    flex-direction: column;
    padding-top:60px;
    align-items: center;
    text-align:center;
    height: 100vh;
    width: 100vw;
    position: absolute;
    font-size:20px;
    ul{
      list-style-type:none;
      position: relative;
      right:10px;
    }
    li:nth-child(2n+1){
      background:${COLOR.tertiaryColor};
      color:${COLOR.fourthColor};
    }
    li{
      padding:3px;
      font-weight:bold;
      border-radius:10px
    }
      .user-name{
      margin-right:30%;
      }
    @media(max-width:768px){
        font-size: .8em;
    }
    
`;

const BoardStyle =styled.div`
    width:50%;
    @media(max-width:768px){
        font-size: .8em;
        width:70%;
    }
`;

const Leaderboard = () => {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${baseUrl}/leaderboard`, {withCredentials:true})
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
        setGlobalState('isLoggedIn', true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
            setError('You are not authorized to view this content. Login to get access.');
        } else {
            setError('An error occurred while fetching data.');
        }
        console.error('Error fetching data:', error);
    });
  }, []);

 

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
    <LeaderboardStyle>
      <BoardStyle>
    <h1>Leaderboard</h1>
    {error ? ( // Check if there's an error
                        <div>{error}</div> // Display the error message
                    ) : (
    <ul>
    {users.length === 0 ? (
    <span>No one's here, you can be the first</span>
  ) : (
      users.map((item) => (
    <li key={item._id}>
      {item.user.map((userItem) => (
        <span key={userItem._id}><span className='user-name'>{userItem.name}:</span>:{item.time} </span>
      ))}
    </li>
  )))}
  </ul>
  )}
  </BoardStyle>
    </LeaderboardStyle>
    </>

  )
}

export default Leaderboard