import { effect, inject, Injectable } from '@angular/core';
import { BoardStateManager } from '@shared/board-state.manager';
import { CellPosition } from '@shared/position';
import { PlayerService } from './player.service';
import { MoveExecutorService } from './move-services/move-executor.service';
import { PostMoveService } from './move-services/post-move/post-move.service';
import {
  CaptureEvent,
  CastlingEvent,
  EnPassantEvent,
  Event,
  EventType,
  PromotionEvent,
} from './move-services/post-move/events';
import { Utils } from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class GameLogicService {
  private boardStateManager = BoardStateManager.getInstance();
  private playerService = inject(PlayerService);
  private moveExecutor = inject(MoveExecutorService);
  private postMoveService = inject(PostMoveService);
  private eventHandlers = new Map<EventType, (event: Event) => void>();
  private promotionPosition: CellPosition | null = null;

  constructor() {
    effect(() => {
      this.boardStateManager.currentBoard.forEach(row =>
        row.forEach(
          cell =>
            (cell.isClickable =
              cell.piece?.color === this.playerService.currentPlayer.color),
        ),
      );
    });

    this.addHandlers();
    this.postMoveService.postMoveEventObservable.subscribe(event => {
      const handler = this.eventHandlers.get(event.type);
      if (handler) handler(event);
    });
    Utils.promotionPiece$.subscribe(piece => {
      if (piece && this.promotionPosition) {
        const { row, col } = this.promotionPosition;
        this.boardStateManager.currentBoard[row][col].piece = piece;
      }
    });
  }

  movePiece(from: CellPosition, to: CellPosition): boolean {
    // Reset the en passant capture ability
    Utils.enPassantState = null;

    const board = this.boardStateManager.currentBoard; // board state before movement
    const success = this.executeMove(from, to);

    if (success) {
      this.postMoveService.triggerPostMoveEvent(from, to, board);
      this.playerService.changePlayer();
      return true;
    }

    return false;
  }

  private executeMove(from: CellPosition, to: CellPosition): boolean {
    const board = this.copyBoard();
    const success = this.moveExecutor.movePiece(from, to, board);

    if (success) {
      this.boardStateManager.updateBoard(board);
      return true;
    }

    return false;
  }

  private copyBoard() {
    return this.boardStateManager.currentBoard.map(row =>
      row.map(cell => cell.clone()),
    );
  }

  private addHandlers() {
    this.eventHandlers.set(EventType.CASTLING, (event: Event) => {
      const castlingEvent = event as CastlingEvent;
      this.executeMove(
        castlingEvent.initialRookPos,
        castlingEvent.finalRookPos,
      );
    });
    this.eventHandlers.set(EventType.EN_PASSANT, (event: Event) => {
      const enPassantEvent = event as EnPassantEvent;
      const { row, col } = enPassantEvent.enemyPawnPos;
      const enemyPawn = this.boardStateManager.currentBoard[row][col].piece!;

      this.playerService.currentPlayer.capture(enemyPawn);
      this.executeMove(
        enPassantEvent.enemyPawnPos,
        enPassantEvent.enemyPawnPos,
      );
    });
    this.eventHandlers.set(EventType.CAPTURE, (event: Event) => {
      const caputreEvent = event as CaptureEvent;
      this.playerService.currentPlayer.capture(caputreEvent.caputredPiece);
    });
    this.eventHandlers.set(EventType.PROMOTION, (event: Event) => {
      this.promotionPosition = (event as PromotionEvent).promotedPiecePos;
    });
    this.eventHandlers.set(EventType.NORMAL_MOVE, (_: Event) => {});
  }
}
