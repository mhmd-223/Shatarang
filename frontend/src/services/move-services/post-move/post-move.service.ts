import { Injectable } from '@angular/core';
import { BoardCell } from '@models/cell.model';
import { King } from '@models/pieces/king';
import { Pawn } from '@models/pieces/pawn';
import { CellPosition } from '@shared/position';
import { Subject, Observable } from 'rxjs';
import {
  CaptureEvent,
  CastlingEvent,
  EnPassantEvent,
  Event,
  EventType,
  PromotionEvent,
} from './events';
import { Color } from '@shared/color';
import { Piece } from '@models/pieces/piece.model';

@Injectable({
  providedIn: 'root',
})
export class PostMoveService {
  private postMoveSubject = new Subject<Event>();

  triggerPostMoveEvent(
    from: CellPosition,
    to: CellPosition,
    board: BoardCell[][],
  ): void {
    const sourceCellPiece = board[from.row][from.col].piece!;
    const targetCellPiece = board[to.row][to.col].piece;
    let event: Event = { type: EventType.NORMAL_MOVE };
    let isNormalMove = true;

    if (sourceCellPiece instanceof King) {
      const colDiff = to.col - from.col;
      if (Math.abs(colDiff) === 2) {
        event = this.createCastlingEvent(from, colDiff > 0);
        this.postMoveSubject.next(event);
        isNormalMove = false;
      }
    }

    if (sourceCellPiece instanceof Pawn) {
      // En passant
      if (!targetCellPiece && Math.abs(from.col - to.col) === 1) {
        event = this.createEnPassantEvent(to, sourceCellPiece.color);
        this.postMoveSubject.next(event);
      }
      // Promotion
      if (to.row === 0 || to.row === 7) {
        event = this.createPromotionEvent(to, sourceCellPiece.color);
        this.postMoveSubject.next(event);
      }
      isNormalMove = false;
    }

    if (targetCellPiece) {
      event = this.createCaptureEvent(targetCellPiece);
      this.postMoveSubject.next(event);
      isNormalMove = false;
    }

    if (isNormalMove) this.postMoveSubject.next(event); // normal move
  }

  get postMoveEventObservable(): Observable<Event> {
    return this.postMoveSubject.asObservable();
  }

  private createCastlingEvent(
    kingPosition: CellPosition,
    isKingSide: boolean,
  ): CastlingEvent {
    return {
      type: EventType.CASTLING,
      initialRookPos: {
        row: kingPosition.row,
        col: isKingSide ? 7 : 0,
      },
      finalRookPos: {
        row: kingPosition.row,
        col: kingPosition.col + (isKingSide ? 1 : -1),
      },
    };
  }

  private createEnPassantEvent(
    to: CellPosition,
    pawnColor: Color,
  ): EnPassantEvent {
    const direction = pawnColor === Color.WHITE ? -1 : 1;

    return {
      type: EventType.EN_PASSANT,
      enemyPawnPos: {
        row: to.row - direction,
        col: to.col,
      },
    };
  }

  private createCaptureEvent(targetCellPiece: Piece): CaptureEvent {
    return {
      type: EventType.CAPTURE,
      caputredPiece: targetCellPiece,
    };
  }

  private createPromotionEvent(
    promotionCell: CellPosition,
    pieceColor: Color,
  ): PromotionEvent {
    return {
      type: EventType.PROMOTION,
      promotedPiecePos: promotionCell,
      promotedPieceColor: pieceColor,
    };
  }
}
