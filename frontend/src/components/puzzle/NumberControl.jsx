import React from 'react';
import styled from 'styled-components'
import {COLOR} from '../colors'
import PropTypes from 'prop-types';


const NumberControlStyle = styled.div`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    margin: .1em;
    width: 2em;
    height: 2em;
    background-color:white;
    color: ${COLOR.fourthColor};
    border-radius: 50%;
    cursor:pointer;
    user-select:none;
.number > div {
    margin-top: .3em;
}
`;


const NumberControl = ({ number, onClick, numberOf}) => (
    <NumberControlStyle
      key={number}
      className="number"
      onClick={onClick}
    >
      <div style={{marginBottom:'0'}}>{number}</div><div className='left' style={{fontSize:'15px', color:COLOR.tertiaryColor}}><br/>{9-numberOf}</div>
    </NumberControlStyle>
  );
  
  NumberControl.propTypes = {
    number: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    numberOf: PropTypes.number.isRequired,
  };
  
  NumberControl.defaultProps = {
    onClick: null,
  };

  export default NumberControl;