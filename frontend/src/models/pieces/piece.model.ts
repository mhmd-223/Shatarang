import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { CellPosition } from '@shared/position';
import { MoveValidator } from './move-validation';
import { BoardStateManager } from '@shared/board-state.manager';

export abstract class Piece {
  protected directions: CellPosition[] = [];
  private readonly BOARD_SIZE = 8;
  private moveCache = new Map<string, CellPosition[]>();
  private boardStateManager = BoardStateManager.getInstance();

  protected constructor(
    public readonly color: Color,
    public readonly name: PieceName,
    private readonly moveValidator: MoveValidator,
  ) {}

  abstract calculatePossibleMoves(position: CellPosition): CellPosition[];

  protected calculateSingleStep(position: CellPosition) {
    const key = `${position.row},${position.col}`;
    if (this.moveCache.has(key)) return this.moveCache.get(key)!;

    const moves: CellPosition[] = [];
    const { row, col } = position;

    this.directions.forEach(direction => {
      const { row: dRow, col: dCol } = direction;
      const move = { row: row + dRow, col: col + dCol };

      if (this.isValidPos(move)) moves.push(move);
    });

    this.moveCache.set(key, moves);

    return moves;
  }

  protected calculateMultiSteps(position: CellPosition) {
    const key = `${position.row},${position.col}`;
    if (this.moveCache.has(key)) return this.moveCache.get(key)!;

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

    this.moveCache.set(key, moves);

    return moves;
  }

  protected isValidPos(pos: CellPosition) {
    const { row, col } = pos;

    return (
      row >= 0 && row < this.BOARD_SIZE && col >= 0 && col < this.BOARD_SIZE
    );
  }

  applyConstrains() {}

  validate(from: CellPosition, to: CellPosition): boolean {
    if (!this.basicValidate(from, to)) return false;

    this.boardStateManager.startHypotheticalMove(from, to);
    const isValid = !this.moveValidator.isKingInCheck(this.color);
    this.boardStateManager.endHypotheticalMove();

    return isValid;
  }

  basicValidate(from: CellPosition, to: CellPosition): boolean {
    return this.moveValidator.isLegalMove(from, to);
  }
}
