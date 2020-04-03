import { Pipe, PipeTransform } from '@angular/core';

/** 办理流程 */
const BoothType = {
  1: '轮播图',
  2: '焦点图'
};

@Pipe({
  name: 'boothType'
})
export class BoothTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }

    result = BoothType[value];

    if (!result) {
      result = '--';
    }
    return result;
  }
}
