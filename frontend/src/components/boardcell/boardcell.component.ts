import { Component, inject, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { BoardCell } from '@models/cell.model';
import { BoardService } from '@services/board.service';
import { ThemeService } from '@services/theme.service';

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
  private themeService = inject(ThemeService)

  getPiecePath(cell: BoardCell) {
    return this.themeService.getPiecePath(cell);
  }

  getCellStyle(cell: BoardCell) {
    const color = cell.isLight ? this.themeService.lightColor : this.themeService.darkColor
    let backgroundColor;

    if (cell.isClicked)
      backgroundColor = this.themeService.markClicked(color);
    else backgroundColor = color

    if (cell.isLastMove)
      backgroundColor = this.themeService.markLastMove(color);

    return {
      'background-color': backgroundColor
    }
  }

  onClick() {
    if (this.cell.piece && this.cell.isClickable) {
      this.cell.click();
    }
    this.boardService.clickCell(this.cell)
  }
}
