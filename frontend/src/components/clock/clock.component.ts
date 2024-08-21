import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Clock } from '@models/clock.model';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [NgClass],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css',
})
export class ClockComponent {
  @Input({ required: true })
  clock!: Clock;

  get isActive(): boolean {
    return this.clock.isActive;
  }

  get isTimeUp() {
    return this.clock.isTimeUp;
  }

  get time() {
    return this.clock.time;
  }
}
