import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pushPlanFormat'
})
export class PushPlanFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}

/** 推送人群 */
export const pushRange = {
  1: '全部',
  2: '领券未使用用户',
  3: '下单未支付用户',
  4: '自定义'
};

@Pipe({
  name: 'pushRange'
})
export class PushRangePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return pushRange[value];
    } else {
      return pushRange[value];
    }
  }
}

/** 推送人群 */
export const rangeType = {
  1: '指定优惠券模板ID',
  2: '指定优惠券组ID',
  3: '指定优惠券服务业务'
};

@Pipe({
  name: 'rangeType'
})
export class RangeTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return rangeType[value];
    } else {
      return rangeType[value];
    }
  }
}

/** 推送频次 */
export const pushSpeedType = {
  1: '触发后不再推送',
  2: '触发后持续推送',
};

@Pipe({
  name: 'pushSpeed'
})
export class PushSpeedPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return pushSpeedType[value];
    } else {
      return pushSpeedType[value];
    }
  }
}
