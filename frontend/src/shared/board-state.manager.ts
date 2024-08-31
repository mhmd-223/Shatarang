import { BehaviorSubject, Observable } from 'rxjs';
import { BoardCell } from '@models/cell.model';
import { CellPosition } from './position';

export class BoardStateManager {
  private static instance: BoardStateManager;
  private boardSubject: BehaviorSubject<BoardCell[][]>;
  private hypotheticalBoard: BoardCell[][] | null = null;

  private constructor() {
    this.boardSubject = new BehaviorSubject<BoardCell[][]>([]);
  }

  static getInstance(): BoardStateManager {
    if (!BoardStateManager.instance)
      BoardStateManager.instance = new BoardStateManager();

    return BoardStateManager.instance;
  }

  get boardObservable(): Observable<BoardCell[][]> {
    return this.boardSubject.asObservable();
  }

  updateBoard(board: BoardCell[][]): void {
    this.boardSubject.next(board);
  }

  get currentBoard(): BoardCell[][] {
    return this.hypotheticalBoard || this.boardSubject.getValue();
  }

  startHypotheticalMove(from: CellPosition, to: CellPosition): void {
    const currentBoard = this.boardSubject.getValue();

    this.hypotheticalBoard = currentBoard.map(row =>
      row.map(cell => cell.clone()),
    );
    this.hypotheticalBoard[to.row][to.col].piece =
      this.hypotheticalBoard[from.row][from.col].piece;
    this.hypotheticalBoard[from.row][from.col].piece = undefined;
  }

  endHypotheticalMove(): void {
    this.hypotheticalBoard = null;
  }
}
