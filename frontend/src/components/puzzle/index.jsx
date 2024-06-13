import React, {useState, useCallback, useEffect} from'react';
import {Set, List, fromJS} from 'immutable';
import {Helmet} from 'react-helmet';
import styled, {css} from 'styled-components';
import Cell from './Cell'
import GenerationUI from './GenerationUI'
import NumberControl from './NumberControl'
import {COLOR} from '../colors'


import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { TbBulb } from "react-icons/tb";
import { FaArrowsRotate } from "react-icons/fa6";

import {makePuzzle, pluck, isPeer as areCoordinatePeers, range} from '../sudokuGenerator'
const cellWidthL = 2.5;

const ActionsStyle = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 400px;
    margin-top: 2em;
    padding: 0 .6em;
.action {
    display: flex;
    align-items: center;
    flex-direction: column;
}
.action :global(svg) {
    width: 2.5em;
    margin-bottom: .2em;
}
.redo :global(svg) {
    transform: scaleX(-1);
}
`;

const ParentStyle = styled.div`
  position: relative;
  width: ${cellWidthL * 9}em;
`;
// eslint-disable-next-line no-lone-blocks
{ /* language=CSS */ }
const ControlStyle = styled.div`
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    font-weight:bold;
    flex-wrap: wrap;
    justify-content: center;
    transition: filter .5s ease-in-out;
    width: 100%;
