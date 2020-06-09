import { Pipe, PipeTransform } from '@angular/core';

/** 核销状态 */
const ArrivalOrderStatus = {
  1: '待支付',
  2: '待收货',
  3: '待服务',
  4: '已取消',
  5: '已完成',
  6: '已关闭'
};

@Pipe({
  name: 'arrivalOrderStatus'
})
export class ArrivalOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ArrivalOrderStatus[value];
    } else {
      result = ArrivalOrderStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
