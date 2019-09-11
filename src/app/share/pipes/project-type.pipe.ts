import { Pipe, PipeTransform } from '@angular/core';
import { from } from 'rxjs';
import { distinct } from 'rxjs/operators';

/** 项目类型 */
const ProjectType = {
  1: '配件',
  2: '服务'
};

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    }
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

/** 项目类别 */
export const ProjectCategory = {
  1: '保养项目',
  2: '清洗养护项目',
  3: '维修项目'
};

@Pipe({
  name: 'projectCategory'
})
export class ProjectCategoryPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      return ProjectCategory[value];
    } else if (value && value.length > 0) {
      // 当传递数组类型时的处理
      let str = '';
      from(value).subscribe((code: any) => {
        // 拼接字符串
        str = str ? str + '、' + ProjectCategory[code] : ProjectCategory[code];
      });
      return str;
    } else {
      return ProjectCategory[value];
    }
  }

}
