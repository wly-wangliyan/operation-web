import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class ActivityEntity extends EntityBase {
  public movement_id: string = undefined; // string(32)	T	主键id
  public movement_shop_ids: string = undefined; // string	关联门店
  public name: string = undefined; // string(10)	T	名称
  public title: string = undefined; // string(150)	T	标题
  public remark: string = undefined; // 	string	备注
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

export class BusinessEntity extends EntityBase {
  public movement_shop_id: string = undefined; // 	string	主键
  public movement: ActivityEntity = new ActivityEntity(); // 	{}	活动
  public name: string = undefined; // 	string	商家名称
  public images: string = undefined; // 	string	商家图片
  public tags: string = undefined; // 	string	标签
  public lon: string = undefined; // 	string	经度
  public lat: string = undefined; // 	string	纬度
  public location: string = undefined; // 	string	位置
  public region_id: string = undefined; // 	String	地区code
  public province: string = undefined; // 	String	省
  public city: string = undefined; // 	String	市
  public district: string = undefined; // 	String	区
  public address: string = undefined; // 	String	具体地点
  public telephone: string = undefined; // 	string	电话 "13011111,13022222"
  public rank = ''; // 	string	A,B,C
  public remark: string = undefined; // 	string	备注
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'movement') {
      return ActivityEntity;
    }
    return null;
  }
}

export class BusinessParams extends EntityBase {
  public movement_id: string = undefined; // 	string	T	所属活动id
  public name: string = undefined; // 	string	商家名称
  public images: string = undefined; // 	string	商家图片
  public tags: string = undefined; // 	string	标签
  public lon: string = undefined; // 	string	经度
  public lat: string = undefined; // 	string	纬度
  public location: string = undefined; // 	string	位置
  public region_id: string = undefined; // 	String	地区code
  public province: string = undefined; // 	String	省
  public city: string = undefined; // 	String	市
  public district: string = undefined; // 	String	区
  public address: string = undefined; // 	String	具体地点
  public telephone: string = undefined; // 	string	电话 "13011111,13022222"
  public rank: string = undefined; // 	string	A,B,C
  public remark: string = undefined; // 	string	备注

  constructor(data: BusinessEntity) {
    super();
    this.movement_id = data.movement.movement_id;
    this.name = data.name;
    this.images = data.images;
    this.tags = data.tags;
    this.lon = data.lon;
    this.lat = data.lat;
    this.location = data.location;
    this.region_id = data.region_id;
    this.province = data.province;
    this.city = data.city;
    this.district = data.district;
    this.address = data.address;
    this.telephone = data.telephone;
    this.rank = data.rank;
    this.remark = data.remark;
  }
}

// 活动条件筛选
export class SearchParams extends EntityBase {
  public movement_id: string = undefined; // 	string	F	活动id
  public name: string = undefined; // 	string	F	名称
  public section: string = undefined; // 	string	F	"xxxx,xxxx"
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 活动商家条件筛选
export class BusinessSearchParams extends EntityBase {
  public movement_id: string = undefined; // 	string	F	活动id
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 活动门店条件筛选
export class ShopSearchParams extends EntityBase {
  public repair_shop_name = ''; // 	F	汽修店名称
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 批量保存商家
export class BatchBusinessParams extends EntityBase {
  public movement_id: string = undefined; // 	string	T	所属活动id
  public type = '1'; // 	Integer	T	商家类型 1保养 2商城
  public movement_shop_ids: string = undefined; // 	string	T	商家ids
}

// 商城商家条件筛选
export class MallSearchParams extends EntityBase {
  public status = ''; // 	int	F	营业状态 1.营业中 2.停业休息
  public business_name = ''; // 	F	商家名称
  public page_num = 1; // 页码
  public page_size = 15; // 每页条数
}

export class ActivityLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ActivityEntity> {
    const tempList: Array<ActivityEntity> = [];
    results.forEach(res => {
      tempList.push(ActivityEntity.Create(res));
    });
    return tempList;
  }
}

export class BusinessLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BusinessEntity> {
    const tempList: Array<BusinessEntity> = [];
    results.forEach(res => {
      tempList.push(BusinessEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActivityBusinessService {

  private domain = environment.OPERATION_SERVE; // 域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取活动配置品列表
   * @param searchParams 条件检索参数
   */
  public requestActivityList(searchParams: SearchParams): Observable<ActivityLinkResponse> {
    const httpUrl = `${this.domain}/admin/movements`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new ActivityLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求活动配置列表
   * @param string url linkUrl
   * @returns Observable<ActivityLinkResponse>
   */
  public continueActivityList(url: string): Observable<ActivityLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ActivityLinkResponse(res)));
  }

  /**
   * 活动配置详情
   * @param string movement_id id
   * @returns Observable<ActivityEntity>
   */
  public requestActivityDetail(movement_id: string): Observable<ActivityEntity> {
    return this.httpService.get(`${this.domain}/admin/movements/${movement_id}`
    ).pipe(map(res => {
      return ActivityEntity.Create(res.body);
    }));
  }

  /**
   * 添加活动
   * @param  params 添加参数
   */
  public requestAddActivity(params: ActivityEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/movements`;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑活动配置
   * @param movement_id ID
   * @param params 编辑参数
   */
  public requestUpdateActivity(movement_id: string, params: ActivityEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/movements/${movement_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 获取活动商家列表
   * @param BusinessSearchParams 条件检索参数
   */
  public requestBusinessList(movement_id: string): Observable<BusinessLinkResponse> {
    const searchParams = new BusinessSearchParams();
    searchParams.movement_id = movement_id;
    const httpUrl = `${this.domain}/admin/movement_shops`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new BusinessLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求活动商家列表
   * @param string url linkUrl
   * @returns Observable<ActivityLinkResponse>
   */
  public continueBusinessList(url: string): Observable<BusinessLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BusinessLinkResponse(res)));
  }

  /**
   * 活动商家详情
   * @param string movement_shop_id id
   * @returns Observable<ActivityEntity>
   */
  public requestBusinessDetail(movement_shop_id: string): Observable<BusinessEntity> {
    return this.httpService.get(`${this.domain}/admin/movement_shops/${movement_shop_id}`
    ).pipe(map(res => {
      return BusinessEntity.Create(res.body);
    }));
  }

  /**
   * 添加活动商城
   * @param  params 添加参数
   */
  public requestAddBusiness(params: BusinessParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/movement_shops`;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑活动商城
   * @param movement_shop_id ID
   * @param params 编辑参数
   */
  public requestUpdateBusiness(movement_shop_id: string, params: BusinessParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/movement_shops/${movement_shop_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 删除商家
   * @param BusinessSearchParams 条件检索参数
   */
  public requestDeleteBusiness(movement_shop_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/movement_shops/${movement_shop_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 批量添加门店
   * @param  params 添加参数
   */
  public requestBatchAddBusiness(params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/movement_shops/bulk`;
    return this.httpService.post(httpUrl, params);
  }
}
