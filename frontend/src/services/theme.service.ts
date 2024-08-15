import { Injectable } from '@angular/core';
import { THEMES } from '../../public/themes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private THEME_KEY = 'themeName';
  private currentTheme!: string


  constructor() {
    this.loadTheme()
  }


  get lightColor() {
    return THEMES[this.currentTheme].light
  }

  get darkColor() {
    return THEMES[this.currentTheme].dark
  }

  set changeTheme(themeName: string) {
    localStorage.setItem(this.THEME_KEY, themeName);
    this.loadTheme();
  }

  markClicked(color: string) {
    return `color-mix(in srgb, ${color}, rgba(0, 100, 0, 0.8))`
  }

  markLastMove(color: string) {
    return `color-mix(in srgb, ${color}, rgba(127, 127, 0, 0.8))`
  }

  private loadTheme() {
    this.currentTheme = localStorage.getItem(this.THEME_KEY) ?? 'brown';
  }
}
