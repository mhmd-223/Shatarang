import { Piece } from "./piece.model";

export class BoardCell {
  private _isClicked: boolean = false;
  private _isLastMove: boolean = false;

  constructor(
    public isLight: boolean,
    public position: CellPosition,
    public piece?: Piece,
  ) { }

  get isClicked() {
    return this._isClicked;
  }

  click() {
    this._isClicked = !this._isClicked;
  }

  get isLastMove(): boolean {
    return this._isLastMove;
  }

  set isLastMove(value: boolean) {
    this._isLastMove = value;
  }
}

interface CellPosition {
  row: number,
  col: number
}
