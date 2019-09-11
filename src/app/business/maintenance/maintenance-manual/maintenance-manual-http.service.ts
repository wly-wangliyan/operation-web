import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';
import { VehicleTypeEntity } from '../vehicle-type-management/vehicle-type-management.service';

export class HandbookEntity extends EntityBase {
  public upkeep_handbook_id: string = undefined; // 保养手册id
  public uh_item_id: string = undefined; // 保养手册-项目id
  public month: number = undefined; // 月数
  public kilometer: number = undefined; // 公里数
  public recommend_value: number = undefined; // 推荐值 1不做,2做,3推荐
  public created_time: number = undefined;
  public updated_time: string = undefined;
}

// 保养手册配置详情
export class ManualSettingEntity extends EntityBase {
  public uh_item_id: string = undefined; // 保养手册-项目id
  public vehicle_type_id: string = undefined; // 车型id
  public switch: boolean = undefined; // 开关
  public description: string = undefined; // 描述
  public item_id: string = undefined; // 项目id
  public item_name: string = undefined; // 项目名称
  public item_category: number = undefined; // 项目类别
  public upkeep_handbook: HandbookEntity = undefined; // 可变公里配置列
  public created_time: number = undefined;
  public updated_time: string = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'upkeep_handbook') {
      return HandbookEntity;
    }
    return null;
  }

}
// 修改推荐值参数
export class RecommendParams extends EntityBase {
  public recommend_value: number; // 推荐值 1不做2做3推荐
}

// 获取项目配置参数
export class ProjectItemParams extends EntityBase {
  public item_id: string = undefined; // 项目id
  public vehicle_type_id: string = undefined; // 车型id
  public description: string = undefined; // 描述
}

// 修改项目开关参数
export class SwitchParams extends EntityBase {
  public switch: boolean; // 操作开关 False关闭 True开启
  public item_id: boolean; // 项目id
  public vehicle_type_id: boolean; // 车型id
}

// 批量保存描述参数
export class BatcSaveParams extends EntityBase {
  public uh_items: Array<ProjectItemParams> = undefined; // 保养手册项目对象列表

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'uh_items') {
      return ProjectItemParams;
    }
    return null;
  }
}

// 获取保养手册条件筛选参数
export class SearchParams extends EntityBase {
  public vehicle_type_name: string = undefined; // F	车型名称
  public vehicle_brand: string = undefined; // F	品牌
  public vehicle_firm: string = undefined; // F	厂商
  public vehicle_series: string = undefined; // 	F	车系
  public page_num = 1; // 页数 默认1
  public page_size = 45; // 每页数量 默认15
}

export class ManualLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<VehicleTypeEntity> {
    const tempList: Array<VehicleTypeEntity> = [];
    results.forEach(res => {
      tempList.push(VehicleTypeEntity.Create(res));
    });
    return tempList;
  }
}


@Injectable({
  providedIn: 'root'
})
export class MaintenanceManualHttpService {
  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取保养手册列表
   * @param searchParams 条件筛选参数
   */
  public requestManualListData(searchParams: SearchParams): Observable<ManualLinkResponse> {
    const httpUrl = `${this.domain}/vehicle_types`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ManualLinkResponse(res)));
  }

  /**
   * 通过linkurl 分页获取保养手册
   * @param url linkURL
   */
  public continueManualListData(url: string): Observable<ManualLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ManualLinkResponse(res)));
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
   * @returns Observable<ManualSettingEntity>
   */
  public requestManualDetailData(vehicle_type_id: string): Observable<ManualSettingEntity> {
    const httpUrl = `${this.domain}/uh_items`;
    const body = {
      vehicle_type_id
    };
    return this.httpService.get(httpUrl, body)
      .pipe(map(res => ManualSettingEntity.Create(res.body)));
  }

  /**
   * 删除汽车车型的保养手册
   * @param vehicle_type_id 车型id
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteManualByVehicle(vehicle_type_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/vehicle/vehicle_types/${vehicle_type_id}/has_upkeepbook`;
    return this.httpService.patch(httpUrl);
  }
}
