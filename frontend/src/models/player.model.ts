import { Color } from '@shared/color';
import { Clock } from './clock.model';
import { Piece } from './pieces/piece.model';

export class Player {
  private pieces: Piece[] = [];

  constructor(
    public readonly color: Color,
    public readonly clock: Clock,
  ) {}
}
