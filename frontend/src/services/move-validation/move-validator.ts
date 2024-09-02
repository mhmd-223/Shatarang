import {
  DestinationValidationStep,
  KingSafetyValidationStep,
} from '@services/move-validation/general-validation-steps';
import { MoveValidationPipeline } from '@services/move-validation/move-validation-pipeline';
import {
  PathClearValidationStep,
  PawnSpecificValidationStep,
} from '@services/move-validation/piece-specific-validation-steps';
import { BoardStateManager } from '@shared/board-state.manager';
import { CellPosition } from '@shared/position';

export abstract class MoveValidator {
  protected boardStateManager = BoardStateManager.getInstance();
  protected validationPipeline: MoveValidationPipeline;

  constructor() {
    this.validationPipeline = new MoveValidationPipeline();
    // Adding general validation steps
    this.validationPipeline.addStep(new DestinationValidationStep());
    this.validationPipeline.addStep(new KingSafetyValidationStep());
  }

  abstract isLegalMove(from: CellPosition, to: CellPosition): boolean;
}

export class PawnMove extends MoveValidator {
  constructor() {
    super();
    // Adding pawn-specific validation step
    this.validationPipeline.addStep(new PawnSpecificValidationStep());
  }

  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const piece = board[from.row][from.col].piece!;

    return this.validationPipeline.validate(from, to, board, piece.color);
  }
}

export class KnightMove extends MoveValidator {
  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const piece = board[from.row][from.col].piece!;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Knight's L-shape move
    const isLShape =
      (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    if (!isLShape) return false;

    return this.validationPipeline.validate(from, to, board, piece.color);
  }
}

export class BishopMove extends MoveValidator {
  constructor() {
    super();
    // Adding path clearance for diagonal moves
    this.validationPipeline.addStep(new PathClearValidationStep());
  }

  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const piece = board[from.row][from.col].piece!;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Bishop moves diagonally
    if (rowDiff !== colDiff) return false;

    return this.validationPipeline.validate(from, to, board, piece.color);
  }
}

export class RookMove extends MoveValidator {
  constructor() {
    super();
    // Adding path clearance for straight moves
    this.validationPipeline.addStep(new PathClearValidationStep());
  }

  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const piece = board[from.row][from.col].piece!;

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    // Rook moves horizontally or vertically
    if (rowDiff !== 0 && colDiff !== 0) return false;

    return this.validationPipeline.validate(from, to, board, piece.color);
  }
}

export class QueenMove extends MoveValidator {
  private bishopMoveValidator = new BishopMove();
  private rookMoveValidator = new RookMove();

  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Queen moves like a bishop or rook
    const isDiagonal = rowDiff === colDiff;
    const isStraight = rowDiff === 0 || colDiff === 0;

    if (isDiagonal) {
      return this.bishopMoveValidator.isLegalMove(from, to);
    }

    if (isStraight) {
      return this.rookMoveValidator.isLegalMove(from, to);
    }

    return false;
  }
}

export class KingMove extends MoveValidator {
  constructor() {
    super();
    // TODO: add King-specific validations like castling
  }

  override isLegalMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.boardStateManager.currentBoard;
    const piece = board[from.row][from.col].piece!;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // King moves one square in any direction
    const isOneSquareMove = rowDiff <= 1 && colDiff <= 1;

    if (!isOneSquareMove) return false;

    return this.validationPipeline.validate(from, to, board, piece.color);
  }
}
