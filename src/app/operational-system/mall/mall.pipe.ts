import { Pipe, PipeTransform } from '@angular/core';

/** 商品类型 */
const mallCommodityType = {
  1: '实物商品',
  2: '虚拟商品'
};

@Pipe({
  name: 'mallCommodityType'
})
export class MallCommodityTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value) {
      // 当直接传递字符串时的处理
      return mallCommodityType[value];
    } else {
      return mallCommodityType[value];
    }
  }
}

/** 发货状态 */
const DeliveryStatus = {
  1: '待发货',
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

/** 发货方式 */
const DeliveryMethod = {
  1: '物流发货',
  2: '无需配送',
};

@Pipe({
  name: 'deliveryMethod'
})
export class DeliveryMethodPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = DeliveryMethod[value];
    } else {
      result = DeliveryMethod[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 退款类型 */
const RefundType = {
  1: '全部退款',
  2: '部分退款',
  3: '--',
};

@Pipe({
  name: 'refundType'
})
export class RefundTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = RefundType[value];
    } else {
      result = RefundType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 退款状态 */
const RefundStatus = {
  1: '退款中',
  2: '退款完成',
  3: '退款失败',
};

@Pipe({
  name: 'refundStatus'
})
export class RefundStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = RefundStatus[value];
    } else {
      result = RefundStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 订单状态 */
@Pipe({
  name: 'orderStatusFormat'
})
export class OrderStatusFormatPipe implements PipeTransform {

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


/** 核销状态 */
const WriteOffStatus = {
  1: '未核销',
  2: '已核销',
  3: '已失效',
};

@Pipe({
  name: 'writeOffStatus'
})
export class WriteOffStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = WriteOffStatus[value];
    } else {
      result = WriteOffStatus[value];
    }
    if (!result) {
      result = '--';
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
  5: '已关闭',
  6: '已关闭',
};

@Pipe({
  name: 'realGoodsDeliveryStatus'
})
export class RealGoodsDeliveryStatusPipe implements PipeTransform {

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
  1: '客户签收',
  2: '管理员签收',
  3: '系统自动收货'
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

/** 支付方式 */
const PayType = {
  WX_XCX_SL: '微信支付',
  EC: '兑换码支付',
};

@Pipe({
  name: 'payType'
})
export class PayTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '';
    if (value === null || value === undefined || value === '' || value === 'other') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = PayType[value];
    } else {
      result = PayType[value];
    }
    if (!result) {
      result = '';
    }
    return result;
  }
}

/** 使用状态 */
const ExchangeStatus = {
  1: '未使用',
  2: '已使用',
};

@Pipe({
  name: 'exchangeStatus'
})
export class ExchangeStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ExchangeStatus[value];
    } else {
      result = ExchangeStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

