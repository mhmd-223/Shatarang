import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { RookMove } from './move-validation';

export class Rook extends Piece {
  constructor(color: Color) {
    super(color, PieceName.ROOK, new RookMove());

    this.directions = [
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
    ];
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateMultiSteps(position);
  }
}
