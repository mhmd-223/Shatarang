import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { QueenMove } from '@services/move-services/move-validation/move-validator';

export class Queen extends Piece {
  constructor(color: Color) {
    super(color, PieceName.QUEEN, 9, new QueenMove());

    this.directions = [
      // rook directions
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },

      // bishop directions
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
