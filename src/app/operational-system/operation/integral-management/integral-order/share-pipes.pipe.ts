import { Pipe, PipeTransform } from '@angular/core';

/** 订单状态 */
@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value.pay_status === 1) {
      result = '待支付';
    } else if (value.pay_status === 2 && value.delivery_status === 1) {
      result = '待发货';
    } else if (value.order_status === 2 && value.pay_status !== 3) {
      result = '已完成';
    } else if (value.order_status !== 2 && value.delivery_status === 2 && value.pay_status !== 3) {
      result = '已发货';
    } else if (value.pay_status === 3) {
      result = '已关闭';
    }
    return result;
  }
}