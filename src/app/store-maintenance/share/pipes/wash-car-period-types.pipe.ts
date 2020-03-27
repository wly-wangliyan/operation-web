import { Pipe, PipeTransform } from '@angular/core';

/** 活动时间类型 */
const WashCarPeriodType = {
  1: '每日',
  2: '每周',
  3: '每月',
  4: '自定义'
};
@Pipe({
  name: 'washCarPeriodTypes'
})
export class WashCarPeriodTypesPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WashCarPeriodType[value];
    } else {
      result = WashCarPeriodType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
