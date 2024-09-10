import { Injectable } from '@angular/core';
import { BoardCell } from '@models/cell.model';
import { Pawn } from '@models/pieces/pawn';
import { CellPosition } from '@shared/position';
import { Utils } from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class MoveExecutorService {
  movePiece(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
  ): boolean {
    const piece = board[from.row][from.col].piece;

    if (piece) {
      if (piece instanceof Pawn) {
        Utils.enPassantState = { pawn: piece };
      }
      // Perform the move
      piece.applyConstrains();
      board[to.row][to.col].piece = piece;
      board[from.row][from.col].piece = undefined;

      return true;
    }

    return false;
  }
}
