import { Injectable } from '@angular/core';
import { BoardCell } from '../boardcell/cell.model';
import { INITIAL_PIECES_SETUP } from '../boardcell/piece.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private _board: BoardCell[][];
  private isMovementStarted: boolean = false;
  private src: BoardCell | null = null;
  private dest: BoardCell | null = null;

  private boardSubject = new BehaviorSubject<BoardCell[][]>(this.initBoard());
  movement$ = this.boardSubject.asObservable();

  constructor() {
    this._board = this.initBoard();

    this.boardSubject.next(this._board); // Emit the initial board state
  }

  private initBoard(): BoardCell[][] {
    const BOARD_SIZE = 8;

    return Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => {
        const isLight = (row + col) % 2 === 0; // Determine color based on row and column
        const piece = INITIAL_PIECES_SETUP[row]?.[col]; // Determine the initial piece

        return new BoardCell(isLight, { row, col }, piece);
      })
    );
  }

  get board(): BoardCell[][] {
    return this._board;
  }

  clickCell(cell: BoardCell): void {
    if (!this.isMovementStarted) {
      if (cell.piece) {
        this.isMovementStarted = true; // Start a move
        this.src = cell;
      }
    } else {
      this.dest = cell;
      this.isMovementStarted = false; // End the move
    }

    if (this.src && this.dest) {
      if (this.src !== this.dest) {
        this._board.forEach(row => row.forEach(cell => cell.isLastMove = false))

        const srcPos = this.src.position;
        const destPos = this.dest.position;

        // Update the board state
        const newBoard = this._board.map(row => row.slice()); // Create a new board array
        newBoard[destPos.row][destPos.col].piece = this.src.piece;
        newBoard[srcPos.row][srcPos.col].piece = undefined;

        newBoard[destPos.row][destPos.col].isLastMove = true
        newBoard[srcPos.row][srcPos.col].isLastMove = true

        // Update the BehaviorSubject with the new board state
        this._board = newBoard;
        this.boardSubject.next(this._board);

      }

      // Clean
      this.src = null;
      this.dest = null;
      this._board.forEach(row => row.forEach(cell => cell.isClicked && cell.click())) // Unclick any clicked cell
    }
  }
}
