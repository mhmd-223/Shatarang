import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoardComponent } from '@components/board/board.component';
import { ClockComponent } from '@components/clock/clock.component';
import { Bishop } from '@models/pieces/bishop';
import { Knight } from '@models/pieces/knight';
import { Queen } from '@models/pieces/queen';
import { Rook } from '@models/pieces/rook';
import {
  EventType,
  PromotionEvent,
} from '@services/move-services/post-move/events';
import { PostMoveService } from '@services/move-services/post-move/post-move.service';
import { PlayerService } from '@services/player.service';
import { ThemeService } from '@services/theme.service';
import { Color } from '@shared/color';
import { Piece } from '@models/pieces/piece.model';
import { Utils } from '@shared/utils';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BoardComponent,
    ClockComponent,
    CommonModule,
    FormsModule,
    MatBadgeModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  playerService = inject(PlayerService);
  themeService = inject(ThemeService);
  postMoveService = inject(PostMoveService);
  isOverlayVisible: boolean = false;
  promotionPieces: Piece[] = [];

  private isPromotionEventActive = signal(false);

  constructor() {
    effect(() => {
      if (this.isPromotionEventActive()) return; // when there is promotion, don't manipulate clocks

      const currentPlayerColor = this.playerService.currentPlayer.color;

      if (currentPlayerColor === Color.WHITE) {
        this.playerService.whitePlayerClock.activate();
        this.playerService.blackPlayerClock.deactivate();
      } else {
        this.playerService.whitePlayerClock.deactivate();
        this.playerService.blackPlayerClock.activate();
      }
    });

    this.postMoveService.postMoveEventObservable.subscribe(event => {
      if (event.type === EventType.PROMOTION) {
        const color = (event as PromotionEvent).promotedPieceColor;

        this.isOverlayVisible = true;
        this.isPromotionEventActive.set(true);
        this.promotionPieces = [
          new Queen(color),
          new Rook(color),
          new Bishop(color),
          new Knight(color),
        ];
      }
    });
  }

  onPieceSelected(piece: Piece) {
    Utils.promotionPiece$.next(piece);
    this.isOverlayVisible = false;
    this.isPromotionEventActive.set(false);
  }
}
