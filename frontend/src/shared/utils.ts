import { King } from '@models/pieces/king';
import { Color } from './color';
import { CellPosition } from './position';
import { BoardStateManager } from './board-state.manager';

type CheckResult = {
  isCheck: boolean;
  isCheckmate: boolean;
  kingPosition: CellPosition;
};

export class Utils {
  static isKingInCheck(color: Color): CheckResult {
    const flattendBoard = BoardStateManager.getInstance().currentBoard.flatMap(
      row => row,
    );

    const kingPosition = flattendBoard.find(
      cell =>
        cell.piece && cell.piece.color === color && cell.piece instanceof King,
    )!.position;

    // find opponent's pieces
    const opponentPieces = flattendBoard.filter(
      cell => cell.piece && cell.piece.color !== color,
    );

    const isCheck = opponentPieces.some(cell =>
      cell
        .piece!.calculatePossibleMoves(cell.position)
        .some(
          move =>
            cell.piece!.basicValidate(cell.position, move) &&
            move.row === kingPosition.row &&
            move.col === kingPosition.col,
        ),
    );

    return {
      isCheck,
      isCheckmate: false, // TODO: implement checkmate logic
      kingPosition,
    };
  }
}
