let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = new Array(8);
  for(let i = 0; i < grid.length; i++) {
    grid[i] = new Array(8);
  }

  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  
  if (this.grid[pos[0]][pos[1]] === undefined) {
    return undefined;
  }
  else {
    return this.grid[pos[0]][pos[1]];
  }
  
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length === 0) {
    return false;
  }
  else {
    return true;
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if ((this.grid[pos[0]][pos[1]]) === undefined) {
    return undefined;
  }
  else if ((this.grid[pos[0]][pos[1]]).color === color) {
    return true;
  }
  else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.grid[pos[0]][pos[1]] === undefined) {
    return false;
  }
  else {
    return true;
  }
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (this.hasMove("black") && (this.hasMove("white"))) {
    return false;
  }
  else {
    return true;
  }
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if (( x <= 7 && x >= 0) && (y <=7 && y >= 0)) {
    return true;
  }
  else {
    return false;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
    
    
    if(!piecesToFlip) {
      piecesToFlip = [];
    }
    else {
       piecesToFlip.push(pos);
    }

    let newpos = [pos[0] + dir[0], pos[1] + dir[1]];

    if (!board.isValidPos(newpos)) {
      return null;
    }
    else if (board.isMine(newpos,color)) {
      return (piecesToFlip.length ===0) ? null : piecesToFlip;
      // return null; //return null if piecestoFlip.length === 0, else return piecestoFlip
    }
    else if (!board.isOccupied(newpos)) {
      return null;
    }

    return _positionsToFlip(board,newpos,color,dir,piecesToFlip);
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  
    if (!this.validMove(pos,color)) {
      throw new Error("Invalid Move");
    }
    let positions = [];

    for (let i = 0; i < Board.DIRS.length; i++) {
      console.log(_positionsToFlip(this, pos, color, Board.DIRS[i]));
      if (_positionsToFlip(this, pos, color, Board.DIRS[i])) {
        positions = positions.concat(_positionsToFlip(this, pos, color, Board.DIRS[i]));
      }
      
    }

    for (let j = 0; j < positions.length; j++) {
      let piece = this.getPiece(positions[j]); 
      piece.flip();
    }
    this.grid[pos[0]][pos[1]] = new Piece(color);
};


/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied([pos[0], pos[1]])) {
    return false;
  }

  for (let i = 0; i < Board.DIRS.length; i++) {
    if (_positionsToFlip(this,pos,color,Board.DIRS[i]) !== null) {
      return true;
    }
  }
  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const validmoves = [];

  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      if(this.validMove([i,j], color)) {
        validmoves.push([i,j]);
      }
    }
  }
  return validmoves;
};

module.exports = Board;
