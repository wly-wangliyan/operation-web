import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zCompleteNumber'
})
export class ZCompleteNumberPipe implements PipeTransform {



  /**
   * 转换方法
   * @param number 数字
   * @returns any
   */
  public transform(number: any): string {
    if (number && number !== 0 && !`'${number}'`.includes('.')) {
      return `${number}.00`;
    }
    if (number && number !== 0 && `'${number}'`.includes('.')) {
      return number.toFixed(2);
    }
    return number;
  }

}
