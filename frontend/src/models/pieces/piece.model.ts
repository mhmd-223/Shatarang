import { Color } from "@shared/color";
import { PieceName } from "@shared/piecename";

export class Piece {
  constructor(
    public readonly color: Color,
    public readonly name: PieceName
  ) { }
}

const backrank = [PieceName.ROOK, PieceName.KNIGHT, PieceName.BISHOP, PieceName.QUEEN, PieceName.KING, PieceName.BISHOP, PieceName.KNIGHT, PieceName.ROOK];

export const INITIAL_PIECES_SETUP: { [row: number]: Piece[] } = {
  0: backrank.map(name => new Piece(Color.BLACK, name)),
  1: Array(8).fill(null).map(() => new Piece(Color.BLACK, PieceName.PAWN)),
  6: Array(8).fill(null).map(() => new Piece(Color.WHITE, PieceName.PAWN)),
  7: backrank.map(name => new Piece(Color.WHITE, name))
}
