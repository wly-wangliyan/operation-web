import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';

// 查询参数
export class SearchParams extends EntityBase {
  public car_brand_id = ''; // String	F	品牌id
  public car_factory_id = ''; // String	F	厂商id
  public car_series_id = ''; // 	String	F	车系id
  public car_displacement = ''; // 	String	F	排量
  public car_year_num = ''; // 	String	F	生产年份
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class UserVehicleEntity extends EntityBase {

}

export class UserVehicleLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UserVehicleEntity> {
    const tempList: Array<UserVehicleEntity> = [];
    results.forEach(res => {
      tempList.push(UserVehicleEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserVehicleHttpService {

  private domain = environment.STORE_DOMAIN; // 车服务域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取用户车型管理列表
   * @param searchParams 条件检索参数
   * @returns Observable<UserVehicleLinkResponse>
   */
  public requestUserVehicleListData(searchParams: SearchParams): Observable<UserVehicleLinkResponse> {
    // TODO: 替换URL
    const httpUrl = `${this.domain}/car_params`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new UserVehicleLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求用户车型管理列表
   * @param string url linkUrl
   * @returns Observable<UserVehicleLinkResponse>
   */
  public continueUserVehicleListData(url: string): Observable<UserVehicleLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new UserVehicleLinkResponse(res)));
  }
}
