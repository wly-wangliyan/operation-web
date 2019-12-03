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
