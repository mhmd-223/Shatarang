import { Component, inject, OnInit } from '@angular/core';
import { BoardcellComponent } from "../boardcell/boardcell.component";
import { BoardCell } from "../boardcell/cell.model";
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [BoardcellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  board: BoardCell[][] = [];

  private boardService = inject(BoardService)


  ngOnInit(): void {
    this.board = this.boardService.board
    this.boardService.movement$.subscribe((newBoard: BoardCell[][]) => this.board = newBoard);
  }
}
