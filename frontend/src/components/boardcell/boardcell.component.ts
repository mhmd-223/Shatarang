import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-boardcell',
  standalone: true,
  imports: [NgClass],
  templateUrl: './boardcell.component.html',
  styleUrl: './boardcell.component.css'
})
export class BoardcellComponent {
  @Input({ required: true, alias: 'light' })
  isLight!: boolean;

}
