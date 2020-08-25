import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase, noClone } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { MerchantManagementEntity } from '../merchant-management/merchant-management.service';
import { TagManagementEntity } from '../tag-management/tag-management.service';

export enum OnlineStatus {
  on = 1,
  off = 2,
}

export enum ReviewStatus {
  reviewing = 1,
  reviewed = 2,
  rejected = 3,
}

// 品牌实体
export class CarBrandEntity extends EntityBase {
  public car_brand_id: string = undefined; // string	id - 主键
  public car_brand_name: string = undefined; // string	品牌名称
  public car_brand_initial: string = undefined; // string	品牌拼音大写首字母
  public car_brand_image: string = undefined; // string	品牌图片
  public is_recommended = false; // boolean	boolean 是否推荐
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

// 品牌类型（厂商）
export class CarFactoryEntity extends EntityBase {
  public car_factory_id: string = undefined; // string	id - 主键
  public car_factory_name: string = undefined; // string	厂商名称
  public car_brand: CarBrandEntity = undefined; // 品牌
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_brand') {
      return CarBrandEntity;
    }
    return null;
  }
}

// 年份
export class CarYearEntity extends EntityBase {
  public car_param_id: string = undefined; // string	id - 主键
  public car_year_num: string = undefined; // string	年份
  public car_displacement: string = undefined; // 排量
  public car_brand: CarBrandEntity = undefined; // 品牌
  public car_factory: CarFactoryEntity = undefined; // 厂商
  public status: boolean = undefined;
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_brand') {
      return CarBrandEntity;
    } else if (propertyName === 'car_factory') {
      return CarFactoryEntity;
    }
    return null;
  }
}

export class CarYearResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarYearEntity> {
    const tempList: Array<CarYearEntity> = [];
    results.forEach(res => {
      tempList.push(CarYearEntity.Create(res));
    });
    return tempList;
  }
}

// 车系
export class CarSeriesEntity extends EntityBase {
  public car_series_id: string = undefined; // string	id - 主键
  public car_series_name: string = undefined; // string	车系名称
  public car_brand: CarBrandEntity = undefined; // 品牌
  public car_factory: CarFactoryEntity = undefined; // 厂商
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_brand') {
      return CarBrandEntity;
    } else if (propertyName === 'car_factory') {
      return CarFactoryEntity;
    }
    return null;
  }
}

export class CarSeriesResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarSeriesEntity> {
    const tempList: Array<CarSeriesEntity> = [];
    results.forEach(res => {
      tempList.push(CarSeriesEntity.Create(res));
    });
    return tempList;
  }
}

export class CarFactoryResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarFactoryEntity> {
    const tempList: Array<CarFactoryEntity> = [];
    results.forEach(res => {
      tempList.push(CarFactoryEntity.Create(res));
    });
    return tempList;
  }
}

export class CarBrandResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarBrandEntity> {
    const tempList: Array<CarBrandEntity> = [];
    results.forEach(res => {
      tempList.push(CarBrandEntity.Create(res));
    });
    return tempList;
  }
}

export class SearchParamsCarEntity extends EntityBase {
  public merchant_name: string = undefined; // 发布商家
  public review_section: string = undefined; // 发布时间段
  public created_section: string = undefined; // 创建时间段
  public brand_name: string = undefined; // 品牌
  public review_status: any = undefined; // 审核状态 1待审 2通过 3驳回
  public page_size = 45;
  public page_num = 1;
}

export class InformationDeliveryCarParam extends EntityBase {
  public car_brand: CarBrandEntity = new CarBrandEntity();
  public car_displacement: string = undefined;
  public car_factory: CarFactoryEntity = new CarFactoryEntity();
  public car_param_id: string = undefined;
  public car_series: CarSeriesEntity = new CarSeriesEntity();
  public car_year_num: string = undefined;
  public status: boolean = undefined;

  @noClone
  public get carBrandName(): string {
    return this.car_brand ? (this.car_brand.car_brand_name +
      this.car_factory.car_factory_name +
      this.car_series.car_series_name +
      this.car_displacement + this.car_year_num) : '';
  }

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_brand') {
      return CarBrandEntity;
    }
    if (propertyName === 'car_factory') {
      return CarFactoryEntity;
    }
    if (propertyName === 'car_series') {
      return CarSeriesEntity;
    }
    return null;
  }
}

