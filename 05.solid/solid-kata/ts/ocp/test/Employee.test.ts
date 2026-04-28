import { describe, expect, it } from 'vitest';
import { Employee } from '../src/Employee.js';
import { EmployeeType } from '../src/EmployeeType.js';

const BONUS = 100;
const SALARY = 1000;

describe('Employee', () => {
  it('does not add bonus to engineer pay amount', () => {
    const employee = new Employee(SALARY, BONUS, EmployeeType.ENGINEER);
    expect(employee.payAmount()).toBe(SALARY);
  });

  it('adds bonus to manager pay amount', () => {
    const employee = new Employee(SALARY, BONUS, EmployeeType.MANAGER);
    expect(employee.payAmount()).toBe(SALARY + BONUS);
  });
});
