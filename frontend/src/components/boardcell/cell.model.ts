import { Piece } from "./piece.model";

export class BoardCell {
  constructor(public isLight: boolean, public piece?: Piece) { }
}
