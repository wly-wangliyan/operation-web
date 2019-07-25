import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Pipe({
  name: 'zEmpty'
})
export class ZEmptyPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (isNullOrUndefined(value) || value.trim() === '') {
      return '--';
    }
    return value;
  }
}
