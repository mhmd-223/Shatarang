import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { BishopMove } from './move-validation';

export class Bishop extends Piece {
  constructor(color: Color) {
    super(color, PieceName.BISHOP, new BishopMove());

    this.directions = [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateMultiSteps(position);
  }
}
