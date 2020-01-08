import { Pipe, PipeTransform } from '@angular/core';

/** 页面 */
const PageLayout = {
  1: '车辆认证完成页',
  2: '实名认证完成页',
};

@Pipe({
  name: 'pageLayout'
})
export class PageLayoutPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = PageLayout[value];
    } else {
      result = PageLayout[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}

/** 落地页 */
const LandingPageType = {
  1: '小程序原生页',
  2: 'H5',
  3: '视频链接',
};

@Pipe({
  name: 'landingPageType'
})
export class LandingPageTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = LandingPageType[value];
    } else {
      result = LandingPageType[value];
    }
    if (!result) {
      result = '';
    }
    return result;
  }

}
