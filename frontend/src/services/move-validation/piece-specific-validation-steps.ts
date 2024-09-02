import { MoveValidationStep } from './move-validation-steps';
import { CellPosition } from '@shared/position';
import { Color } from '@shared/color';
import { BoardCell } from '@models/cell.model';

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
    if (
      Math.abs(colDiff) === 1 &&
      rowDiff === direction &&
      isCellOccupied(targetCell) &&
      targetCell.piece!.color !== pawnColor
    )
      return true;

    // TODO: implement En Passant and Promotion

    return false;
  }
}
