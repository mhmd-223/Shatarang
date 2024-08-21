import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from '@components/board/board.component';
import { ClockComponent } from '@components/clock/clock.component';
import { PlayerService } from '@services/player.service';
import { Color } from '@shared/color';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent, ClockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  playerService = inject(PlayerService);

  constructor() {
    effect(() => {
      const currentPlayerColor = this.playerService.currentPlayer.color;

      if (currentPlayerColor === Color.WHITE) {
        this.playerService.whitePlayerClock.activate();
        this.playerService.blackPlayerClock.deactivate();
      } else {
        this.playerService.whitePlayerClock.deactivate();
        this.playerService.blackPlayerClock.activate();
      }
    });
  }
}
