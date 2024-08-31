import { Component, inject, OnInit } from '@angular/core';
import { BoardcellComponent } from '../boardcell/boardcell.component';
import { BoardCell } from '@models/cell.model';
import { BoardService } from '@services/board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [BoardcellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  board: BoardCell[][] = [];

  private boardService = inject(BoardService);

  ngOnInit(): void {
    this.board = this.boardService.board;
    this.boardService.board$.subscribe(
      (newBoard: BoardCell[][]) => (this.board = newBoard),
    );
  }
}
