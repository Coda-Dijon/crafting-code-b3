import { LocalDate } from '../../shared/LocalDate.js';
import { Clock } from './Clock.js';
import { Console } from './Console.js';
import { Transaction } from './Transaction.js';
import { TransactionRepository } from './TransactionRepository.js';

export class AccountService {
  private static readonly STATEMENT_HEADER = 'DATE | AMOUNT | BALANCE';

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly clock: Clock,
    private readonly console: Console
  ) {}

  deposit(amount: number): void {
    this.transactionRepository.add(this.transactionWith(amount));
  }

  withdraw(amount: number): void {
    this.transactionRepository.add(this.transactionWith(-amount));
  }

  printStatement(): void {
    this.printHeader();
    this.printTransactions();
  }

  private printHeader(): void {
    this.printLine(AccountService.STATEMENT_HEADER);
  }

  private printTransactions(): void {
    const transactions = this.transactionRepository.all();
    let balance = 0;
    const lines = transactions.map(transaction => {
      balance += transaction.amount();
      return this.statementLine(transaction, balance);
    });
    lines.reverse().forEach(line => this.printLine(line));
  }

  private transactionWith(amount: number): Transaction {
    return new Transaction(this.clock.today(), amount);
  }

  private statementLine(transaction: Transaction, balance: number): string {
    return `${this.formatDate(transaction.date())} | ${this.formatNumber(transaction.amount())} | ${this.formatNumber(balance)}`;
  }

  private formatDate(date: LocalDate): string {
    const dd = String(date.day).padStart(2, '0');
    const mm = String(date.month).padStart(2, '0');
    return `${dd}/${mm}/${date.year}`;
  }

  private formatNumber(amount: number): string {
    return amount.toFixed(2);
  }

  private printLine(line: string): void {
    this.console.printLine(line);
  }
}
