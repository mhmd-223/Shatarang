import { CellPosition } from '@shared/position';
import { Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { RookMove } from '@services/move-services/move-validation/move-validator';

export class Rook extends Piece {
  private _hasMoved = false;

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
    return this.calculateMoves(position);
  }

  get hasMoved() {
    return this._hasMoved;
  }

  override applyConstrains(): void {
    this._hasMoved = true;
  }
}
