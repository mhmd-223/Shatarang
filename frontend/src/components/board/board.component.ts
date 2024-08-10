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
  cells: BoardCell[] = [];

  constructor() {
    this.initBoard();
  }

  private initBoard(): void {
    this.cells = Array.from({ length: 64 }, (_, i) => {
      const row = Math.floor(i / 8); // Determine the row number (0 to 7)
      const col = i % 8; // Determine the column number (0 to 7)
      const isLight = (row + col) % 2 === 0; // Determine color based on row and column
      const piece = INITIAL_PIECES_SETUP[row]?.[col]; // Determine the initial piece

      return new BoardCell(isLight, piece);
    });
  }
}
