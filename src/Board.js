import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  /** Default board size, can be changed */
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25,
  };

  constructor(props) {
    super(props);

    // TODO: set initial state
    // table
    //  tbody
    //    trow
    //      -Cell
    //      -Cell
    //      -Cell
    //    trow
    //      -Cell
    //      -Cell
    //      -Cell

    // set initial state of the board
    this.state = {
      hasWon: false,
      board: this.createBoard(),
    };

    /** set context of this to the board */
    this.createBoard = this.createBoard.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }

      // build board
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    // console.log("FLIPPING", coord);
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    /** helper function */
    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y, x); // flip clicked cell
    flipCell(y, x + 1); // flip cell to the right
    flipCell(y, x - 1); // flip cell to the left
    flipCell(y - 1, x); // flip cell above
    flipCell(y + 1, x); // flip cell below

    // win when every cell is turned off
    // alternate iteration over every cell, instead of for-loop
    let hasWon = board.every((row) => row.every((cell) => !cell));

    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */
  render() {
    // check if board was won, so we do not need to draw it
    // if the game is won, just show a winning msg & render nothing else
    if (this.state.hasWon) {
      return (
        <div className="Board-title">
          <div className="winner">
            <span className="neon-orange">YOU</span>
            <span className="neon-blue">WIN!</span>
          </div>
        </div>
      );
    }
    // otherwise:
    // make table board
    let tableBoard = [];

    // iterate over rows
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      // iterate over columns
      for (let x = 0; x < this.props.ncols; x++) {
        // build key for HTML element
        let coord = `${y}-${x}`;

        // create rows by pushin in Cell elements
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[y][x]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
        console.log(row);
      }

      // build board by pushing in HTML trows containing the Cells
      tableBoard.push(<tr key={y}>{row}</tr>);
    }
    return (
      <div>
        <div className="Board-title">
          <div className="neon-orange"> Lights </div>
          <div className="neon-blue"> Out </div>
        </div>
        <table className="Board">
          <tbody>{tableBoard}</tbody>
        </table>{" "}
      </div>
    );
  }
}

export default Board;
