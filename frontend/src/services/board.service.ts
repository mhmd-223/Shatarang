import { effect, inject, Injectable } from '@angular/core';
import { BoardCell } from '@models/cell.model';
import { CellPosition } from '@shared/position';
import { INITIAL_PIECES_SETUP } from '@shared/setup';
import { PlayerService } from './player.service';
import { Utils } from '@shared/utils';
import { Color } from '@shared/color';
import { BoardStateManager } from '@shared/board-state.manager';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boardStateManager: BoardStateManager;
  private isMovementStarted: boolean = false;
  private src: BoardCell | null = null;
  private dest: BoardCell | null = null;

  private playerService = inject(PlayerService);

  private legalMovesOfSrc: CellPosition[] = [];

  constructor() {
    this.boardStateManager = BoardStateManager.getInstance();
    this.boardStateManager.updateBoard(this.initBoard());

    effect(() => {
      const currentBoard = this.boardStateManager.currentBoard;
      currentBoard.forEach(row =>
        row.forEach(
          cell =>
            (cell.isClickable =
              cell.piece?.color == this.playerService.currentPlayer.color),
        ),
      );

      this.boardStateManager.updateBoard(currentBoard);
    });
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
    if (!this.isMovementStarted) this.startMove(cell);
    else this.endMove(cell);
  }

  private startMove(cell: BoardCell) {
    if (cell.piece && cell.isClickable) {
      this.isMovementStarted = true; // Start a move
      this.src = cell;
      this.legalMovesOfSrc = cell.piece
        .calculatePossibleMoves(cell.position)
        .filter(move => cell.piece!.validate(cell.position, move));

      this.legalMovesOfSrc.forEach(move => {
        const { row, col } = move;
        const currentBoard = this.boardStateManager.currentBoard;

        currentBoard[row][col].isLegal = true;
        this.boardStateManager.updateBoard(currentBoard);
      });
    }
  }

  private endMove(cell: BoardCell) {
    if (cell.piece?.color !== this.src?.piece?.color) this.dest = cell;

    if (this.src && this.dest && this.src !== this.dest) {
      const isLegalMove = this.legalMovesOfSrc.some(move => {
        const pos = this.dest!.position;
        return move.row === pos.row && move.col === pos.col;
      });

      if (isLegalMove) {
        // Reset last move
        const currentBoard = this.boardStateManager.currentBoard;

        currentBoard.forEach(row =>
          row.forEach(cell => (cell.isLastMove = false)),
        );
        this.boardStateManager.updateBoard(currentBoard);

        this.processMove();
        this.playerService.changePlayer();
      }
    }

    this.resetMovementState();
  }

  private resetMovementState() {
    this.src = null;
    this.dest = null;
    this.isMovementStarted = false; // End the move
    const currentBoard = this.boardStateManager.currentBoard;

    currentBoard.forEach(row =>
      row.forEach(cell => {
        cell.isClicked && cell.click();
        cell.isLegal = false;
      }),
    );

    this.boardStateManager.updateBoard(currentBoard);
  }

  private processMove(): void {
    this.src!.piece!.applyConstrains();

    const srcPos = this.src!.position;
    const destPos = this.dest!.position;

    const newBoard = this.boardStateManager.currentBoard.map(row =>
      row.slice(),
    );
    newBoard[destPos.row][destPos.col].piece = this.src!.piece;
    newBoard[srcPos.row][srcPos.col].piece = undefined;

    newBoard[destPos.row][destPos.col].isLastMove = true;
    newBoard[srcPos.row][srcPos.col].isLastMove = true;

    this.boardStateManager.updateBoard(newBoard);

    this.updateCheckStatus();
  }

  private updateCheckStatus() {
    const updateKingCheckStatus = (result: {
      isCheck: boolean;
      kingPosition: CellPosition;
    }) => {
      const { isCheck, kingPosition } = result;
      this.boardStateManager.currentBoard[kingPosition.row][
        kingPosition.col
      ].isChecked = isCheck;
    };

    const whiteCheckResult = Utils.isKingInCheck(Color.WHITE);
    updateKingCheckStatus(whiteCheckResult);
    if (whiteCheckResult.isCheckmate) console.log('Checkmate! White wins!');

    const blackCheckResult = Utils.isKingInCheck(Color.BLACK);
    updateKingCheckStatus(blackCheckResult);
    if (blackCheckResult.isCheckmate) console.log('Checkmate! Black wins!');
  }
}
