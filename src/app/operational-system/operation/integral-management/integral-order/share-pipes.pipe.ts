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

/** 发货状态 */
const RealGoodsDeliveryStatus = {
  0: '待支付',
  1: '待发货',
  2: '已发货',
  3: '已发货',
  4: '已完成',
  5: '已关闭', /** 售后退款 */
  6: '已关闭', /** 超时未支付 */
};

@Pipe({
  name: 'commodityDeliveryStatus'
})
export class CommodityDeliveryStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = RealGoodsDeliveryStatus[value];
    } else {
      result = RealGoodsDeliveryStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 商品类型 */
const IntegralCommodityType = {
  1: '实物商品',
  2: '虚拟商品',
  3: '优惠券商品'
};

@Pipe({
  name: 'integralCommodityType'
})
export class IntegralCommodityTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    return IntegralCommodityType[value] || '--';
  }
}
