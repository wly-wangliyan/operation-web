import { Pipe, PipeTransform } from '@angular/core';

/** 商品类型 */
const CommodityType = {
  1: '实物商品',
  2: '虚拟商品',
  3: '优惠券商品'
};

@Pipe({
  name: 'commodityType'
})
export class CommodityTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined || value === '') {
      return '--';
    }
    return CommodityType[value] || '--';
  }
}
