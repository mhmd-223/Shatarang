import { MoveValidationStep } from './move-validation-steps';
import { CellPosition } from '@shared/position';
import { Color } from '@shared/color';
import { BoardCell } from '@models/cell.model';

export class MoveValidationPipeline {
  private steps: MoveValidationStep[] = [];

  addStep(step: MoveValidationStep): void {
    this.steps.push(step);
  }

  validate(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
    pieceColor: Color,
  ): boolean {
    return this.steps.every(step => step.validate(from, to, board, pieceColor));
  }
}
