import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'zMaxLength'
})
export class ZMaxLengthPipe implements PipeTransform {

  /**
   * 转换方法
   * @param message 文本
   * @param maxLength max长度
   * @param dot 是否显示省略号
   * @returns any
   */
  public transform(message: any, maxLength = 10, dot = true): string {
    if (message && message.length > maxLength) {
      return message.substr(0, maxLength) + (dot ? '...' : '');
    }
    return message;
  }

}
