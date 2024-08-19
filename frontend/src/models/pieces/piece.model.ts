import { BoardCell } from '@models/cell.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { CellPosition } from '@shared/position';
import { Move } from './move-validation';

export abstract class Piece {
  protected directions: CellPosition[] = [];
  private readonly BOARD_SIZE = 8;

  protected constructor(
    public readonly color: Color,
    public readonly name: PieceName,
    private readonly moveValidator: Move,
  ) {}

  abstract calculatePossibleMoves(position: CellPosition): CellPosition[];

  protected calculateSingleStep(position: CellPosition) {
    const moves: CellPosition[] = [];
    const { row, col } = position;

    this.directions.forEach(direction => {
      const { row: dRow, col: dCol } = direction;
      const move = { row: row + dRow, col: col + dCol };

      if (this.isValidPos(move)) moves.push(move);
    });

    return moves;
  }

  protected calculateMultiSteps(position: CellPosition) {
    const moves: CellPosition[] = [];
    const { row, col } = position;

    this.directions.forEach(direction => {
      let step = 1;
      let move = {
        row: row + direction.row * step,
        col: col + direction.col * step,
      };

      while (this.isValidPos(move)) {
        moves.push(move);
        step++;
        move = {
          row: row + direction.row * step,
          col: col + direction.col * step,
        };
      }
    });

    return moves;
  }

  protected isValidPos(pos: CellPosition) {
    const { row, col } = pos;

    return (
      row >= 0 && row < this.BOARD_SIZE && col >= 0 && col < this.BOARD_SIZE
    );
  }

  applyConstrains() {}

  validate(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
  ): boolean {
    return this.moveValidator.isLegalMove(from, to, board);
  }
}
