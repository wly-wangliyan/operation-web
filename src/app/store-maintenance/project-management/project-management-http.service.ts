import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpService, LinkResponse } from '../../core/http.service';
import { EntityBase } from '../../../utils/z-entity';
import { HttpResponse } from '@angular/common/http';

// 保养项目
export class ProjectEntity extends EntityBase {
  public project_id: string = undefined; // string	项目id-主键
  public project_num: string = undefined; // string	项目编号 10:蓄电池, 11:机油, 12:机油滤净器
  public project_name: string = undefined; // string	项目名称
  public related_project_name: string = undefined; // string	配套项目名称 机油滤清器 机油 蓄电池
  public specification: SpecificationEntity = new SpecificationEntity(); // json	规格 {'type': 1, 'name': 'xxx', 'unit': 'xxx'} 1:数值
  public description: string = undefined; // string	描述
  public param_list: Array<ParamEntity> = []; // Array 保养项目参数
  public is_deleted = undefined; // bool	逻辑删除
  public deleted_time: number = undefined; // float	删除时间
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'param_list') {
      return ParamEntity;
    }
    if (propertyName === 'specification') {
      return SpecificationEntity;
    }
    return null;
  }
}

// 保养项目参数
export class SpecificationEntity extends EntityBase {
  public type: number = undefined; // int	类型
  public name: string = undefined; // string	名称
  public unit: string = undefined; // string	单位
}

// 保养项目参数
export class ParamEntity extends EntityBase {
  public param_id: string = undefined; // string	参数id-主键
  public project: ProjectEntity = undefined; // object	项目对象Project
  public param_name: string = undefined; // string	参数名称 机油标号：'oil_num' 机油类型：'oil_type' api等级：'oil_api' 商品产地：'oil_place' 有效期：'oil_expire'
  public param_type: string = undefined; // string	参数类型 1：自定义选项 2：自定义文本
  public is_filled = undefined; // bool	是否必填
  public is_recommended = undefined; // bool	是否推荐
  public word_limit: string = undefined; // string	字数限制
  public option: Array<any> = []; // array	选项
  public is_deleted = undefined; // bool	逻辑删除
  public deleted_time: number = undefined; // float	删除时间
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'project') {
      return ProjectEntity;
    }
    return null;
  }
}

export class ProjectResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ProjectEntity> {
    const tempList: Array<ProjectEntity> = [];
    results.forEach(res => {
      tempList.push(ProjectEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementHttpService {

  private domain = environment.STORE_DOMAIN; // 保养域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取项目管理列表
   * @param searchParams 条件检索参数
   * @returns Observable<ProjectResponse>
   */
  public requestProjectListData(): Observable<ProjectResponse> {
    const httpUrl = `${this.domain}/admin/projects`;
    const searchParams = {
      page_num: 1,
      page_size: 45
    };
    return this.httpService.get(httpUrl, searchParams).pipe(map(res => new ProjectResponse(res)));
  }

  /**
   * 通过linkUrl继续请求项目管理列表
   * @param string url linkUrl
   * @returns Observable<ProjectResponse>
   */
  public continueProjectListData(url: string): Observable<ProjectResponse> {
    return this.httpService.get(url).pipe(map(res => new ProjectResponse(res)));
  }

  /**
   * 获取全部项目管理列表
   * @returns Observable<ProjectResponse>
   */
  public requestProjectListAll(): Observable<ProjectResponse> {
    const httpUrl = `${this.domain}/admin/projects/all`;
    return this.httpService.get(httpUrl).pipe(map(res => new ProjectResponse(res)));
  }

  /**
   * 编辑保养项目参数
   * @param string project_id 项目id
   * @param string param_id 参数id
   * @param option Array 选项数组
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditParamData(project_id: string, param_id: string, optionList: Array<any>): Observable<HttpResponse<any>> {
    const param = {option: optionList};
    return this.httpService.put(this.domain + `/admin/projects/${project_id}/params/${param_id}`, JSON.stringify(param));
  }
}
