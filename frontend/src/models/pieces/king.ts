import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { KingMove } from './move-validation';

export class King extends Piece {
  constructor(color: Color) {
    super(color, PieceName.KING, new KingMove());

    this.directions = [
      // like queen but only one step

      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateSingleStep(position);
  }
}
