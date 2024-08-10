export class Piece {
  constructor(
    public color: Color,
    public name: PieceName
  ) { }
}

export enum Color {
  WHITE = 'w',
  BLACK = 'b'
}

export enum PieceName {
  PAWN = 'pawn',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king'
}
