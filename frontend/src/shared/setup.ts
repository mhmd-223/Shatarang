import { Pawn } from '@models/pieces/pawn';
import { Piece } from '@models/pieces/piece.model';
import { Color } from './color';

export const INITIAL_PIECES_SETUP: { [row: number]: Piece[] } = {
  // 0: backrank.map(name => new Piece(Color.BLACK, name)),
  1: Array(8)
    .fill(null)
    .map(() => new Pawn(Color.BLACK)),
  6: Array(8)
    .fill(null)
    .map(() => new Pawn(Color.WHITE)),
  // 7: backrank.map(name => new Piece(Color.WHITE, name))
};
