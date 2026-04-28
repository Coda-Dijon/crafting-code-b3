import { Transaction } from './Transaction.js';

export interface TransactionRepository {
  add(transaction: Transaction): void;
  all(): Transaction[];
}
