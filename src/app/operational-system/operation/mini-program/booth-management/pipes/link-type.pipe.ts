import { Pipe, PipeTransform } from '@angular/core';

/** 跳转链接 */
const LinkType = {
  1: '视频链接',
  2: 'H5链接',
  3: '小程序原生页',
  4: '第三方小程序'
};

@Pipe({
  name: 'linkType'
})
export class LinkTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }

    result = LinkType[value] || '--';

    return result;
  }
}
