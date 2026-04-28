import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalDate } from '../../shared/LocalDate.js';
import { AccountService } from '../src/AccountService.js';
import { Transaction } from '../src/Transaction.js';

const POSITIVE_AMOUNT = 100;
const NEGATIVE_AMOUNT = -POSITIVE_AMOUNT;
const TODAY = LocalDate.of(2017, 9, 6);
const TRANSACTIONS = [
  new Transaction(LocalDate.of(2014, 4, 1), 1000),
  new Transaction(LocalDate.of(2014, 4, 2), -100),
  new Transaction(LocalDate.of(2014, 4, 10), 500),
];

describe('AccountService', () => {
  const clock = { today: vi.fn() };
  const transactionRepository = { add: vi.fn(), all: vi.fn() };
  const consoleMock = { printLine: vi.fn() };
  let accountService: AccountService;

  beforeEach(() => {
    vi.clearAllMocks();
    accountService = new AccountService(
      transactionRepository as any,
      clock as any,
      consoleMock as any
    );
  });

  it('deposits amount into the account', () => {
    clock.today.mockReturnValue(TODAY);
    accountService.deposit(POSITIVE_AMOUNT);
    expect(transactionRepository.add).toHaveBeenCalledWith(
      new Transaction(TODAY, POSITIVE_AMOUNT)
    );
  });

  it('withdraws amount from the account', () => {
    clock.today.mockReturnValue(TODAY);
    accountService.withdraw(POSITIVE_AMOUNT);
    expect(transactionRepository.add).toHaveBeenCalledWith(
      new Transaction(TODAY, NEGATIVE_AMOUNT)
    );
  });

  it('prints statement', () => {
    transactionRepository.all.mockReturnValue(TRANSACTIONS);
    accountService.printStatement();
    const calls = consoleMock.printLine.mock.calls;
    expect(calls[0][0]).toBe('DATE | AMOUNT | BALANCE');
    expect(calls[1][0]).toBe('10/04/2014 | 500.00 | 1400.00');
    expect(calls[2][0]).toBe('02/04/2014 | -100.00 | 900.00');
    expect(calls[3][0]).toBe('01/04/2014 | 1000.00 | 1000.00');
  });
});
