export class Utils {
  static isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }
}
