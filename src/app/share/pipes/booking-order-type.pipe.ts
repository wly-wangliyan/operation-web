import { Pipe, PipeTransform } from '@angular/core';

/** 订单状态 */
export const BookingOrderStatus = {
  1: '未支付',
  2: '已支付',
  3: '已退款',
  4: '已入场',
  5: '已取消'
};

@Pipe({
  name: 'bookingOrderStatus'
})
export class BookingOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return BookingOrderStatus[value];
    } else {
      return BookingOrderStatus[value];
    }
  }
}
