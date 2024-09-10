import { Color } from '@shared/color';
import { Clock } from './clock.model';
import { Piece } from './pieces/piece.model';

export abstract class Player {
  private _capturedPieces: Piece[] = [];

  protected constructor(
    public readonly color: Color,
    public readonly clock: Clock,
  ) {}

  capture(enemyPiece: Piece) {
    this._capturedPieces.push(enemyPiece);
  }

  get capturedPieces() {
    return this._capturedPieces;
  }
}

export class WhitePlayer extends Player {
  constructor(clock: Clock) {
    super(Color.WHITE, clock);
  }
}

export class BlackPlayer extends Player {
  constructor(clock: Clock) {
    super(Color.BLACK, clock);
  }
}
