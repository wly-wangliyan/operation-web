import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';


const RefundType = {
  1: '部分退款',
  2: '全部退款'
};

@Pipe({
  name: 'refundType'
})
export class RefundTypePipe implements PipeTransform {

  transform(real_pay: number, refund_fee: number): any {
    if (isNullOrUndefined(real_pay) || isNullOrUndefined(refund_fee)) {
      return '--';
    } else if (real_pay >= 0 && refund_fee > 0) {
      if (real_pay === refund_fee) {
        return RefundType[2];
      } else if (real_pay > refund_fee) {
        return RefundType[1];
      }
    } else {
      return '--';
    }
  }
}

/** 退款操作状态 */
const CommonRefundStatus = {
  0: '未申请退款',
  1: '退款中',
  2: '退款完成',
  3: '退款失败'
};

@Pipe({
  name: 'commonRefundStatus'
})
export class CommonRefundStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = CommonRefundStatus[value];
    } else {
      result = CommonRefundStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
