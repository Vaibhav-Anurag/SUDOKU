import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setGlobalState, useGlobalState} from '../components/states'

const baseUrl = import.meta.env.VITE_REACT_BACKEND || 'http://localhost:3001';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get(`${baseUrl}/logout`,{withCredentials:true});
        console.log('Logout Response:', response.data);
        setGlobalState('isLoggedIn', false);
        navigate('/login'); 
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;