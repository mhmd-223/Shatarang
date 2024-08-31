import { BoardStateManager } from '@shared/board-state.manager';
import { Color } from '@shared/color';
import { CellPosition } from '@shared/position';
import { Utils } from '@shared/utils';

export abstract class MoveValidator {
  protected boardStateManager = BoardStateManager.getInstance();

  abstract isLegalMove(from: CellPosition, to: CellPosition): boolean;

  protected validateGenerally(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const targetCell = board[to.row][to.col];
    const color = board[from.row][from.col].piece!.color;

    if (!targetCell.piece) return true;
    if (targetCell.piece.color !== color) return true;

    return false;
  }

  isKingInCheck(color: Color): boolean {
    return Utils.isKingInCheck(color).isCheck;
  }
}

export class PawnMove extends MoveValidator {
  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const color = board[from.row][from.col].piece!.color;
    const targetCell = board[to.row][to.col];
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    // Move forward by 1 or 2 squares
    if (colDiff === 0) {
      if (rowDiff === (color === Color.WHITE ? -1 : 1) && !targetCell.piece)
        return true;
      if (
        rowDiff === (color === Color.WHITE ? -2 : 2) &&
        !targetCell.piece &&
        (color === Color.WHITE ? from.row === 6 : from.row === 1)
      ) {
        // Pawn's initial 2-square move
        const middleCell =
          board[from.row + (color === Color.WHITE ? -1 : 1)][from.col];
        if (!middleCell.piece) return true;
      }
      return false;
    }

    // Diagonal attack
    if (
      colDiff === 1 &&
      rowDiff === (color === Color.WHITE ? -1 : 1) &&
      targetCell.piece
    ) {
      return targetCell.piece.color !== color;
    }

    return false;
  }
}

export class KnightMove extends MoveValidator {
  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    return this.validateGenerally(from, to);
  }
}

export class BishopMove extends MoveValidator {
  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    if (!this.validateGenerally(from, to)) return false;

    const board = this.boardStateManager.currentBoard;
    const rowStep = to.row - from.row > 0 ? 1 : -1;
    const colStep = to.col - from.col > 0 ? 1 : -1;
    let row = from.row + rowStep;
    let col = from.col + colStep;

    // Check all cells between start and end
    while (row !== to.row && col !== to.col) {
      if (board[row][col].piece) return false;
      row += rowStep;
      col += colStep;
    }

    return true;
  }
}

export class RookMove extends MoveValidator {
  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    if (!this.validateGenerally(from, to)) return false;

    const board = this.boardStateManager.currentBoard;
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    // Horizontal move
    if (rowDiff === 0) {
      const step = colDiff > 0 ? 1 : -1;
      let col = from.col + step;

      while (col !== to.col) {
        if (board[from.row][col].piece) return false;
        col += step;
      }

      return true;
    }

    // Vertical move
    if (colDiff === 0) {
      const step = rowDiff > 0 ? 1 : -1;
      let row = from.row + step;

      while (row !== to.row) {
        if (board[row][from.col].piece) return false;
        row += step;
      }

      return true;
    }

    return false;
  }
}

export class QueenMove extends MoveValidator {
  private bishopMoveValidator = new BishopMove();
  private rookMoveValidator = new RookMove();

  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    if (!this.validateGenerally(from, to)) return false;

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    // Check if the move is diagonal (bishop-like)
    if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      return this.bishopMoveValidator.isLegalMove(from, to);
    }

    // Check if the move is horizontal or vertical (rook-like)
    if (rowDiff === 0 || colDiff === 0) {
      return this.rookMoveValidator.isLegalMove(from, to);
    }

    return false;
  }
}

export class KingMove extends MoveValidator {
  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    return this.validateGenerally(from, to);
  }
}
