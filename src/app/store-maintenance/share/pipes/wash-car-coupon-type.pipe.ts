import { Pipe, PipeTransform } from '@angular/core';

/** 洗车服务劵类型 */
const WashCarCouponType = {
  1: '1次标准洗车',
  2: '1次标准洗车+1次打蜡'
};
@Pipe({
  name: 'washCarCouponType'
})
export class WashCarCouponTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WashCarCouponType[value];
    } else {
      result = WashCarCouponType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
