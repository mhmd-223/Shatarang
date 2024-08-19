import { BoardCell } from '@models/cell.model';
import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { CellPosition } from '@shared/position';

export abstract class Piece {
  protected directions: CellPosition[] = [];
  private readonly BOARD_SIZE = 8;

  protected constructor(
    public readonly color: Color,
    public readonly name: PieceName,
    private readonly strategy: MoveStrategy,
  ) {}

  abstract calculatePossibleMoves(position: CellPosition): CellPosition[];

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
    return this.strategy.isLegalMove(from, to, board);
  }
}

export abstract class MoveStrategy {
  abstract isLegalMove(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
  ): boolean;

  protected validateInitially(
    move: CellPosition,
    color: Color,
    board: BoardCell[][],
  ): boolean {
    const cell = board[move.row][move.col];

    if (!cell.piece) return true;
    if (cell.piece.color !== color) return true;

    return false;
  }
}
