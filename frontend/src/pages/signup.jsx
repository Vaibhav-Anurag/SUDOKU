import React, {useState} from 'react'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import {Link, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import {COLOR} from '../components/colors'
import axios from 'axios'


const baseUrl = import.meta.env.VITE_REACT_BACKEND || 'http://localhost:3001';

var hexColor = COLOR.tertiaryColor;
var red = parseInt(hexColor.substring(1, 3), 16);
var green = parseInt(hexColor.substring(3, 5), 16);
var blue = parseInt(hexColor.substring(5, 7), 16);
var rgbaColor = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + 0.7 + ')';

const FormStyle = styled.div`
position:absolute;
top:100px;
font-size:15px;
align-items:center;
padding:40px;
width:27%;
box-shadow: 0 3px 6px rgba(0,0,0,0.32), 0 3px 6px rgba(0,0,0,0.46);
border-radius:20px;

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
    height:30px;
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
  :global(pbody) {
    margin: 0;
  }
`;


const SignUp = () => {
  const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const[name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () =>{
    setIsOpen(!isOpen);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/signup`, {
        name: name,
        email: email,
        password: pass
      });
      
      console.log('Form submitted:', response.data);
      navigate('/login'); 
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred.'); // Set error to message if available
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
};

  return (
    <>
    <div>
      <Sidebar isOpen = {isOpen} toggle = {toggle}/>
      <Navbar toggle= {toggle}/>
    </div>
    <Body>
    <FormStyle>
            
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Sign-Up</h2>
                <div className="group">
                  <label htmlFor="uname">Name:</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" id="uname" name="uname" required autoFocus/>
                </div>
                <div className="group">
                <label htmlFor="email">Email:</label>
                
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" required/>
                </div>
                <div className="group">
                <label htmlFor="password" >Password:</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required/>
                </div>
                {error && <div style={{ color: 'red', fontWeight:'bold' }}>{error}</div>}
                <button type="submit">Sign-Up</button>
            </form>
            <br/>
            Already have an account? <Link to='/login'>Login here.</Link>
        </FormStyle>
        </Body>
    </>

  )
}

export default SignUp