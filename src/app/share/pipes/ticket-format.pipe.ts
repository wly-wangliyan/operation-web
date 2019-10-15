import { Pipe, PipeTransform } from '@angular/core';
import { from } from 'rxjs';

/** 销售状态 */
const SaleStatus = {
  1: '销售中',
  2: '已下架'
};

@Pipe({
  name: 'saleStatus'
})
export class TicketFormatPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return SaleStatus[value];
    } else {
      return SaleStatus[value];
    }
  }
}

/** 销售状态 */
const ThirdSaleStatus = {
  1: '在售',
  2: '停售'
};

@Pipe({
  name: 'thirdSaleStatus'
})
export class ThirdSaleStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return ThirdSaleStatus[value];
    } else {
      return ThirdSaleStatus[value];
    }
  }
}

/** 订单状态 */
const OrderStatus = {
  1: '待支付',
  2: '已支付',
  3: '已取消'
};

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return OrderStatus[value];
    } else {
      return OrderStatus[value];
    }
  }
}

/** 订单状态 */
const OrderUseStatus = {
  1: '已使用',
  2: '已取消',
  3: '未使用',
  4: '已过期'
};

@Pipe({
  name: 'orderUseStatus'
})
export class OrderUseStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return OrderUseStatus[value];
    } else {
      return OrderUseStatus[value];
    }
  }
}
