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

/** 钱数：分转换成元 */

@Pipe({
  name: 'centPriceChange'
})
export class CentPriceChangePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value) {
      return (Number(value) / 100).toFixed(2);
    } else {
      return value;
    }
  }
}

/** 处理第三方数据为空返回‘0’的情况 */

@Pipe({
  name: 'nullDataFilter'
})
export class NullDataFilterPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '' || value === '0') {
      return '--';
    } else {
      return value;
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

/** 订单使用状态 */
const OrderUseStatus = {
  0: '未使用',
  1: '已使用',
  2: '已过期',
  3: '已取消',
  5: '已撤改',
  6: '已撤销',
  7: '部分使用'
};

@Pipe({
  name: 'orderUseStatus'
})
export class OrderUseStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = OrderUseStatus[value];
    } else {
      result = OrderUseStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

