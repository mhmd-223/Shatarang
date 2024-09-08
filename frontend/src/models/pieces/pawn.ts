import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { CellPosition } from '@shared/position';
import { PawnMove } from '@services/move-services/move-validation/move-validator';

export class Pawn extends Piece {
  constructor(color: Color) {
    super(color, PieceName.PAWN, new PawnMove());

    this.directions = [
      { row: 1, col: 0 },
      { row: 1, col: 1 }, // for capture
      { row: 1, col: -1 }, // for capture
      { row: 2, col: 0 }, // initial move
    ];

    if (color === Color.WHITE)
      this.directions.forEach(direction => {
        direction.row *= -1;
        direction.col *= -1;
      });
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateMoves(position, 1);
  }
}
