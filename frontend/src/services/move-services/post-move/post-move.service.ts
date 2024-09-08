import { Injectable } from '@angular/core';
import { BoardCell } from '@models/cell.model';
import { King } from '@models/pieces/king';
import { Pawn } from '@models/pieces/pawn';
import { CellPosition } from '@shared/position';
import { Subject, Observable } from 'rxjs';
import { CastlingEvent, Event, EventType } from './events';

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

    if (sourceCellPiece instanceof King) {
      const colDiff = to.col - from.col;
      if (Math.abs(colDiff) === 2) {
        event = this.createCastlingEvent(from, colDiff > 0);
      }
    }

    if (sourceCellPiece instanceof Pawn) {
      if (!targetCellPiece && Math.abs(from.col - to.col) === 1) {
        // TODO: create and trigger en-passant event
      }
      if (to.row === 0 || to.row === 7) {
        // TODO: create and trigger promotion event
      }
    }

    if (targetCellPiece) {
      // TODO: create and trigger capture event
    }

    this.postMoveSubject.next(event);
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
}
