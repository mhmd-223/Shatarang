import { Component } from '@angular/core';
import { BoardcellComponent } from "../boardcell/boardcell.component";
import { BoardCell } from "../boardcell/cell.model";
import { INITIAL_PIECES_SETUP } from "../boardcell/piece.model";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [BoardcellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board: BoardCell[][] = [];

  constructor() {
    this.initBoard();
  }

  private initBoard(): void {
    const BOARD_SIZE = 8;

    this.board = Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => {
        const isLight = (row + col) % 2 === 0; // Determine color based on row and column
        const piece = INITIAL_PIECES_SETUP[row]?.[col]; // Determine the initial piece

        return new BoardCell(isLight, piece, { row, col });
      })
    );
  }

}
