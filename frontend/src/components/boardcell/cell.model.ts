import { Piece } from "./piece.model";

export class BoardCell {
  constructor(
    public isLight: boolean,
    public position: CellPosition,
    public piece?: Piece,
  ) { }
}

interface CellPosition {
  row: number,
  col: number
}
