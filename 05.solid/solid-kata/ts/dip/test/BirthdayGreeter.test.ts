import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MonthDay } from '../../shared/MonthDay.js';
import { BirthdayGreeter } from '../src/BirthdayGreeter.js';
import { EmployeeBuilder } from './EmployeeBuilder.js';

const CURRENT_MONTH = 7;
const CURRENT_DAY_OF_MONTH = 9;
const TODAY = MonthDay.of(CURRENT_MONTH, CURRENT_DAY_OF_MONTH);

describe('BirthdayGreeter', () => {
  const employeeRepository = { findEmployeesBornOn: vi.fn() };
  const clock = { monthDay: vi.fn() };
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends greeting email to employee', () => {
    clock.monthDay.mockReturnValue(TODAY);
    const employee = EmployeeBuilder.anEmployee().build();
    employeeRepository.findEmployeesBornOn.mockReturnValue([employee]);

    const birthdayGreeter = new BirthdayGreeter(employeeRepository as any, clock as any);
    birthdayGreeter.sendGreetings();

    expect(writeSpy).toHaveBeenCalledWith(
      `To:${employee.email}, Subject: Happy birthday!, Message: Happy birthday, dear ${employee.firstName}!`
    );
  });
});
