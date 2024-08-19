import { effect, inject, Injectable } from '@angular/core';
import { BoardService } from '@services/board.service';
import { Clock } from '@models/clock.model';

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private boardService = inject(BoardService);
  private clocks = new Map<string, Clock>();

  constructor() {
    this.clocks.set('w', new Clock(1));
    this.clocks.set('b', new Clock(1));

    effect(() => {
      const currentPlayer = this.boardService.currentPlayer;

      if (currentPlayer === 'w') {
        this.clocks.get('w')!.activate();
        this.clocks.get('b')!.deactivate();
      } else {
        this.clocks.get('b')!.activate();
        this.clocks.get('w')!.deactivate();
      }
    });
  }

  getClock(player: string): Clock {
    return this.clocks.get(player)!;
  }
}
