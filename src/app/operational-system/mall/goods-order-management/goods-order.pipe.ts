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
  3: '未退款',
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
  0: '未申请退款',
  1: '退款中',
  2: '已退款',
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
  0: '未支付',
  1: '待发货',
  2: '已发货',
  3: '已发货',
  4: '已完成',
  5: '已关闭 | 订单已全额退款，交易自动关闭',
  6: '已关闭 | 订单超时未支付，交易自动关闭',
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
