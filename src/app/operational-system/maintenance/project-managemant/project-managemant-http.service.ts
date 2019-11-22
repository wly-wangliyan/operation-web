import { Injectable, EventEmitter } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { file_import } from '../../../../utils/file-import';

// 保养项目实体
export class ProjectEntity extends EntityBase {
  public upkeep_item_id: string = undefined; // 项目ID
  public upkeep_item_name: string = undefined; // 保养项目名称
  public upkeep_item_num: string = undefined; // 保养项目序号 必须以项目类别数字开头
  public upkeep_item_type: number = undefined; // 保养项目类型 1.配件 2.服务
  public upkeep_item_category: number = undefined; // 保养项目类别 1.保养项目 2.清洗养护项目 3.维修项目
  public upkeep_item_relation: ProjectEntity = undefined; // 保养项目配套
  public upkeep_item_content: string = undefined; // 保养项目描述
  public created_time: number = undefined;
  public updated_time: string = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'upkeep_item_relation') {
      return ProjectEntity;
    }
    return null;
  }
}

// 添加、编辑 保养项目
export class ProjectParams extends EntityBase {
  public upkeep_item_name: string = undefined; // 保养项目名称
  public upkeep_item_num: string = undefined; // 保养项目序号
  public upkeep_item_type: number = undefined; // int 保养项目类型 1.配件 2.服务
  public upkeep_item_category: number = undefined; // int 保养项目类别 1.保养项目 2.清洗养护项目 3.维修项目
  public upkeep_item_relation = ''; //  保养项目配套id
  public upkeep_item_content: string = undefined; // 保养项目描述
}

// 获取可用的项目列表参数
export class RelationParams extends EntityBase {
  public upkeep_item_id: string = undefined; // 保养项目项目ID
  public upkeep_item_category: number = undefined; // int 保养项目类别 1.保养项目 2.清洗养护项目 3.维修项目
}

@Injectable({
  providedIn: 'root'
})
export class ProjectManagemantHttpService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取项目列表 */
  public requestProjectListData(): Observable<Array<ProjectEntity>> {
    const httpUrl = `${this.domain}/upkeep_items`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<ProjectEntity> = [];
      res.body.forEach(data => {
        tempList.push(ProjectEntity.Create(data));
      });
      return tempList;
    }));
  }

  /** 获取可用的项目列表
   * @param params RelationParams 项目id及类别
   */
  public requestRelationProjectsData(params: RelationParams): Observable<Array<ProjectEntity>> {
    const httpUrl = `${this.domain}/upkeep_available_items`;
    return this.httpService.get(httpUrl, params.json()).pipe(map(res => {
      const tempList: Array<ProjectEntity> = [];
      res.body.forEach(data => {
        tempList.push(ProjectEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 添加项目
   * @param  projectParams 添加项目参数
   */
  public requestAddProjectData(projectParams: ProjectParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_items`;
    return this.httpService.post(httpUrl, projectParams.json());
  }

  /**
   * 编辑项目
   * @param upkeep_items_id 保养项目id
   * @param projectParams 编辑参数
   */
  public requestUpdateProjectData(upkeep_items_id: string, projectParams: ProjectParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_items/${upkeep_items_id}`;
    return this.httpService.put(httpUrl, projectParams.json());
  }

  /**
   * 上传项目
   * @param type 文件类型
   * @param myfile FILE
   */
  public requestImportProjectData(type: any, myfile: any) {
    // const httpUrl = `${this.domain}/upkeep_item/upload_upkeep_items`;
    // return this.httpService.put(httpUrl, myfile);
    const eventEmitter = new EventEmitter();
    const params = {
      myfile,
      type
    };

    const url = `/upkeep_item/upload_upkeep_items`;
    file_import(params, url, data => {
      eventEmitter.next(data);
    }, err => {
      eventEmitter.error(err);
    });
    return eventEmitter;
  }
}