export class InformationDeliveryManagementEntity extends EntityBase {
  public car_info_id: string = undefined; // id
  public release_city = '210100'; // 发布城市 210100沈阳
  public car_param: InformationDeliveryCarParam = new InformationDeliveryCarParam(); // 品牌
  public images: string = undefined; // 图片集 最多30张 ,分割
  public vin: string = undefined; // 车辆识别代码
  public label: string = undefined; // 标签 最多3个,分割
  public contact: string = undefined; // 联系人
  public telephone = ''; // 联系电话
  public color: string = undefined; // 车辆颜色
  public registration_time: any = undefined; // 首次上牌时间
  public mileage: number = undefined; // 行驶里程 千米
  public price: number = undefined; // 转让价格 元
  public car_type: number = undefined; // 车辆类型
  public merchant: MerchantManagementEntity = new MerchantManagementEntity(); // 信息发布商户
  public region_id: string = undefined; // 省市区code
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 详细地址
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public contain_transfer_fee: number = undefined; // 是否包含过户费用 1包含 2不包含
  public labels: Array<TagManagementEntity> = [];
  public car_description: string = undefined; // 车况描述
  public transfer_times: number = undefined;  // 过户次数
  public has_mortgage: number = undefined; // 是否抵押 1有 2无
  public check_deadline: any = undefined; // 年检到期时间
  public compulsory_traffic_insurance_deadline: any = undefined; // 交强险到期时间
  public commercial_insurance_deadline: any = undefined; // 商业险到期时间
  public extra_info: string = undefined; // 加装配置
  public online_status: number = undefined; // 类型 1上线 2下线
  public review_time: number = undefined; // 上线时间
  public review_status: number = undefined; // 审核状态 1待审 2通过 3驳回
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  @noClone
  public get coverImage(): string {
    return this.images.split(',')[0];
  }

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_param') {
      return InformationDeliveryCarParam;
    }
    if (propertyName === 'merchant') {
      return MerchantManagementEntity;
    }
    if (propertyName === 'labels') {
      return TagManagementEntity;
    }
    return null;
  }
}

export class InformationDeliveryManagementParams extends EntityBase {
  public car_info_id: string = undefined; // id
  public release_city = '210100'; // 发布城市 210100沈阳
  public images: string = undefined;
  public vin: string = undefined;
  public label_ids: string = undefined;
  public color = '';
  public registration_time: any = '';
  public mileage: any = undefined;
  public price: any = undefined;
  public contain_transfer_fee: number = undefined;
  public car_param_id: string = undefined;
  public car_type: any = '';
  public merchant_id: string = undefined;
  public contact: string = undefined;
  public telephone = '';
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 详细地址
  public lon = ''; // 经度
  public lat = ''; // 纬度
  public region_id: string = undefined;
  public car_description: string = undefined;
  public transfer_times: any = 0;  // 过户次数
  public has_mortgage: number = undefined; // 是否抵押 1有 2无
  public check_deadline: any = ''; // 年检到期时间
  public compulsory_traffic_insurance_deadline: any = ''; // 交强险到期时间
  public commercial_insurance_deadline: any = ''; // 商业险到期时间
  public extra_info: string = undefined; // 加装配置
  public merchant_name: string = undefined;

  constructor(source?: InformationDeliveryManagementEntity) {
    super();
    if (source) {
      this.car_info_id = source.car_info_id;
      this.images = source.images;
      this.vin = source.vin;
      this.color = source.color;
      this.registration_time = new Date(source.registration_time * 1000);
      this.mileage = (source.mileage / 10000).toFixed(4);
      this.price = (source.price / 10000).toFixed(4);
      this.lon = source.lon || '';
      this.lat = source.lat || '';
      this.address = source.address;
      this.transfer_times = source.transfer_times || 0;
      this.has_mortgage = source.has_mortgage;
      this.check_deadline = source.check_deadline ? new Date(source.check_deadline * 1000) : '';
      this.compulsory_traffic_insurance_deadline = source.compulsory_traffic_insurance_deadline ?
        new Date(source.compulsory_traffic_insurance_deadline * 1000) : '';
      this.commercial_insurance_deadline = source.commercial_insurance_deadline ?
        new Date(source.commercial_insurance_deadline * 1000) : '';
      this.contain_transfer_fee = source.contain_transfer_fee;
      this.car_param_id = source.car_param.car_param_id;
      this.car_type = source.car_type.toString();
      this.merchant_id = source.merchant.merchant_id;
      this.merchant_name = source.merchant.merchant_name;
      const consult_info = source.merchant.consult_info;
      if (consult_info && consult_info.length > 0) {
        const _index = consult_info.findIndex(item => item.telephone === source.telephone);
        const index = _index > -1 ? _index : 0;
        this.telephone = consult_info[index].telephone + ',' + index;
        this.contact = consult_info[index].name;
      }
      this.has_mortgage = source.has_mortgage;
      this.extra_info = source.extra_info;
      this.label_ids = source.labels.map(item => item.label_id).join(',');
    }
  }
}

