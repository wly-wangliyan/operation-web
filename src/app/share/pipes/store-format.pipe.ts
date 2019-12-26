import { Pipe, PipeTransform } from '@angular/core';
import { from } from 'rxjs';
import { distinct } from 'rxjs/operators';

/** 项目类型 */
const storeProjectType = {
  1: '机油',
  2: '机油滤清器'
};

@Pipe({
  name: 'storeProjectType'
})
export class StoreProjectTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = storeProjectType[value];
    } else {
      result = storeProjectType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}

/** 项目类别 */
export const StoreCategory = {
  1: '保养项目',
  2: '清洗养护项目',
  3: '维修项目'
};

@Pipe({
  name: 'storeCategory'
})
export class StoreCategoryPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return StoreCategory[value];
    } else if (value && value.length > 0) {
      // 当传递数组类型时的处理
      let str = '';
      from(value).subscribe((code: any) => {
        // 拼接字符串
        str = str ? str + '、' + StoreCategory[code] : StoreCategory[code];
      });
      return str;
    } else {
      return StoreCategory[value];
    }
  }

}

/** 订单状态 */
export const storePayStatus = {
  1: '未支付',
  2: '已支付',
  3: '已完成'
};

@Pipe({
  name: 'storePayStatus'
})
export class StorePayStatus implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return storePayStatus[value];
    } else {
      return storePayStatus[value];
    }
  }
}

/** 救援订单状态 */
const RescueOrderStatus = {
  1: '待支付',
  2: '已支付',
  3: '已取消',
  4: '已退款',
  5: '退款中'
};

@Pipe({
  name: 'rescueOrderStatus'
})
export class RescueOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = RescueOrderStatus[value];
    } else {
      result = RescueOrderStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 救援服务状态 */
const RescueServiceStatus = {
  1: '待接单',
  2: '待服务',
  3: '已完成',
  4: '已拒绝'
};

@Pipe({
  name: 'rescueServiceStatus'
})
export class RescueServiceStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = RescueServiceStatus[value];
    } else {
      result = RescueServiceStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 上门保养订单状态 */
const DoorOrderStatus = {
  1: '待支付',
  2: '已取消',
  3: '已完成',
  4: '待服务',
  5: '已关闭'
};

@Pipe({
  name: 'doorOrderStatus'
})
export class DoorOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = DoorOrderStatus[value];
    } else {
      result = DoorOrderStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 上门保养订单退款状态 */
const DoorRefundStatus = {
  1: '已部分退款',
  2: '已全额退款'
};

@Pipe({
  name: 'doorRefundStatus'
})
export class DoorRefundStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = DoorRefundStatus[value];
    } else {
      result = DoorRefundStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}


/** 上门保养退款订单状态 */
const DoorRefundOrderStatus = {
  0: '未申请退款',
  1: '退款中',
  2: '已退款',
  3: '退款失败'
};

@Pipe({
  name: 'doorRefundOrderStatus'
})
export class DoorRefundOrderStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = DoorRefundOrderStatus[value];
    } else {
      result = DoorRefundOrderStatus[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
