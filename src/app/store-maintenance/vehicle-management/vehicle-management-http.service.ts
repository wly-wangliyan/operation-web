import { Injectable, EventEmitter } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { file_import } from '../../../utils/file-import';

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

// 车型参数--排量
export class CarParamEntity extends EntityBase {
  public car_param_id: string = undefined; // string	id - 主键
  public car_displacement: string = undefined; // string	发动机排量
  public car_year_num: string = undefined; // string	生产年份
  public status: boolean = undefined; // boolean	启停状态
  public car_brand: CarBrandEntity = undefined; // 品牌
  public car_factory: CarFactoryEntity = undefined; // 厂商
  public car_series: CarSeriesEntity = undefined; // 车系
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_brand') {
      return CarBrandEntity;
    } else if (propertyName === 'car_factory') {
      return CarFactoryEntity;
    } else if (propertyName === 'car_series') {
      return CarSeriesEntity;
    }
    return null;
  }
}

// 原厂配件
export class CarPartParamEntity extends EntityBase {
  public car_brand_id: string = undefined; // string	id - 主键
  public car_brand_name: string = undefined; // string	品牌名称
  public car_factory_id: string = undefined; // string	id - 主键
  public car_factory_name: string = undefined; // string	厂商名称
  public car_param_id: string = undefined; // string	id - 主键
  public car_series_id: string = undefined; // string	id - 主键
  public car_series_name: string = undefined; // string	车系名称
  public car_displacement: string = undefined; // string	发动机排量
  public car_year_num: string = undefined; // string	生产年份
  public status: boolean = undefined; // boolean	启停状态
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

// 原厂配件
export class CarPartEntity extends EntityBase {
  public car_part_id: string = undefined; // string	id
  public project_id: string = undefined; // string	项目id
  public project_name: string = undefined; // string	项目名称
  public part_param = undefined; // json	配件参数{}
  public reference_amount: number = undefined; // float	参考用量
  public unit: string = undefined; // string	单位
  public car_param: CarPartParamEntity = undefined; // object	车型参数
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'car_param') {
      return CarPartParamEntity;
    }
    return null;
  }
}

export class CarParamLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarParamEntity> {
    const tempList: Array<CarParamEntity> = [];
    results.forEach(res => {
      tempList.push(CarParamEntity.Create(res));
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

export class CarFactoryResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarFactoryEntity> {
    const tempList: Array<CarFactoryEntity> = [];
    results.forEach(res => {
      tempList.push(CarFactoryEntity.Create(res));
    });
    return tempList;
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

export class CarYearResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarYearEntity> {
    const tempList: Array<CarYearEntity> = [];
    results.forEach(res => {
      tempList.push(CarYearEntity.Create(res));
    });
    return tempList;
  }
}

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

// 上传原厂参数
export class ImportParams extends EntityBase {
  public param_file = undefined; // file	T	上传文件
  public project_name: string = undefined; // string	T	项目名称 例如：机油
  public project_num: string = undefined; // string	T	项目id 例如：10
}

@Injectable({
  providedIn: 'root'
})
export class VehicleManagementHttpService {

  private domain = environment.STORE_DOMAIN; // 保养域名

  constructor(private httpService: HttpService) {
  }

  /**
   * 获取车型管理列表
   * @param searchParams 条件检索参数
   * @returns Observable<CarParamLinkResponse>
   */
  public requestCarTypeListData(searchParams: SearchParams): Observable<CarParamLinkResponse> {
    const httpUrl = `${this.domain}/car_params`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new CarParamLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求车型管理列表
   * @param string url linkUrl
   * @returns Observable<CarParamLinkResponse>
   */
  public continueCarTypeListData(url: string): Observable<CarParamLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new CarParamLinkResponse(res)));
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
   * 获取已推荐的品牌列表
   * @param boolean is_recommended 是否推荐
   * @returns Observable<CarParamLinkResponse>
   */
  public requestRecommendedCarBrandsListData(is_recommended: boolean): Observable<CarBrandResponse> {
    const httpUrl = `${this.domain}/car_brands`;
    return this.httpService.get(httpUrl, { is_recommended })
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

  /**
   * 获取排放下拉列表
   * @param car_series_id string 车系ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestCarParamListData(car_series_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/car_series/${car_series_id}/car_params`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => res));
  }

  /**
   * 修改车型的状态
   * @param car_series_id string 车系ID
   * @param car_param_id string 排放ID
   * @param status number    T    启停状态 1开启，2关闭
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateStatusData(car_series_id: string, car_param_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/car_series/${car_series_id}/car_params/${car_param_id}/status`;
    return this.httpService.patch(httpUrl, { status });
  }

  /**
   * 导入车型
   * @param type 文件类型
   * @param type_file FILE
   */
  public requestImportCarTypesData(type: any, type_file: any) {
    const eventEmitter = new EventEmitter();
    const params = {
      type_file,
      type
    };

    const url = `/car_types`;
    file_import(params, url, data => {
      eventEmitter.next(data);
    }, err => {
      eventEmitter.error(err);
    }, this.domain);
    return eventEmitter;
  }

  /**
   * 导入原厂参数
   * @param type 文件类型
   * @param param_file FILE
   */
  public requestImportCarParamData(importParams: ImportParams, type: any, param_file: any) {
    const eventEmitter = new EventEmitter();
    const params = {
      param_file,
      type,
      project_name: importParams.project_name,
      project_num: importParams.project_num
    };

    const url = `/car_params`;
    file_import(params, url, data => {
      eventEmitter.next(data);
    }, err => {
      eventEmitter.error(err);
    }, this.domain);
    return eventEmitter;
  }

  /**
   * 获取车型详情
   * @param string car_series_id 编号
   * @param car_param_id id
   * @returns Observable<CarParamEntity>
   */
  public requestCarDetail(car_series_id: string, car_param_id: string): Observable<Array<CarPartEntity>> {
    return this.httpService.get(this.domain + `/car_series/${car_series_id}/car_params/${car_param_id}`
    ).pipe(map(res => {
      const tempList: Array<CarPartEntity> = [];
      res.body.forEach(res1 => {
        tempList.push(CarPartEntity.Create(res1));
      });
      return tempList;
    }));
  }

  /**
   * 修改车辆品牌推荐状态
   * @param car_brand_ids string 汽车品牌ids
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateRecommendedBrands(car_brand_ids: string): Observable<HttpResponse<any>> {
    return this.httpService.patch(`${this.domain}/admin/car_brands/is_recommended`, { car_brand_ids }
    );
  }
}
