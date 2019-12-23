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