`;

const SolveStyle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color:${COLOR.secondaryColor};
    text-align:center;
    font-size:35px;
    text-shadow: 2px 3px 3px #000;
    z-index:2;
    transiton: 0.7s ease-in-out;
    display: ${({ isSolved }) => (isSolved ? 'box' : 'none')};
`;
const PuzzleStyle = styled.div`
    position:relative;
    margin-top: 5em;
    width: ${cellWidthL * 9}em;
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    ${({ isSolved }) => isSolved && css`
        filter: blur(5px);
    `};
    transition:0.3s ease-in-out;
.row {
    display: flex;
    align-items: center;
    flex: 0;
    width: ${cellWidthL * 9}em;
}
.row:not(:last-child){
    border-bottom: 1px solid ${COLOR.fifthColor};
}
.row:nth-child(3n+3):not(:last-child){
    border-bottom: 4px solid ${COLOR.fifthColor};
}
`;

      
function getClickHandler(onClick, onDoubleClick, delay = 250) {
  let timeoutID = null;

  return (event) => {
    if (!timeoutID) {
      timeoutID = setTimeout(() => {
        onClick(event);
        timeoutID = null;
      }, delay);
    } else {
      clearTimeout(timeoutID);
      timeoutID = null;
      onDoubleClick(event);
    }
  };
}
      function makeCountObject() {
        const countObj = [];
        for (let i = 0; i < 10; i += 1) countObj.push(0);
        return countObj;
      }
      function makeBoard({ puzzle }) {
        // create initial count object to keep track of conflicts per number value
        const rows = Array.from(Array(9).keys()).map(() => makeCountObject());
        const columns = Array.from(Array(9).keys()).map(() => makeCountObject());
        const squares = Array.from(Array(9).keys()).map(() => makeCountObject());
        const result = puzzle.map((row, i) => (
          row.map((cell, j) => {
            if (cell) {
              rows[i][cell] += 1;
              columns[j][cell] += 1;
              squares[((Math.floor(i / 3)) * 3) + Math.floor(j / 3)][cell] += 1;
            }
            return {
              value: puzzle[i][j] > 0 ? puzzle[i][j] : null,
              prefilled: !!puzzle[i][j],
            };
          })
        ));
        return fromJS({ puzzle: result, selected: false, choices: { rows, columns, squares } });
      }
      
  
      function updateBoardWithNumber({
        x, y, number, fill = true, board,
      }) {
        let cell = board.get('puzzle').getIn([x, y]);
        // delete its notes
        cell = cell.delete('notes');
        // set or unset its value depending on `fill`
        cell = fill ? cell.set('value', number) : cell.delete('value');
        const increment = fill ? 1 : -1;
        // update the current group choices
        const rowPath = ['choices', 'rows', x, number];
        const columnPath = ['choices', 'columns', y, number];
        const squarePath = ['choices', 'squares',
          ((Math.floor(x / 3)) * 3) + Math.floor(y / 3), number];
        return board.setIn(rowPath, board.getIn(rowPath) + increment)
          .setIn(columnPath, board.getIn(columnPath) + increment)
          .setIn(squarePath, board.getIn(squarePath) + increment)
          .setIn(['puzzle', x, y], cell);
      }
      
      function getNumberOfGroupsAssignedForNumber(number, groups) {
        return groups.reduce((accumulator, row) =>
          accumulator + (row.get(number) > 0 ? 1 : 0), 0);
      }
      
      const Puzzle = () => {
        const [state, setState] = useState({
          board: null,
          history: List(),
          historyOffSet: 0,
          solution: null,
        });
        const [isSolved, setIsSolved] = useState(false);

        const getNumberValueCount = useCallback((number) => {
          const rows = state.board.getIn(['choices', 'rows']);
          const columns = state.board.getIn(['choices', 'columns']);
          const squares = state.board.getIn(['choices', 'squares']);
          return Math.min(
            getNumberOfGroupsAssignedForNumber(number, squares),
            Math.min(
              getNumberOfGroupsAssignedForNumber(number, rows),
              getNumberOfGroupsAssignedForNumber(number, columns),
            ),
          );
        }, [state]);
        
        var checkSolved = useCallback((number) => {
          var test = true;
          range(9).map(i =>{if(number != i+1){test = test & getNumberValueCount(i+1) == 9} 
        else{
          test = test & getNumberValueCount(i+1) == 8;
        } });
          if(test){
            console.log('solved');
            setIsSolved(true);
            console.log(isSolved);
          }
          else{
            console.log('not Solved');
            setIsSolved(false);
          }
          
        },[getNumberValueCount,isSolved]);

        useEffect(() => {
          console.log('isSolved changed:', isSolved);
        }, [isSolved])

        const getSelectedCell = useCallback(() => {
          const { board } = state;
          if(isSolved){
            return null;
          }
          const selected = board?.get('selected');
          //console.log('Selected Cell', selected);
          return selected && board.get('puzzle').getIn([selected.x, selected.y]);
        }, [state,isSolved]);
      
        
      
        const generateGame = useCallback((finalCount = 20) => {
          const solution = makePuzzle();
          const { puzzle } = pluck(solution, finalCount);
          const board = makeBoard({ puzzle });
          setState({
            board, history: List.of(board), historyOffSet: 0, solution,
          });
        }, []);

        const updateBoard = useCallback((newBoard) => {
          let { history } = state;
          const { historyOffSet } = state;
          history = history.slice(0, historyOffSet + 1);
          history = history.push(newBoard);
          setState((prevState) => ({ ...prevState, board: newBoard, history, historyOffSet: history.size - 1 }));
          
        }, [state]);
        
        const addNumberAsNote = useCallback((number) => {
          let { board } = state;
          let selectedCell = getSelectedCell();
          if (!selectedCell) return;
          const prefilled = selectedCell.get('prefilled');
          if (prefilled) return;
          const { x, y } = board.get('selected');
          const currentValue = selectedCell.get('value');
          if (currentValue) {
            board = updateBoardWithNumber({
              x, y, number: currentValue, fill: false, board: state.board,
            });
          }
          let notes = selectedCell.get('notes') || Set();
          if (notes.has(number)) {
            notes = notes.delete(number);
          } else {
            notes = notes.add(number);
          }
          selectedCell = selectedCell.set('notes', notes);
          selectedCell = selectedCell.delete('value');
          board = board.setIn(['puzzle', x, y], selectedCell);
          updateBoard(board);
        }, [state, getSelectedCell, updateBoard]);
      
      
        //const canUndo = useCallback(() => state.historyOffSet > 0, [state]);
      
        const redo = useCallback(() => {
          const { history } = state;
          let { historyOffSet } = state;
          if (history.size) {
            historyOffSet = Math.min(history.size - 1, historyOffSet + 1);
            const board = history.get(historyOffSet);
            setState((prevState) => ({ ...prevState, board, historyOffSet }));
          }
        }, [state]);
      
        const undo = useCallback(() => {
          const { history } = state;
          let { historyOffSet, board } = state;
          if(isSolved)
            return;
          if (history.size) {
            historyOffSet = Math.max(0, historyOffSet - 1);
            board = history.get(historyOffSet);
            setState((prevState) => ({ ...prevState, board, historyOffSet, history }));
          }
        }, [state, isSolved]);
        
        const fillNumber = useCallback((number) => {
          console.log('fillNumber called with', number);
          let { board } = state;
          const selectedCell = getSelectedCell();
          if (!selectedCell) return;
          const prefilled = selectedCell.get('prefilled');
          if (prefilled) return;
          const { x, y } = board.get('selected');
          const currentValue = selectedCell.get('value');
          console.log('clicked', number);
          if (currentValue) {
            board = updateBoardWithNumber({
              x, y, number: currentValue, fill: false, board: state.board,
            });
          }
          const setNumber = currentValue !== number && number;
          if (setNumber) {
            board = updateBoardWithNumber({
              x, y, number, fill: true, board,
            });
          }
          checkSolved(number);
          updateBoard(board);
        }, [state, getSelectedCell, updateBoard,checkSolved]);

        const eraseSelected = useCallback(() => {
          const selectedCell = getSelectedCell();
          if (!selectedCell) return;
          fillNumber(false);
        }, [getSelectedCell, fillNumber]);
      
        const fillSelectedWithSolution = useCallback(() => {
          const { board, solution } = state;
          const selectedCell = getSelectedCell();
          if (!selectedCell) return;
          const { x, y } = board.get('selected');
          fillNumber(solution[x][y]);
        }, [state, getSelectedCell, fillNumber]);
      
        const selectCell = useCallback((x, y) => {
          console.log('Cell selected:', x, y);
          let { board } = state;
          board = board.set('selected', { x, y });
          console.log('Updated board:', board.toJS());
          setState((prevState) => ({...prevState, board }));
        }, [state]);
      
        const isConflict = useCallback((i, j) => {
          const { value } = state.board.getIn(['puzzle', i, j]).toJSON();
          if (!value) return false;
          const rowConflict = state.board.getIn(['choices', 'rows', i, value]) > 1;
          const columnConflict = state.board.getIn(['choices', 'columns', j, value]) > 1;
          const squareConflict = state.board.getIn(['choices', 'squares', ((Math.floor(i / 3)) * 3) + Math.floor(j / 3), value]) > 1;
          if(rowConflict  || columnConflict || squareConflict){
            console.log('Conflict');
          }
          return rowConflict || columnConflict || squareConflict;
        }, [state]);
      
        const renderCell = useCallback((cell, x, y) => {
          const { board } = state;
          const selected = getSelectedCell();
          const { value, prefilled, notes } = cell.toJSON();
          const conflict = isConflict(x, y);
          const peer = areCoordinatePeers({ x, y }, board.get('selected'));
          const sameValue = !!(selected && selected.get('value') && value === selected.get('value'));
          const isSelected = cell === selected;
          return (
            <Cell
              prefilled={prefilled}
              notes={notes}
              sameValue={sameValue}
              isSelected={isSelected}
              isPeer={peer}
              value={value}
              onClick={() => { selectCell(x, y); }}
              key={y}
              x={x}
              y={y}
              conflict={conflict}
            />
          );
        }, [state, getSelectedCell, isConflict, selectCell]);
      
        const renderNumberControl = useCallback(() => {
          const selectedCell = getSelectedCell();
          // const prefilled = selectedCell && selectedCell.get('prefilled');
          // console.log('Selected Cell:', selectedCell);
          // console.log('Prefilled:', prefilled);
          return (
            <ControlStyle>
              {range(9).map((i) => {
                const number = i + 1;
                const clickHandle = getClickHandler(
                  () => {fillNumber(number);},
                  ()=> {addNumberAsNote(number);}
                )
                return (
                  <>
                  <NumberControl
                    key={number}
                    number={number}
                    onClick={clickHandle}
                    numberOf={getNumberValueCount(number)}
                  />
                  </>
                );
              })}
            </ControlStyle>
          );
        }, [getSelectedCell, fillNumber, addNumberAsNote, getNumberValueCount]);
      
        const renderActions = useCallback(() => {
          const { history } = state;
          const selectedCell = getSelectedCell();
          const prefilled = selectedCell && selectedCell.get('prefilled');
          return (
               <ActionsStyle className="actions">
                <div className="action" onClick={history.size ? undo : null}>
          <FaChevronLeft />Undo
        </div>
        <div className="action redo" onClick={history.size ? redo : null}>
          <FaChevronRight />Redo
        </div>
        <div className="action" onClick={!prefilled ? eraseSelected : null}>
          <FaEraser />Erase
        </div>
        <div
          className="action"
          onClick={!prefilled ? fillSelectedWithSolution : null}
        >
          <TbBulb />Hint
        </div>
        <div className="action" onClick={() => {setState({ board: null }), setIsSolved(false)}}>
          <FaArrowsRotate />
        <div>New Game</div>
        </div>
        </ActionsStyle>
    );
  }, [state, undo, redo, eraseSelected, fillSelectedWithSolution, getSelectedCell]);

  const renderPuzzle = useCallback(() => {
    const { board } = state;
    return (
      <ParentStyle>
        <SolveStyle isSolved={isSolved}>
          <h1>SOLVED</h1>
        </SolveStyle>
        <PuzzleStyle isSolved={isSolved} className = 'puzzle'>
        {board.get('puzzle').map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => renderCell(cell, i, j)).toArray()}
          </div>
        )).toArray()}
        <div className="solv"></div>
        </PuzzleStyle>
      </ParentStyle>
    );
  }, [state, renderCell,isSolved]);

  const renderControls = useCallback(() => {
    return (
      <div className="controls">
        {renderNumberControl()}
        {renderActions()}
        <style>{`
          .controls {
            margin-top: .3em;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
            padding: .5em 0;
          }
        `}</style>
      </div>
    );
  }, [renderNumberControl, renderActions]);

  

  const renderGenerationUI = useCallback(() => (
    <GenerationUI generateGame={generateGame} />
  ), [generateGame]);

 
  // const renderSolved = useCallback(()=>(
  //     <Solved/>
  // ),[]);

  return (
    <div className="pbody">
      {!state.board && renderGenerationUI()}
      {state.board && renderPuzzle()}
      {state.board && renderControls()}
      

      <style>{`
        .pbody {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          position: relative;
        }
          @media(max-width:768px){
            :global(.header, .puzzle, .controls) {
              font-size: .8em;
            }
          }
        :global(pbody) {
          margin: 0;
        }
      `}</style>
    </div>
  );
};
 export default Puzzle
