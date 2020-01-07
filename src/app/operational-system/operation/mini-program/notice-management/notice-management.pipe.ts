import { Pipe, PipeTransform } from '@angular/core';

/** 通知显示位置 */
const DisplayPlace = {
  1: '洗车首页',
  2: '洗车下单页',
  3: '机场停车首页'
};

@Pipe({
  name: 'displayPlace'
})
export class DisplayPlacePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = DisplayPlace[value];
    } else {
      result = DisplayPlace[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }

}