export class InformationDeliveryManagementLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<InformationDeliveryManagementEntity> {
    const tempList: Array<InformationDeliveryManagementEntity> = [];
    results.forEach(res => {
      tempList.push(InformationDeliveryManagementEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class InformationDeliveryManagementService {

  private domain = environment.CAR_SERVE;

  // private domain = 'http://192.168.6.159:8340';

  constructor(private httpService: HttpService) {
  }

  /** 查看二手车信息列表 */
  public requestInformationDeliveryListData(searchParams: SearchParamsCarEntity): Observable<InformationDeliveryManagementLinkResponse> {
    const httpUrl = `${this.domain}/admin/used_car/car_info_list`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new InformationDeliveryManagementLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续查看二手车信息列表
   * @returns Observable<PushLinkResponse>
   * @param url
   */
  public continueInformationDeliveryListData(url: string): Observable<InformationDeliveryManagementLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new InformationDeliveryManagementLinkResponse(res)));
  }

  /**
   * 添加|编辑二手车信息
   * @param params
   * @param car_info_id
   */
  public requestAddInformationDeliveryData(
    params: InformationDeliveryManagementParams,
    car_info_id: string): Observable<HttpResponse<any>> {
    const httpUrl = car_info_id ?
      `${this.domain}/admin/used_car/car_info/${car_info_id}` : `${this.domain}/admin/used_car/car_info`;
    return car_info_id ? this.httpService.put(httpUrl, params) :
      this.httpService.post(httpUrl, params);
  }


  /**
   * 查看二手车信息详情
   * @param car_info_id
   */
  public requestInformationDeliveryDetailData(car_info_id: string): Observable<InformationDeliveryManagementEntity> {
    const httpUrl = `${this.domain}/admin/used_car/car_info/${car_info_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return InformationDeliveryManagementEntity.Create(res.body);
    }));
  }

  /**
   * 判断二手车信息是否关联上线标签
   * @param car_info_id
   */
  public requestInformationDeliveryLabelData(car_info_id: string): Observable<any> {
    const httpUrl = `${this.domain}/admin/used_car/car_info/${car_info_id}/labels_status`;
    // {
    //     "status": 1, # 1已关联上线标签/ 2未关联上线标签
    // }
    return this.httpService.get(httpUrl).pipe(map(res => res.body));
  }

  /**
   * 删除二手车信息
   * @param car_info_id
   */
  public requestDeleteInformationDeliveryData(car_info_id: string): Observable<any> {
    const httpUrl = `${this.domain}/admin/used_car/car_info/${car_info_id}`;
    return this.httpService.delete(httpUrl).pipe(map(res => res.body));
  }

  /**
   * 审核二手车信息
   * @param car_info_id
   * @param review_status
   */
  public requestInformationDeliveryReviewStatusData(car_info_id: string, review_status: ReviewStatus): Observable<any> {
    const params = { review_status }; // 2通过 3驳回
    const httpUrl = `${this.domain}/admin/used_car/car_info/${car_info_id}/review_status`;
    return this.httpService.patch(httpUrl, params).pipe(map(res => res.body));
  }

  /**
   * 上下线二手车信息
   * @param car_info_id
   * @param online_status
   */
  public requestInformationDeliveryOnlineStatusData(car_info_id: string, online_status: number): Observable<any> {
    const params = { online_status }; // 1上线 2下线
    const httpUrl = `${this.domain}/admin/used_car/car_info/${car_info_id}/online_status`;
    return this.httpService.patch(httpUrl, params).pipe(map(res => res.body));
  }

  /**
   * 获取品牌列表
   * @returns Observable<CarParamLinkResponse>
   */
  public requestCarBrandsListData(): Observable<CarBrandResponse> {
    const httpUrl = `${this.domain}/car_brands`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new CarBrandResponse(res)));
  }

  /**
   * 获取厂商下拉列表
   * @param car_brand_id string 品牌ID
   * @returns Observable<CarFactoryResponse>
   */
  public requestCarFactoryListData(car_brand_id: string): Observable<CarFactoryResponse> {
    const httpUrl = `${this.domain}/car_brands/${car_brand_id}/car_factories`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new CarFactoryResponse(res)));
  }

  /**
   * 获取车系下拉列表
   * @param car_brand_id string 品牌ID
   * @param car_factory_id string 厂商ID
   * @returns Observable<CarSeriesResponse>
   */
  public requestCarSeriesListData(car_brand_id: string, car_factory_id: string): Observable<CarSeriesResponse> {
    const httpUrl = `${this.domain}/car_brands/${car_brand_id}/car_factories/${car_factory_id}/car_series`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new CarSeriesResponse(res)));
  }

  /**
   * 获取车系下排量列表
   * @returns Observable<CarSeriesResponse>
   * @param car_series_id
   */
  public requestCarParamsListData(car_series_id: string): Observable<Array<string>> {
    const httpUrl = `${this.domain}/car_series/${car_series_id}/car_params`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => res.body));
  }

  /**
   *  获取指定排量下的车辆年份
   * @returns Observable<CarSeriesResponse>
   * @param car_series_id
   * @param car_displacement
   */
  public requestCarYearListData(car_series_id: string, car_displacement: string): Observable<CarYearResponse> {
    const httpUrl = `${this.domain}/car_series/${car_series_id}/car_year_num`;
    const params = { car_displacement };
    return this.httpService.get(httpUrl, params)
      .pipe(map(res => new CarYearResponse(res)));
  }

  /** 查看标签关联二手车列表 */
  public requestTagCarListData(searchParams: SearchParamsCarEntity, label_id: string):
    Observable<Array<InformationDeliveryManagementEntity>> {
    const httpUrl = `${this.domain}/admin/used_car/labels/${label_id}/car_info_list`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => {
        const tempList: Array<InformationDeliveryManagementEntity> = [];
        res.body.forEach(item => {
          tempList.push(InformationDeliveryManagementEntity.Create(item));
        });
        return tempList;
      }));
  }
}
