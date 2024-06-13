import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {COLOR} from '../colors';

const GenerationUI = (props) => {
    const [value, setValue] = useState(30);
  
    const generateGame = () => {
      props.generateGame(value);
    }
    return (
        <div className="generation">
          <div className="copy">Start with {value} cells prefilled</div>
          <Slider
            max={81}
            min={17}
            value={value}
            onChange={value => setValue(value)}
          />
          <div className="button" onClick={generateGame}>Play Sudoku</div>
          <style>{`
            .copy {
              text-align: center;
              font-size: 1.3em;
              margin-bottom: .5em;
            }
            .generation {
              display: flex;
              justify-content: center;
              flex-direction: column;
              width: 50%;
              align-items: center;
            }
            :global(.input-range) {
              width: 80%;
              max-width: 500px;
            }
            .button {
              margin-top: .5em;
              border-radius: .25em;
              cursor: pointer;
              font-weight: bold;
              text-decoration: none;
              color: #fff;
              position: relative;
              display: inline-block;
              transition: all .25s;
              padding: 5px 10px;
              font-size: 1.4em;
            }
            .button:active {
              transform: translate(0px, 5px);
              box-shadow: 0 1px 0 0;
            }
            .button {
              background-color: ${COLOR.tertiaryColor};
              box-shadow: 0 2px 4px 0 darken(${COLOR.tertiaryColor},50%);
              display: flex;
              align-items: center;
            }
            .button:hover {
              background-color: lighten(${COLOR.tertiaryColor},20%);
            }
          `}
        </style>
        </div>
      );
    }

    GenerationUI.propTypes = {
        generateGame: PropTypes.func.isRequired,
      };
      
export default GenerationUI;