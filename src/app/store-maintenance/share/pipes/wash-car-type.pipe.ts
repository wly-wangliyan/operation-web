import { Pipe, PipeTransform } from '@angular/core';

/** 洗车服务类型 */
const WashCarType = {
  1: '5座小型车',
  2: 'SUV/MPV'
};

@Pipe({
  name: 'washCarType'
})
export class WashCarTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WashCarType[value];
    } else {
      result = WashCarType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
