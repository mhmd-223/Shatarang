import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { KnightMove } from '@services/move-services/move-validation/move-validator';

export class Knight extends Piece {
  constructor(color: Color) {
    super(color, PieceName.KNIGHT, new KnightMove());

    this.directions = [
      { row: 2, col: 1 },
      { row: 2, col: -1 },
      { row: -2, col: 1 },
      { row: -2, col: -1 },
      { row: 1, col: 2 },
      { row: 1, col: -2 },
      { row: -1, col: 2 },
      { row: -1, col: -2 },
    ];
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateMoves(position, 1);
  }
}
