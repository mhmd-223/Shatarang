import { Color } from '@shared/color';
import { Clock } from './clock.model';
import { Piece } from './pieces/piece.model';

export abstract class Player {
  private capturedPieces: Piece[] = [];

  protected constructor(
    public readonly color: Color,
    public readonly clock: Clock,
  ) {}

  capture(enemyPiece: Piece) {
    this.capturedPieces.push(enemyPiece);
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
