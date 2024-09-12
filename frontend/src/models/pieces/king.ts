import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { KingMove } from '@services/move-services/move-validation/move-validator';

export class King extends Piece {
  private _hasMoved = false;

  constructor(color: Color) {
    super(color, PieceName.KING, Infinity, new KingMove());

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

      // castling
      { row: 0, col: 2 },
      { row: 0, col: -2 },
    ];
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    return this.calculateMoves(position, 1);
  }

  get hasMoved() {
    return this._hasMoved;
  }

  override applyConstrains(): void {
    this._hasMoved = true;
  }
}
