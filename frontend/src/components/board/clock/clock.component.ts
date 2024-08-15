import { NgClass } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ClockService } from './clock.service';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [NgClass],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent implements OnInit {
  @Input({ required: true })
  player!: string

  private clockService = inject(ClockService)
  private clock: any;

  ngOnInit(): void {
    this.clock = this.clockService.getClock(this.player);
  }

  get isActive(): boolean {
    return this.clock.isActive
  }

  get isTimeUp() {
    return this.clock.isTimeUp
  }

  get time() {
    return this.clock.time
  }
}
