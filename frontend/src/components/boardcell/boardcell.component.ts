import { Component, inject, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { BoardCell } from './cell.model';
import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-boardcell',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './boardcell.component.html',
  styleUrl: './boardcell.component.css'
})
export class BoardcellComponent {
  @Input({ required: true })
  cell!: BoardCell;

  private boardService = inject(BoardService)

  getPiecePath(cell: BoardCell) {
    const path = 'chess-pieces/Merida';
    const color = cell.piece?.color ?? 'w';
    const name = cell.piece?.name ?? 'pawn';

    return `${path}/${color}-${name}.svg`
  }

  onClick() {
    this.boardService.clickCell(this.cell)
  }
}
