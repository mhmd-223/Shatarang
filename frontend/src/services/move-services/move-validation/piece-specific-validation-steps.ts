import { MoveValidationStep } from './move-validation-steps';
import { CellPosition } from '@shared/position';
import { Color } from '@shared/color';
import { BoardCell } from '@models/cell.model';
import { Rook } from '@models/pieces/rook';
import { King } from '@models/pieces/king';
import { KingSafetyValidationStep } from './general-validation-steps';
import { CheckDetector } from './check-detector';
import { Pawn } from '@models/pieces/pawn';
import { Utils } from '@shared/utils';

export class PathClearValidationStep implements MoveValidationStep {
  validate(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    _: Color,
  ): boolean {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    const rowStep =
      rowDiff === 0 ? 0
      : rowDiff > 0 ? 1
      : -1;
    const colStep =
      colDiff === 0 ? 0
      : colDiff > 0 ? 1
      : -1;

    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol].piece) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  }
}

export class PawnSpecificValidationStep implements MoveValidationStep {
  private pawnInfo = {
    [Color.WHITE]: { direction: -1, initialRow: 6 },
    [Color.BLACK]: { direction: 1, initialRow: 1 },
  };

  validate(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    pawnColor: Color,
  ): boolean {
    const { direction, initialRow } = this.pawnInfo[pawnColor];
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const targetCell = board[to.row][to.col];
    const isCellOccupied = (cell: BoardCell) => !!cell.piece;

    // Moving forward
    if (colDiff === 0) {
      // Moving one square
      if (rowDiff === direction && !isCellOccupied(targetCell)) return true;

      // Initial two-square move
      if (
        rowDiff === 2 * direction &&
        from.row === initialRow &&
        !isCellOccupied(targetCell) &&
        !isCellOccupied(board[from.row + direction][to.col])
      )
        return true;
    }

    // Diagonal capture
    if (Math.abs(colDiff) === 1 && rowDiff === direction) {
      if (isCellOccupied(targetCell) && targetCell.piece!.color !== pawnColor)
        return true;

      // Maybe an en-passant move
      if (!isCellOccupied(targetCell)) {
        const enemyPawnCell = board[to.row - direction][to.col];

        return (
          isCellOccupied(enemyPawnCell) &&
          enemyPawnCell.piece instanceof Pawn &&
          enemyPawnCell.piece.color !== pawnColor &&
          Utils.enPassantState !== null &&
          Utils.enPassantState.pawn === enemyPawnCell.piece
        );
      }
    }

    return false;
  }
}

export class KingSpecificValidationStep implements MoveValidationStep {
  private readonly kingSafety = new KingSafetyValidationStep();

  validate(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    _: Color,
  ): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    const isOneSquareMove = rowDiff <= 1 && colDiff <= 1;
    const isCastlingMove = rowDiff === 0 && colDiff === 2;

    if (isCastlingMove) {
      return this.validateCastling(from, to, board);
    }

    return isOneSquareMove;
  }

  private validateCastling(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
  ): boolean {
    const colDiff = to.col - from.col;
    const king = board[from.row][from.col].piece as King;
    const rookCol = colDiff === 2 ? 7 : 0;
    const rook = board[from.row][rookCol].piece as Rook;

    if (!rook || king.hasMoved || rook.hasMoved) {
      return false;
    }

    if (!this.checkCastlingPath(from, to, board, king.color)) {
      return false;
    }

    return !CheckDetector.create().isKingInCheck(king.color).isCheck;
  }

  private checkCastlingPath(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    kingColor: Color,
  ): boolean {
    const castlingSide = Math.sign(to.col - from.col);
    const startCol = from.col + castlingSide;
    const endCol = castlingSide > 0 ? 7 : 0;

    for (let col = startCol; col !== endCol; col += castlingSide) {
      if (
        board[from.row][col].piece ||
        !this.kingSafety.validate(
          from,
          { row: from.row, col },
          board,
          kingColor,
        )
      ) {
        return false;
      }
    }

    return true;
  }
}
