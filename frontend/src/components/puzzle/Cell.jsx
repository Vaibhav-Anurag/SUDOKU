import React from 'react';
import {Set} from 'immutable';
import PropTypes from 'prop-types';
import {COLOR} from '../colors';
import styled from 'styled-components';
import {range} from '../sudokuGenerator'


const cellWidthL = 2.5;
const warn = '#DC143C';

const CellStyle = styled.div`
    height: ${cellWidthL}em;
    width: ${cellWidthL}em;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
    font-weight: bold;
    transition: .5s ease-in-out;
&:nth-child(3n+3):not(:last-child) {
    border-right: 4px solid ${COLOR.fifthColor};
}
&:not(:last-child) {
    border-right: 1px solid ${COLOR.fifthColor};
}
.note-number {
    font-size: .6em;
    width: 33%;
    height: 33%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
`;

function getBackgroundColor({
    conflict, isPeer, sameValue, isSelected
}){
    if(conflict && isPeer && sameValue){
        return COLOR.tertiaryColor;
    }
    else if(sameValue){
        return COLOR.tertiaryColor;
    }
    else if (isSelected){
        return COLOR.tertiaryColor;
    }else if (isPeer){
        return COLOR.secondaryColor;
    }
    return false;
}

function getFontColor({value, conflict, prefilled}){
    if(conflict && !prefilled){
        return warn;
    }
    else if(!prefilled && value){
        return COLOR.fourthColor;
    }
    return false;
}

const Cell = (props) => {
    const {
      value, onClick, isPeer, isSelected, sameValue, prefilled, notes, conflict,
    } = props;
    var backgroundColor = getBackgroundColor({
      conflict, isPeer, sameValue, isSelected,
    });
    var fontColor = getFontColor({ conflict, prefilled, value });
    if(backgroundColor && backgroundColor == COLOR.secondaryColor && !fontColor){
      fontColor = COLOR.fourthColor;
    }
    //console.log('bg ', backgroundColor, ' ft ', fontColor);
    return (
      
        <CellStyle className="cell" onClick={onClick}  style={{
          backgroundColor: backgroundColor || 'initial',
          color: fontColor || 'initial'}}>
        {
          notes ?
            range(9).map(i =>
              (
                <div key={i} className="note-number">
                  {notes.has(i + 1) && (i + 1)}
                </div>
              )) :
            value && value
        }
        </CellStyle>
    );
  };
  
  Cell.propTypes = {
    // current number value
    value: PropTypes.number,
    // cell click handler
    onClick: PropTypes.func.isRequired,
    // if the cell is a peer of the selected cell
    isPeer: PropTypes.bool.isRequired,
    // if the cell is selected by the user
    isSelected: PropTypes.bool.isRequired,
    // current cell has the same value if the user selected cell
    sameValue: PropTypes.bool.isRequired,
    // if this was prefilled as a part of the puzzle
    prefilled: PropTypes.bool.isRequired,
    // current notes taken on the cell
    notes: PropTypes.instanceOf(Set),
    // if the current cell does not satisfy the game constraint
    conflict: PropTypes.bool.isRequired,
  };
  
  Cell.defaultProps = {
    notes: null,
    value: null,
  };
  
export default Cell;