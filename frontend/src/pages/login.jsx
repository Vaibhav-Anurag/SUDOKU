import React, {useState} from 'react'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import {COLOR} from '../components/colors'
import { setGlobalState, useGlobalState} from '../components/states'

var hexColor = COLOR.tertiaryColor;
var red = parseInt(hexColor.substring(1, 3), 16);
var green = parseInt(hexColor.substring(3, 5), 16);
var blue = parseInt(hexColor.substring(5, 7), 16);
var rgbaColor = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + 0.7 + ')';

const FormStyle = styled.div`
position:absolute;
top:100px;
font-size:20px;
align-items:center;
padding:40px;
box-shadow: 0 3px 6px rgba(0,0,0,0.32), 0 3px 6px rgba(0,0,0,0.46);
border-radius:20px;
width:27%;
background: ${rgbaColor};
  form{
    display:flex;
    flex-direction:column;
    width:100%;
    align-items:center;
  }
  .group{
    display:flex;
    flex-direction:column;
    text-align:left;
    margin:10px;
    width:100%;
    font-weight:bold;
  }
  button{
  border-radius:50px;
  background: ${COLOR.fourthColor};
  white-space: nowrap;
  padding: 16px 64px;
  display:flex;
  justify-content:center;
  width:50%;
  box-shadow:0 3px 6px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.4);
  color: ${COLOR.primaryColor};
  font-size:16px;
  outline:none;
  border:none;
  cursor:pointer;
  color:${COLOR.secondaryColor};
  transition: all 0.2s ease-in-out;
  text-decoration:none;
  &: hover{
    transition: all 0.2s ease-in-out;
    background: ${COLOR.primaryColor};
    color:${COLOR.fourthColor};
  }
    margin-top:30px;
  }
  input{
    border-radius:40px;
    height:40px;
    background:${COLOR.primaryColor};
    padding:10px;
    color:${COLOR.fourthColor};
    font-size:15px;
    box-shadow:0 3px 6px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.2);
  }
  @media(max-width:768px){
  width:50%;
  font-size:15px;
  input{
    height:15px;
  }
}
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    position: relative;
    @media(max-width:768px){
      :global(.header, .puzzle, .controls) {
        font-size: .8em;
      }
    }
`;


const baseUrl = import.meta.env.VITE_REACT_BACKEND || 'http://localhost:3001';
const Login = () => {
  const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn] = useGlobalState('isLoggedIn');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${baseUrl}/login`, {
          email: email,
          password: pass
        }, {withCredentials:true});
        const userId = response.data.user.id;
   
        localStorage.setItem('userId', userId)
        console.log('Form submitted:', response.data);
        setGlobalState('isLoggedIn', true);
        console.log('isLoggedIn: ', isLoggedIn);
        navigate('/'); 
      } catch (error) {
        console.error('Error submitting form:', error);
        if (error.response && error.response.data) {
          setError(error.response.data.message || 'An error occurred.'); // Set error to message if available
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
  };
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
    <Body>
    <FormStyle>
            
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="group">
                <label htmlFor="email">Email:</label>
                
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" required autoFocus/>
                </div>
                <div className="group">
                <label htmlFor="password">Password:</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required/>
                </div>
                {error && <div style={{ color: 'red', fontWeight:'bold' }}>{error}</div>}
                <button type="submit">Log In</button>
            </form>
            <br/>
            <span style={{fontSize:'15px'}}>Don't have an account? <Link to='/signup'>Register here.</Link></span>
        </FormStyle>
        </Body>
    </>

  )
}

export default Login