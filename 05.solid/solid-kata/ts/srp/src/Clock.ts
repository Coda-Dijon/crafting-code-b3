import { LocalDate } from '../../shared/LocalDate.js';

export class Clock {
  today(): LocalDate {
    return LocalDate.now();
  }
}
