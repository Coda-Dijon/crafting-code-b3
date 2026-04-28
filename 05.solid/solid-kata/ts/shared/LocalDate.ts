export class LocalDate {
  constructor(
    public readonly year: number,
    public readonly month: number,
    public readonly day: number
  ) {}

  static now(): LocalDate {
    const d = new Date();
    return new LocalDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  static of(year: number, month: number, day: number): LocalDate {
    return new LocalDate(year, month, day);
  }
}
