import { Pipe, PipeTransform } from '@angular/core';

/** 洗车服务类型 */
const ProjectName = {
  11: '机油',
  12: '机油滤清器',
  10: '蓄电池'
};

@Pipe({
  name: 'projectName'
})
export class ProjectNamePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ProjectName[value];
    } else {
      result = ProjectName[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
  }
}
