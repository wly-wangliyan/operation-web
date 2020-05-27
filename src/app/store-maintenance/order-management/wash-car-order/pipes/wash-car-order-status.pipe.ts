import { Pipe, PipeTransform } from '@angular/core';

/** 订单状态 */
const WashCarOrderStatus = {
  1: '待支付',
  2: '已取消',
  3: '待核销',
  4: '已完成',
  5: '已关闭',
  6: '已失效'
};

@Pipe({
  name: 'washCarOrderStatus'
})
export class WashCarOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WashCarOrderStatus[value];
    } else {
      result = WashCarOrderStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}

/** 订单申请状态 */
const WashCarApplyStatus = {
  1: '处理中',
  2: '申请通过',
  3: '申请驳回',
  4: '已完成'
};

@Pipe({
  name: 'washCarApplyStatus'
})
export class WashCarApplyStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WashCarApplyStatus[value];
    } else {
      result = WashCarApplyStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}

/** 订单状态 */
const clientType = {
  1: '小程序',
  2: 'APP-安卓',
  3: 'APP-IOS'
};

@Pipe({
  name: 'clientType'
})
export class ClientTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = clientType[value];
    } else {
      result = clientType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}
