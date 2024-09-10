import { Pawn } from '@models/pieces/pawn';

export class Utils {
  static isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  static enPassantState: EnPassantState | null = null;
}

type EnPassantState = {
  pawn: Pawn;
};
