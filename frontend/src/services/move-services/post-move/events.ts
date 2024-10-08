import { Piece } from '@models/pieces/piece.model';
import { Color } from '@shared/color';
import { CellPosition } from '@shared/position';

export enum EventType {
  CASTLING,
  NORMAL_MOVE,
  EN_PASSANT,
  PROMOTION,
  CAPTURE,
}

export interface Event {
  type: EventType;
}

export interface CastlingEvent extends Event {
  type: EventType.CASTLING;
  initialRookPos: CellPosition;
  finalRookPos: CellPosition;
}

export interface EnPassantEvent extends Event {
  type: EventType.EN_PASSANT;
  enemyPawnPos: CellPosition;
}

export interface PromotionEvent extends Event {
  type: EventType.PROMOTION;
  promotedPiecePos: CellPosition;
  promotedPieceColor: Color;
}

export interface CaptureEvent extends Event {
  type: EventType.CAPTURE;
  caputredPiece: Piece;
}
