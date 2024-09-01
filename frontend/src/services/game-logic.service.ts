import { effect, inject, Injectable } from '@angular/core';
import { BoardStateManager } from '@shared/board-state.manager';
import { CellPosition } from '@shared/position';
import { PlayerService } from './player.service';
import { Utils } from '@shared/utils';
import { Color } from '@shared/color';

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

    if (!piece || !piece.validate(from, to)) return false;

    // Perform the move
    board[to.row][to.col].piece = piece;
    board[from.row][from.col].piece = undefined;
    this.boardStateManager.updateBoard(board);

    // Update game state
    this.updateCheckStatus();
    this.playerService.changePlayer();

    return true;
  }

  calculateLegalMoves(position: CellPosition): CellPosition[] {
    const board = this.boardStateManager.currentBoard;
    const piece = board[position.row][position.col].piece;
    if (!piece) return [];

    return piece
      .calculatePossibleMoves(position)
      .filter(move => piece.validate(position, move));
  }

  private updateCheckStatus(): void {
    const whiteCheckResult = Utils.isKingInCheck(Color.WHITE);
    const blackCheckResult = Utils.isKingInCheck(Color.BLACK);
    const board = this.boardStateManager.currentBoard;

    board[whiteCheckResult.kingPosition.row][
      whiteCheckResult.kingPosition.col
    ].isChecked = whiteCheckResult.isCheck;
    board[blackCheckResult.kingPosition.row][
      blackCheckResult.kingPosition.col
    ].isChecked = blackCheckResult.isCheck;

    if (whiteCheckResult.isCheckmate || blackCheckResult.isCheckmate) {
      // Handle checkmate (e.g., end the game)
    }
  }
}
