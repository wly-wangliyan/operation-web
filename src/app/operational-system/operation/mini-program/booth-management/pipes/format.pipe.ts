import { Pipe, PipeTransform } from '@angular/core';

/** 支持格式 */
const FormatType = {
  1: 'PNG',
  2: 'JPG',
  3: 'GIF'
};

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }

    result = FormatType[value] || '--';

    return result;
  }
}
