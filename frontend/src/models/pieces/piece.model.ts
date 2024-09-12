import { Color } from '@shared/color';
import { PieceName } from '@shared/piecename';
import { CellPosition } from '@shared/position';
import { MoveValidator } from '@services/move-services/move-validation/move-validator';
import { BoardStateManager } from '@shared/board-state.manager';
import { Utils } from '@shared/utils';

export abstract class Piece {
  protected directions: CellPosition[] = [];
  private boardStateManager = BoardStateManager.getInstance();
  private calculatedMovesCache = new Map<string, CellPosition[]>();
  private legalMovesCache = new Map<string, CellPosition[]>();

  protected constructor(
    public readonly color: Color,
    public readonly name: PieceName,
    public readonly points: number,
    private readonly moveValidator: MoveValidator,
  ) {
    this.boardStateManager.boardObservable.subscribe(_ =>
      this.legalMovesCache.clear(),
    );
  }

  calculateLegalMoves(position: CellPosition): CellPosition[] {
    const key = `${position.row},${position.col}`;
    if (this.legalMovesCache.has(key)) return this.legalMovesCache.get(key)!;

    const moves = this.calculatePossibleMoves(position).filter(move =>
      this.validate(position, move),
    );

    this.legalMovesCache.set(key, moves);

    return moves;
  }

  protected abstract calculatePossibleMoves(
    position: CellPosition,
  ): CellPosition[];

  protected calculateMoves(position: CellPosition, maxStep: number = Infinity) {
    const key = `${position.row},${position.col}`;
    if (this.calculatedMovesCache.has(key))
      return this.calculatedMovesCache.get(key)!;

    const moves: CellPosition[] = [];
    const { row, col } = position;

    this.directions.forEach(direction => {
      let step = 1;
      let move = {
        row: row + direction.row * step,
        col: col + direction.col * step,
      };

      while (this.isValidPos(move) && step <= maxStep) {
        moves.push(move);
        step++;
        move = {
          row: row + direction.row * step,
          col: col + direction.col * step,
        };
      }
    });

    this.calculatedMovesCache.set(key, moves);

    return moves;
  }

  private isValidPos(pos: CellPosition) {
    return Utils.isWithinBounds(pos.row, pos.col);
  }

  applyConstrains() {}

  private validate(from: CellPosition, to: CellPosition): boolean {
    return this.moveValidator.isLegalMove(from, to);
  }
}
