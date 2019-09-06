import { Pipe, PipeTransform } from '@angular/core';
import { from } from 'rxjs';
import { distinct } from 'rxjs/operators';

const ProjectType = {
  1: '保养项目',
  2: '清洗养护项目',
  3: '维修项目'
};

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return ProjectType[value];
    } else if (value && value.length > 0) {
      // 当传递数组类型时的处理
      let str = '';
      from(value).subscribe((code: any) => {
        // 拼接字符串
        str = str ? str + '、' + ProjectType[code] : ProjectType[code];
      });
      return str;
    } else {
      return ProjectType[value];
    }
  }

}
