import { LocalDate } from '../../shared/LocalDate.js';

export class Transaction {
  constructor(
    private readonly _date: LocalDate,
    private readonly _amount: number
  ) {}

  date(): LocalDate {
    return this._date;
  }

  amount(): number {
    return this._amount;
  }
}
