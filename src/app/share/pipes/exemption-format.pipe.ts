import { Pipe, PipeTransform } from '@angular/core';

/** 办理流程 */
const ProcessFlow = {
  1: '待办理',
  2: '已提交办理',
  3: '制贴完成',
  4: '已发货',
  5: '已驳回',
  6: '已驳回并退款',
  7: '已确认收货',
};

@Pipe({
  name: 'exemptionFormat'
})
export class ExemptionFormatPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ProcessFlow[value];
    } else {
      result = ProcessFlow[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}

/** 订单状态 */
const ExemptionOrderStatus = {
  1: '未支付',
  2: '已支付',
  3: '已退款',
  4: '已完成',
  5: '已取消'
};

@Pipe({
  name: 'exemptionOrderStatus'
})
export class ExemptionOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ExemptionOrderStatus[value];
    } else {
      result = ExemptionOrderStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 驳回类型 */
const RejectType = {
  1: '未驳回',
  2: '提交材料不清晰',
  3: '存在未处理违章',
  4: '与车主协商一致',
  5: '其他'
};

@Pipe({
  name: 'rejectType'
})
export class RejectTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = RejectType[value];
    } else {
      result = RejectType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
