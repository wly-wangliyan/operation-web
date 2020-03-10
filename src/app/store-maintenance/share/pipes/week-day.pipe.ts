import { Pipe, PipeTransform } from '@angular/core';

const WeekDay = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
}

@Pipe({
  name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WeekDay[value];
    } else {
      result = WeekDay[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
