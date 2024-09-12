import { Color } from '@shared/color';
import { Clock } from './clock.model';
import { Piece } from './pieces/piece.model';

export abstract class Player {
  private _capturedPieces: Piece[] = [];
  private _capturedPiecesPoints: number = 0;

  protected constructor(
    public readonly color: Color,
    public readonly clock: Clock,
  ) {}

  capture(enemyPiece: Piece) {
    this._capturedPiecesPoints += enemyPiece.points;
    this._capturedPieces.push(enemyPiece);
  }

  get capturedPieces() {
    return this._capturedPieces;
  }

  get capturedPiecesPoints(): number {
    return this._capturedPiecesPoints;
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
