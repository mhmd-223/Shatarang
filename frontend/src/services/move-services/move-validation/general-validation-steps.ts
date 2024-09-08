import { MoveValidationStep } from './move-validation-steps';
import { CellPosition } from '@shared/position';
import { Color } from '@shared/color';
import { BoardCell } from '@models/cell.model';
import { BoardStateManager } from '@shared/board-state.manager';
import { CheckDetector } from './check-detector';

export class DestinationValidationStep implements MoveValidationStep {
  validate(
    _: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    pieceColor: Color,
  ): boolean {
    const targetCellPiece = board[to.row][to.col].piece;

    return !targetCellPiece || targetCellPiece.color !== pieceColor;
  }
}

export class KingSafetyValidationStep implements MoveValidationStep {
  private boardStateManager = BoardStateManager.getInstance();

  validate(
    from: CellPosition,
    to: CellPosition,
    _: BoardCell[][],
    pieceColor: Color,
  ): boolean {
    // Simulate the move
    this.boardStateManager.startHypotheticalMove(from, to);
    const isInCheck = CheckDetector.create().isKingInCheck(pieceColor).isCheck;
    this.boardStateManager.endHypotheticalMove();

    return !isInCheck;
  }
}
