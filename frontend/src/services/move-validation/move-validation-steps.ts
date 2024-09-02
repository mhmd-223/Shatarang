import { CellPosition } from '@shared/position';
import { Color } from '@shared/color';
import { BoardCell } from '@models/cell.model';

export interface MoveValidationStep {
  validate(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    pieceColor: Color,
  ): boolean;
}
