import { Pipe, PipeTransform } from '@angular/core';

/** 核销状态 */
const ExpenseStatus = {
  1: '已核销',
  2: '未核销',
  3: '已失效'
};

@Pipe({
  name: 'expenseStatus'
})
export class ExpenseStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ExpenseStatus[value];
    } else {
      result = ExpenseStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
