import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';

export class ProjectEntity extends EntityBase {
  public project_id: string = undefined; // 项目ID
  public project_name: string = undefined; // 项目名称
  public project_type: string = undefined; // 项目类型
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

  constructor() { }
}
