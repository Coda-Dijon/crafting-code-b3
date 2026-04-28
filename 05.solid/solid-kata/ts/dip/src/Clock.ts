import { MonthDay } from '../../shared/MonthDay.js';

export class Clock {
  monthDay(): MonthDay {
    return MonthDay.now();
  }
}
