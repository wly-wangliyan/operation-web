import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

export class ProjectEntity extends EntityBase {
  public project_id: string = undefined; // 项目ID
  public project_category: number = undefined; // 项目类别
  public project_name: string = undefined; // 项目名称
  public project_type: number = undefined; // 项目类型
  public project: ProjectEntity = undefined; // 配套项目
  public remark: string = undefined; // 描述

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'project') {
      return ProjectEntity;
    }
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProjectManagemantHttpService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取项目列表 */
  public requestProjectListData(): Observable<Array<ProjectEntity>> {
    const httpUrl = `${this.domain}/admin/brokers`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<ProjectEntity> = [];
      res.body.forEach(data => {
        tempList.push(ProjectEntity.Create(data));
      });
      return tempList;
    }));
  }
}
