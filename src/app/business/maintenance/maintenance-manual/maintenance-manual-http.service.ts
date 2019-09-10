import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpService } from '../../../core/http.service';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';

export class ManualEntity extends EntityBase {

}

export class RecommendParams extends EntityBase {
  public recommend_value: number; // 推荐值 1不做2做3推荐
}

export class ProjectItemParams extends EntityBase {
  public item_id: string = undefined; // 项目id
  public vehicle_type_id: string = undefined; // 车型id
  public description: string = undefined; // 描述
}

export class SwitchParams extends EntityBase {
  public switch: boolean; // 操作开关 False关闭 True开启
  public item_id: boolean; // 项目id
  public vehicle_type_id: boolean; // 车型id
}

export class BatcSaveParams extends EntityBase {
  public uh_items: Array<ProjectItemParams> = undefined; // 保养手册项目对象列表

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'uh_items') {
      return ProjectItemParams;
    }
    return null;
  }
}



@Injectable({
  providedIn: 'root'
})
export class MaintenanceManualHttpService {
  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取保养手册列表 */
  public requestManualListData(): Observable<Array<ManualEntity>> {
    const httpUrl = `${this.domain}/upkeep_items`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const tempList: Array<ManualEntity> = [];
      res.body.forEach(data => {
        tempList.push(ManualEntity.Create(data));
      });
      return tempList;
    }));
  }

  /**
   * 更新保养手册信息项目推荐值
   * @param params 参数 T 推荐值 1不做2做3推荐
   * @param upkeep_handbook_id T 保养手册id
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeRecommendData(params: RecommendParams, upkeep_handbook_id: string, ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/upkeep_handbooks/${upkeep_handbook_id}`;
    return this.httpService.put(httpUrl, params.json());
  }

  /**
   * 更新保养手册信息项目开关
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeSwitchData(params: SwitchParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/uh_items/switch`;
    return this.httpService.post(httpUrl, params.json());
  }

  /**
   * 批量保存手册描述信息
   * @param params 参数列表
   * @param upkeep_handbook_id 保养手册id
   * @returns Observable<HttpResponse<any>>
   */
  public requestBatcSaveDescriptionData(params: BatcSaveParams, upkeep_handbook_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/uh_items/description`;
    return this.httpService.post(httpUrl, params.json());
  }

  /**
   * 获取保存手册详情
   * @param vehicle_type_id 车型id
   * @returns Observable<ManualEntity>
   */
  public requestManualDetailData(vehicle_type_id: string): Observable<ManualEntity> {
    const httpUrl = `${this.domain}/uh_items`;
    const body = {
      vehicle_type_id
    };
    return this.httpService.get(httpUrl, body)
      .pipe(map(res => ManualEntity.Create(res.body)));
  }
}
