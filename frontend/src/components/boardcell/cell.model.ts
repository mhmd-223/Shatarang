import { Piece } from "./piece.model";

export class BoardCell {
  constructor(public isLight: boolean) { }


  public set piece(p: Piece) {
    this.piece = p;
  }

}
