import { Pipe, PipeTransform } from '@angular/core';

/** 发货状态 */
const DeliveryStatus = {
  1: '未发货',
  2: '已发货',
  3: '已收货'
};

@Pipe({
  name: 'deliveryStatus'
})
export class DeliveryStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = DeliveryStatus[value];
    } else {
      result = DeliveryStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}

/** 订单状态 */
export const payStatus = {
  1: '待支付',
  2: '已支付',
  3: '已取消'
};

@Pipe({
  name: 'orderPayStatus'
})
export class PayStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return payStatus[value];
    } else {
      return payStatus[value];
    }
  }
}

/** 签收方式 */
export const confirmType = {
  1: '买家操作',
  2: '管理员操作',
  3: '系统自动'
};

@Pipe({
  name: 'confirmType'
})
export class ConfirmTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return confirmType[value];
    } else {
      return confirmType[value];
    }
  }
}
