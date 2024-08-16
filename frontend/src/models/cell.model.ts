import { Piece } from "./pieces/piece.model";

export class BoardCell {
  private _isClicked: boolean = false;
  private _isLastMove: boolean = false;
  private _isClickable: boolean = true;

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

  get isClickable(): boolean {
    return this._isClickable;
  }
  set isClickable(value: boolean) {
    this._isClickable = value;
  }
}

interface CellPosition {
  row: number,
  col: number
}
