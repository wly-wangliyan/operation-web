import { Pipe, PipeTransform } from '@angular/core';

/** 机油类型 */
const OilType = {
  1: '全合成',
  2: '半合成',
  3: '矿物质'
};

@Pipe({
  name: 'oilType'
})
export class OilTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = OilType[value];
    } else {
      result = OilType[value];
    }
    if (!result) {
      result = '' || value;
    }
    return result;
  }
}
