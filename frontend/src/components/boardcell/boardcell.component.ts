import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { BoardCell } from './cell.model';

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

  getPiecePath(cell: BoardCell) {
    const path = 'chess-pieces/Merida';

    return `${path}/${cell.piece?.color}-${cell.piece?.name}.svg`
  }
}
