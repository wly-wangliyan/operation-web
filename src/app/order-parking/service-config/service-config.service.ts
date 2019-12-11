import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';

export class ParkingSearchParams extends EntityBase {
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class ServiceConfigParams extends EntityBase {
  public tags: Array<any> = []; // array	F	标签
  public origin_fee: number = undefined; // integer	T	原价 / 每日 单位: 分
  public sale_fee: number = undefined; // integer	T	售价 / 每日 单位: 分
  public pre_fee: number = undefined; // integer	T	预付费用 单位: 分
  public minus_fee: number = undefined; // integer	T	下单立减 单位: 分
  public min_days: number = undefined; // integer	T	最低预定天数
  public main_tel: string = undefined; // string	T	常用联系电话
  public standby_tel: string = undefined; // string	T	备用联系电话
  public instruction: string = undefined; // string	T	预约说明
  public notice: string = undefined; // string	T	购买须知
}

// 停车场实体
export class ParkingEntity extends EntityBase {
  public parking_id: string = undefined; // string  停车场ID
  public park_id: string = undefined; // string  停车场ID
  public area_type: number = undefined; // integer	用地类型 1: 路内 2: 路外
  public parking_name: string = undefined; // string 停车场名称
  public images: Array<any> = []; // string 图片
  public operate_type: number = undefined; // integer	管理模式 / 运营模式 1: 非封闭 2: 封闭 - 1: 未知
  public province: string = undefined; // string 省
  public city: string = undefined; // string 市
  public district: string = undefined; // string 区
  public address: string = undefined; // string 停车场地址
  public start_time: number = undefined; // integer 营业开始时间 默认: 空
  public end_time: number = undefined; // integer	营业结束时间 默认: 空
  public lon: string = undefined; // string	经度
  public lat: string = undefined; // string	纬度
  public location: number = undefined; // point	位置坐标
  public tags: Array<any> = undefined; // array	标签
  public origin_fee: number = undefined; // integer	原价 单位: 分
  public sale_fee: number = undefined; // integer	售价 单位: 分
  public pre_fee: number = undefined; // integer	预付 单位: 分
  public minus_fee: number = undefined; // integer	下单立减 单位: 分
  public min_days: number = undefined; // integer	最低预定
  public main_tel: string = undefined; // string	手机号(主)
  public standby_tel: string = undefined; // string	手机号(备)
  public instruction: string = undefined; // string	预约说明
  public notice: string = undefined; // string	购买须知
  public is_deleted: boolean = undefined; // bool	逻辑删除 默认: False
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

export class ParkingLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntity> {
    const tempList: Array<ParkingEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServiceConfigService {

  private domain = environment.BOOKING_DOMAIN; // 预约泊车域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取产品列表
   * @param searchParams 条件检索参数
   */
  public requestParkingListData(searchParams: ParkingSearchParams): Observable<ParkingLinkResponse> {
    const httpUrl = `${this.domain}/admin/parkings`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ParkingLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<ParkingLinkResponse>
   */
  public continueParkingListData(url: string): Observable<ParkingLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ParkingLinkResponse(res)));
  }

  /**
   * 获取停车场列表
   * @param parking_name 停车场名称
   */
  public requestBeanParkingListData(parking_name: string): Observable<ParkingLinkResponse> {
    const httpUrl = `${this.domain}/admin/base_parkings`;
    return this.httpService.get(httpUrl, { parking_name })
      .pipe(map(res => new ParkingLinkResponse(res)));
  }

  /**
   * 添加停车场
   * @param park_ids 停车场ids
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddParkingIds(park_ids: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/parkings`;
    return this.httpService.post(httpUrl, { park_ids });
  }

  /**
   * 获取产品配置详情
   * @param parking_id 停车场ID
   * @returns Observable<ParkingEntity>
   */
  public requestParkingDetailData(parking_id: string): Observable<ParkingEntity> {
    const httpUrl = `${this.domain}/admin/parkings/${parking_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => ParkingEntity.Create(res.body)));
  }

  /**
   * 修改服务配置
   * @param parking_id 订单ID
   * @param params ServiceConfigParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateSweviceConfigData(params: ServiceConfigParams, parking_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/parkings/${parking_id}/service_config`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 删除产品配置
   * @param parking_id 停车场id
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteProductData(parking_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/parkings/${parking_id}`;
    return this.httpService.delete(httpUrl);
  }

}
