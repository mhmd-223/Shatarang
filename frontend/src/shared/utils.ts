import { Pawn } from '@models/pieces/pawn';
import { Piece } from '@models/pieces/piece.model';
import { BehaviorSubject } from 'rxjs';

export class Utils {
  static isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  static enPassantState: EnPassantState | null = null;
  static promotionPiece$ = new BehaviorSubject<Piece | null>(null);
}

type EnPassantState = {
  pawn: Pawn;
};
