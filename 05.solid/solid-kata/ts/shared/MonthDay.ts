export class MonthDay {
  constructor(
    public readonly month: number,
    public readonly day: number
  ) {}

  static now(): MonthDay {
    const d = new Date();
    return new MonthDay(d.getMonth() + 1, d.getDate());
  }

  static of(month: number, day: number): MonthDay {
    return new MonthDay(month, day);
  }
}
