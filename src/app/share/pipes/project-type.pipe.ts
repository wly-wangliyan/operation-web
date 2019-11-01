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
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }
    if (value && (typeof value === 'string')) {
      // 当直接传递字符串时的处理
      result = ProjectType[value];
    } else {
      result = ProjectType[value];
    }
    if (!result) {
      result = '--';
    }
    return result;
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

/** 订单状态 */
export const payStatus = {
  1: '未支付',
  2: '已支付',
  3: '已完成'
};

@Pipe({
  name: 'payStatus'
})
export class PayStatusPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (!value) {
      return '--';
    } else if (value && (typeof value === 'string')) {
      return payStatus[value];
    } else {
      return payStatus[value];
    }
  }
}
