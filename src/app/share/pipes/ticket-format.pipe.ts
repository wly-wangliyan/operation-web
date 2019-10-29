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

/** 数字大于某个数就显示数字+ */
/**
 * 转换方法
 * @param number 数字
 * @param maxNumber 最大值
 * @returns any
 */

@Pipe({
  name: 'maxNumberDealPipe'
})
export class MaxNumberDealPipe implements PipeTransform {
  public transform(number: any, maxNumber = 999): string {
    if (number && Number(number) > maxNumber) {
      return `${maxNumber}+`;
    }
    return number;
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
  3: '已取消',
  4: '已完成'
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

/** 销售状态 */
const PayType = {
  1: '授信支付',
  2: '余额支付'
};

@Pipe({
  name: 'payType'
})
export class PayTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return PayType[value];
    } else {
      return PayType[value];
    }
  }
}

/** 有效期 */
const DelayType = {
  0: '游玩日期起有效',
  1: '下单日期起有效',
  2: '期票模式',
};

@Pipe({
  name: 'delayType'
})
export class DelayTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return DelayType[value];
    } else {
      return DelayType[value];
    }
  }
}


/** 退票规则 */
const RefundRule = {
  0: '有效期内可退：未使用订单末级分销商可退；过期订单供应商可退',
  1: '游玩日期内可退，阶梯退：未使用订单末级分销商可退；过期订单供应商可退',
  2: '不可退：分销商供应商都不可退',
  3: '随时退：未使用订单末级分销商可退；过期订单分销商可退，供应商可退',
  4: '不可退且是可提现',
};

@Pipe({
  name: 'refundRule'
})
export class RefundRulePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === -1 || value === '-1') {
      value = 4;
    } else if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return RefundRule[value];
    } else {
      return RefundRule[value];
    }
  }
}


/** 可验证时间 */
@Pipe({
  name: 'validateTimeLimit'
})
export class ValidateTimeLimitPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    if (value) {
      return '有效期内' + value.replace('|', '至');
    } else {
      return value;
    }
  }
}
