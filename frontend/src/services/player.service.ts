import { Injectable, signal, WritableSignal } from '@angular/core';
import { Clock } from '@models/clock.model';
import { BlackPlayer, Player, WhitePlayer } from '@models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private whitePlayer = new WhitePlayer(new Clock(1));
  private blackPlayer = new BlackPlayer(new Clock(1));
  private currentPlayerSignal: WritableSignal<Player> = signal(
    this.whitePlayer,
  );

  get currentPlayer(): Player {
    return this.currentPlayerSignal();
  }

  changePlayer() {
    this.currentPlayerSignal.update(curr =>
      curr === this.whitePlayer ? this.blackPlayer : this.whitePlayer,
    );
  }

  get whitePlayerClock(): Clock {
    return this.whitePlayer.clock;
  }

  get blackPlayerClock(): Clock {
    return this.blackPlayer.clock;
  }
}
