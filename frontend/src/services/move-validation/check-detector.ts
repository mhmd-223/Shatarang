import { BoardCell } from '@models/cell.model';
import { Bishop } from '@models/pieces/bishop';
import { King } from '@models/pieces/king';
import { Knight } from '@models/pieces/knight';
import { Pawn } from '@models/pieces/pawn';
import { Piece } from '@models/pieces/piece.model';
import { Queen } from '@models/pieces/queen';
import { Rook } from '@models/pieces/rook';
import { BoardStateManager } from '@shared/board-state.manager';
import { Color } from '@shared/color';
import { CellPosition } from '@shared/position';
import { Utils } from '@shared/utils';

export class CheckDetector {
  private static instance: CheckDetector;
  private boardStateManager = BoardStateManager.getInstance();

  private constructor() {}

  static create(): CheckDetector {
    if (!CheckDetector.instance) {
      CheckDetector.instance = new CheckDetector();
    }
    return CheckDetector.instance;
  }

  isKingInCheck(color: Color): CheckResult {
    const board = this.boardStateManager.currentBoard;
    const kingPosition = this.findKingPosition(color, board);
    const isCheck = this.isUnderAttack(kingPosition, color);

    return { kingPosition, isCheck };
  }

  private findKingPosition(color: Color, board: BoardCell[][]): CellPosition {
    return board
      .flat()
      .find(cell => cell.piece?.color === color && cell.piece instanceof King)!
      .position;
  }

  private isUnderAttack(kingPosition: CellPosition, color: Color): boolean {
    return (
      this.checkDirectional(kingPosition, color, verticalHorizontalDirections, [
        Rook,
        Queen,
      ]) ||
      this.checkDirectional(kingPosition, color, diagonalDirections, [
        Bishop,
        Queen,
      ]) ||
      this.checkKnightAttack(kingPosition, color) ||
      this.checkPawnAttack(kingPosition, color)
    );
  }

  private checkDirectional(
    kingPosition: CellPosition,
    color: Color,
    directions: CellPosition[],
    pieceTypes: (typeof Piece)[],
  ): boolean {
    const board = this.boardStateManager.currentBoard;

    return directions.some(({ row: rowDir, col: colDir }) => {
      let { row, col } = kingPosition;

      while (Utils.isWithinBounds((row += rowDir), (col += colDir))) {
        const piece = board[row][col]?.piece;
        if (piece) {
          return (
            piece.color !== color &&
            pieceTypes.some(type => piece instanceof type)
          );
        }
      }

      return false;
    });
  }

  private checkKnightAttack(kingPosition: CellPosition, color: Color): boolean {
    const knightMoves = [
      { row: 2, col: 1 },
      { row: 2, col: -1 },
      { row: -2, col: 1 },
      { row: -2, col: -1 },
      { row: 1, col: 2 },
      { row: 1, col: -2 },
      { row: -1, col: 2 },
      { row: -1, col: -2 },
    ];
    const board = this.boardStateManager.currentBoard;

    return knightMoves.some(({ row: dRow, col: dCol }) => {
      const newRow = kingPosition.row + dRow;
      const newCol = kingPosition.col + dCol;
      const piece =
        Utils.isWithinBounds(newRow, newCol) && board[newRow][newCol]?.piece;

      return piece && piece.color !== color && piece instanceof Knight;
    });
  }

  private checkPawnAttack(kingPosition: CellPosition, color: Color): boolean {
    const board = this.boardStateManager.currentBoard;
    const rowDir = color === Color.WHITE ? -1 : 1;
    const pawnAttackPositions = [
      { row: kingPosition.row + rowDir, col: kingPosition.col - 1 },
      { row: kingPosition.row + rowDir, col: kingPosition.col + 1 },
    ];

    return pawnAttackPositions.some(({ row, col }) => {
      const piece = Utils.isWithinBounds(row, col) && board[row][col]?.piece;
      return piece && piece.color !== color && piece instanceof Pawn;
    });
  }
}

type CheckResult = {
  kingPosition: CellPosition;
  isCheck: boolean;
};

const verticalHorizontalDirections: CellPosition[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

const diagonalDirections: CellPosition[] = [
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 },
];
