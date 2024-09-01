import { inject, Injectable } from '@angular/core';
import { BoardCell } from '@models/cell.model';
import { BoardStateManager } from '@shared/board-state.manager';
import { GameLogicService } from './game-logic.service';
import { INITIAL_PIECES_SETUP } from '@shared/setup';
import { CellPosition } from '@shared/position';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boardStateManager = BoardStateManager.getInstance();
  private gameLogicService = inject(GameLogicService);
  private selectedCell: BoardCell | null = null;

  constructor() {
    this.boardStateManager.updateBoard(this.initBoard());
  }

  private initBoard(): BoardCell[][] {
    const BOARD_SIZE = 8;

    return Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => {
        const isLight = (row + col) % 2 === 0; // Determine color based on row and column
        const piece = INITIAL_PIECES_SETUP[row]?.[col]; // Determine the initial piece

        return new BoardCell(isLight, { row, col }, piece);
      }),
    );
  }

  get board$() {
    return this.boardStateManager.boardObservable;
  }

  clickCell(cell: BoardCell): void {
    if (!this.selectedCell && cell.isClickable) {
      // First click: select the cell
      this.selectedCell = cell;
      const legalMoves = this.gameLogicService.calculateLegalMoves(
        cell.position,
      );
      this.highlightLegalMoves(legalMoves);
    } else if (this.selectedCell) {
      // Second click: attempt to move to the selected cell
      const from = this.selectedCell.position;
      const to = cell.position;
      const moveSuccessful = this.gameLogicService.movePiece(from, to);

      if (moveSuccessful) this.updateLastMoveMarkers(from, to);

      this.selectedCell = null;
      this.clearHighlightedCells();
    }
  }

  private highlightLegalMoves(moves: CellPosition[]): void {
    moves.forEach(move => {
      this.boardStateManager.currentBoard[move.row][move.col].isLegal = true;
    });
  }

  private updateLastMoveMarkers(from: CellPosition, to: CellPosition): void {
    const board = this.boardStateManager.currentBoard;

    board.forEach(row => row.forEach(cell => (cell.isLastMove = false)));
    board[from.row][from.col].isLastMove = true;
    board[to.row][to.col].isLastMove = true;
  }

  private clearHighlightedCells(): void {
    this.boardStateManager.currentBoard.forEach(row =>
      row.forEach(cell => {
        cell.isLegal = false;
        cell.isClicked && cell.click();
      }),
    );
  }
}
