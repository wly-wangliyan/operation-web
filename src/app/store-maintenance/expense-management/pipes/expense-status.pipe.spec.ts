import { ExpenseStatusPipe } from './expense-status.pipe';

describe('ExpenseStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ExpenseStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
