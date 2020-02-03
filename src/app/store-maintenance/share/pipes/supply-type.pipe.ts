import { Pipe, PipeTransform } from '@angular/core';

/** 洗车服务类型 */
const SupplyType = {
  1: '第三方供应商',
  2: '门店自供'
};


@Pipe({
  name: 'supplyType'
})
export class SupplyTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = SupplyType[value];
    } else {
      result = SupplyType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
