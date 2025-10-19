export class EMA {
  private alpha: number;
  private value: number | null = null;
  constructor(windowSize: number) {
    this.alpha = 2 / (windowSize + 1);
  }
  next(x: number): number {
    if (this.value === null) {
      this.value = x;
    } else {
      this.value = this.alpha * x + (1 - this.alpha) * this.value;
    }
    return this.value;
  }
}


