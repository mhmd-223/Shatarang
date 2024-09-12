import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { BishopMove } from '@services/move-services/move-validation/move-validator';

export class Bishop extends Piece {
  constructor(color: Color) {
    super(color, PieceName.BISHOP, 3, new BishopMove());

    this.directions = [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateMoves(position);
  }
}
