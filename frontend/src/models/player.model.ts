import { Color } from '@shared/color';
import { Clock } from './clock.model';
import { Piece } from './pieces/piece.model';
import { CellPosition } from '@shared/position';
import { signal, WritableSignal } from '@angular/core';

export abstract class Player {
  private capturedPieces: Piece[] = [];
  private kingPositionSignal: WritableSignal<CellPosition>;

  protected constructor(
    public readonly color: Color,
    public readonly clock: Clock,
    kingPosition: CellPosition,
  ) {
    this.kingPositionSignal = signal(kingPosition);
  }

  updateKingPosition(newPos: CellPosition) {
    this.kingPositionSignal.set(newPos);
  }

  get kingPosition(): CellPosition {
    return this.kingPositionSignal();
  }

  capture(enemyPiece: Piece) {
    this.capturedPieces.push(enemyPiece);
  }
}

export class WhitePlayer extends Player {
  constructor(clock: Clock) {
    super(Color.WHITE, clock, { row: 7, col: 4 });
  }
}

export class BlackPlayer extends Player {
  constructor(clock: Clock) {
    super(Color.BLACK, clock, { row: 0, col: 4 });
  }
}
