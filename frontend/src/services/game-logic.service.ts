import { effect, inject, Injectable } from '@angular/core';
import { BoardStateManager } from '@shared/board-state.manager';
import { CellPosition } from '@shared/position';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class GameLogicService {
  private boardStateManager = BoardStateManager.getInstance();
  private playerService = inject(PlayerService);

  constructor() {
    effect(() => {
      this.boardStateManager.currentBoard.forEach(row =>
        row.forEach(
          cell =>
            (cell.isClickable =
              cell.piece?.color === this.playerService.currentPlayer.color),
        ),
      );
    });
  }

  movePiece(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard.map(row => [...row]);
    const piece = board[from.row][from.col].piece;

    if (!piece) return false;

    // Perform the move
    // piece.applyConstrains();
    board[to.row][to.col].piece = piece;
    board[from.row][from.col].piece = undefined;
    this.boardStateManager.updateBoard(board);

    this.playerService.changePlayer();

    return true;
  }
}
