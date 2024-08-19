import { Bishop } from '@models/pieces/bishop';
import { King } from '@models/pieces/king';
import { Knight } from '@models/pieces/knight';
import { Pawn } from '@models/pieces/pawn';
import { Piece } from '@models/pieces/piece.model';
import { Queen } from '@models/pieces/queen';
import { Rook } from '@models/pieces/rook';
import { Color } from '@shared/color';

const createPawns = (color: Color): Pawn[] =>
  Array(8)
    .fill(null)
    .map(() => new Pawn(color));

const createBackRank = (color: Color): Piece[] => [
  new Rook(color),
  new Knight(color),
  new Bishop(color),
  new Queen(color),
  new King(color),
  new Bishop(color),
  new Knight(color),
  new Rook(color),
];

export const INITIAL_PIECES_SETUP: { [row: number]: Piece[] } = {
  0: createBackRank(Color.BLACK),
  1: createPawns(Color.BLACK),
  6: createPawns(Color.WHITE),
  7: createBackRank(Color.WHITE),
};
