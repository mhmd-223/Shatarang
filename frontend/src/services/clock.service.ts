import { effect, inject, Injectable } from '@angular/core';
import { BoardService } from '@services/board.service';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  private boardService = inject(BoardService)
  private clocks = new Map<string, Clock>()

  constructor() {
    this.clocks.set('w', new Clock(1))
    this.clocks.set('b', new Clock(1))

    effect(() => {
      const currentPlayer = this.boardService.currentPlayer

      if (currentPlayer === 'w') {
        this.clocks.get('w')!.activate()
        this.clocks.get('b')!.deactivate()
      } else {
        this.clocks.get('b')!.activate()
        this.clocks.get('w')!.deactivate()
      }
    })
  }

  getClock(player: string): Clock {
    return this.clocks.get(player)!
  }
}

class Clock {
  hours: number;
  minutes: number;
  seconds: number;
  private interval: any = null
  private _isActive: boolean = false;

  constructor(minutes: number, seconds: number = 0, hours: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.normalize();
  }

  activate() {
    this._isActive = true
    this.startClock();
  }

  deactivate() {
    this._isActive = false
    this.stopClock();
  }


  increment(seconds: number) {
    this.seconds += seconds;
    this.normalize();
    return this;
  }

  get time() {
    const hours = this.hours === 0 ? '' : this.pad(this.hours) + ':';

    return `${hours}${this.pad(this.minutes)}:${this.pad(this.seconds)}`;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get isTimeUp(): boolean {
    return this.hours === 0 && this.minutes === 0 && this.seconds === 0;
  }

  private pad(value: number) {
    return value.toString().padStart(2, '0');
  }

  private startClock() {
    if (!this.interval) {
      this.interval = setInterval(() => this.countDown(), 1000);
    }
  }

  private stopClock() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private countDown() {
    if (!this.isTimeUp) {
      this.seconds--;
      this.normalize();
    }

    return this.isTimeUp;
  }

  // Normalize the time to ensure minutes and seconds are within bounds
  private normalize() {
    // Normalize seconds and minutes
    if (this.seconds < 0) {
      const minutesToSubtract = Math.ceil(-this.seconds / 60);
      this.minutes -= minutesToSubtract;
      this.seconds += minutesToSubtract * 60;
    }
    if (this.minutes < 0) {
      const hoursToSubtract = Math.ceil(-this.minutes / 60);
      this.hours -= hoursToSubtract;
      this.minutes += hoursToSubtract * 60;
    }

    // Normalize positive bounds
    if (this.seconds >= 60) {
      this.minutes += Math.floor(this.seconds / 60);
      this.seconds %= 60;
    }
    if (this.minutes >= 60) {
      this.hours += Math.floor(this.minutes / 60);
      this.minutes %= 60;
    }

    // Normalize hours for 12-hour format
    this.hours %= 12;
    if (this.hours < 0) {
      this.hours += 12;
    }
  }
}
