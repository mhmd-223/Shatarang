import { BoardCell } from '@models/cell.model';
import { MoveStrategy, Piece } from './piece.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { CellPosition } from '@shared/position';

export class Pawn extends Piece {
  protected override directions: CellPosition[];

  constructor(color: Color) {
    super(color, PieceName.PAWN, new PawnMoveStrategy());

    this.directions = [
      { row: 1, col: 0 },
      { row: 1, col: 1 }, // for capture
      { row: 1, col: -1 }, // for capture
      { row: 2, col: 0 }, // initial move
    ];

    if (color === Color.WHITE)
      this.directions.forEach((direction) => {
        direction.row *= -1;
        direction.col *= -1;
      });
  }

  override calculatePossibleMoves(position: CellPosition): CellPosition[] {
    const moves: CellPosition[] = [];
    const { row, col } = position;

    this.directions.forEach((direction) => {
      const { row: dRow, col: dCol } = direction;
      const move = { row: row + dRow, col: col + dCol };

      if (this.isValidPos(move)) moves.push(move);
    });

    return moves;
  }

}

class PawnMoveStrategy extends MoveStrategy {


  isLegalMove(from: CellPosition, to: CellPosition, board: BoardCell[][]): boolean {
    const color = board[from.row][from.col].piece!.color;
    const targetCell = board[to.row][to.col];
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    // Move forward by 1 or 2 squares
    if (colDiff === 0) {
      if (rowDiff === (color === Color.WHITE ? -1 : 1) && !targetCell.piece) return true
      if (rowDiff === (color === Color.WHITE ? -2 : 2) &&
        !targetCell.piece &&
        (color === Color.WHITE ? from.row === 6 : from.row === 1)) {
        // Pawn's initial 2-square move
        const middleCell = board[from.row + (color === Color.WHITE ? -1 : 1)][from.col];
        if (!middleCell.piece) return true;
      }
      return false;
    }

    // Diagonal attack
    if (colDiff === 1 && rowDiff === (color === Color.WHITE ? -1 : 1) && targetCell.piece) {
      return targetCell.piece.color !== color;
    }

    return false;
  }
}
