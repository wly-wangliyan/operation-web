import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../utils/z-entity';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';

export class BrokerageEntity extends EntityBase {
  public broker_company_id: string = undefined; 	// 	string 	经济公司id
  public broker_company_name: string = undefined; 	// string	经济公司名称
  public region_id: string = undefined; 	// 	string	省市区
  public address: string = undefined; 	// 	string	地址
  public person: string = undefined; 	// 	string	企业法人
  public license_num: string = undefined; 	// 	string	营业执照编号
  public license_photos: string = undefined; 	// 	string	营业执照
  public account: string = undefined; 	// 	string 	用户
  public telephone: number = undefined; 	// 	int	电话
  public email: string = undefined; 	// 	string	邮箱
  public describe: string = undefined; 	// string 描述
  public ic_company: Array<InsuranceEntity> = undefined; 	// 	Array	保险公司
  public ic_company_name: string = undefined; 	// 	string	保险公司名称
  public secret_nums: Array<any> = undefined; // 隐私号
  public created_time: number = undefined; 	// float 	创建时间
  public updated_time: number = undefined; 	// float 	修改时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'ic_company') {
      return InsuranceEntity;
    }
    return null;
  }
}

export class InsuranceEntity extends EntityBase {
  public ic_id: string = undefined; 	// 	string 保险公司id
  public ic_name: string = undefined; 	// 	string 保险公司名称
  public ic_image: string = undefined; 	// 保险公司logo
  public describe = ''; 	// 	string 保险公司描述
  public discontinue_use = undefined; 	// 	bool 是否启用 false为启用，true为不启用
  public sort_num: number = undefined; 	// 	number 排序数字
  public tag: Array<any> = undefined; 	// 	Array 应用id
}

export class VersionEntity extends EntityBase {
  public version_id: string = undefined; 	// 	string 版本id
  public version: string = undefined; 	// 	string 版本
  public is_display: string = undefined; 	// 	bool  是否下线
  public created_time: number = undefined; 	// 	string 创建时间
}

export class UpdateBrokerageEntity extends EntityBase {
  public describe: string = undefined; 	// 	string	T	描述
  public ic_company: string = undefined; 	// 	string	T	保险公司id
  public secret_nums: string = undefined; // string 隐私号

  constructor(describe?: string, ic_company?: string, secret_nums?: string) {
    super();
    this.describe = describe;
    this.ic_company = ic_company;
    this.secret_nums = secret_nums;
  }

  public toEditJson(): any {
    const json = this.json();
    return json;
  }
}

export class UpdateInsueranceEntity extends EntityBase {
  public describe: string = undefined; 	// 	string	T	描述
  public ic_name: string = undefined; 	// 	string	T	保险公司名称
  public ic_image: string = undefined; 	// 	string	T	保险公司logo
  public tag: string = undefined; 	// 	string	T	标签

  constructor(describe?: string, ic_name?: string, ic_image?: string, tag?: string) {
    super();
    this.describe = describe;
    this.ic_name = ic_name;
    this.ic_image = ic_image;
    this.tag = tag;
  }

  public toEditJson(): any {
    const json = this.json();
    return json;
  }
}

export class BrokerageLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BrokerageEntity> {
    const tempList: Array<BrokerageEntity> = [];
    results.forEach(res => {
      tempList.push(BrokerageEntity.Create(res));
    });
    return tempList;
  }
}

export class InsuranceLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<InsuranceEntity> {
    const tempList: Array<InsuranceEntity> = [];
    results.forEach(res => {
      tempList.push(InsuranceEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  constructor(private httpService: HttpService) {
  }

  /**
   * 请求获取经纪公司列表
   * @returns Observable<BrokerageLinkResponse>
   */
  public requestBrokerageList(): Observable<BrokerageLinkResponse> {
    const params = {
      page_size: 45,
      page_num: 1
    };
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/brokers`,
      params).pipe(map(res => new BrokerageLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取经纪公司列表
   * @param string url linkUrl
   * @returns Observable<BrokerageLinkResponse>
   */
  public continueBrokerageList(url: string): Observable<BrokerageLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BrokerageLinkResponse(res)));
  }

  /**
   * 请求获取保险公司列表
   * @returns Observable<FirstPageIconLinkResponse>
   */
  public requestInsuranceList(): Observable<InsuranceLinkResponse> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/insurances`).pipe(map(res => new InsuranceLinkResponse(res)));
  }

  /**
   * 请求获取保险公司列表
   * @returns Observable<FirstPageIconLinkResponse>
   */
  public requestInsuranceUseList(): Observable<InsuranceLinkResponse> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/insurances/use`).pipe(map(res => new InsuranceLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求获取保险公司列表
   * @param string url linkUrl
   * @returns Observable<BrokerageLinkResponse>
   */
  public continueInsuranceList(url: string): Observable<InsuranceLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new InsuranceLinkResponse(res)));
  }

  /**
   * 停用、启用
   * @param menu_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUseInsurance(ic_id: string, params: any): Observable<HttpResponse<any>> {
    return this.httpService.patch(environment.OPERATION_SERVE +
      `/admin/insurance/${ic_id}`, params);
  }

  /**
   * 更新序列
   * @param menu_id 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateSort(ic_id: string, params: any): Observable<HttpResponse<any>> {
    return this.httpService.patch(environment.OPERATION_SERVE + `/admin/insurance/${ic_id}/sort`, params);
  }

  /**
   * 获取经纪公司详情
   * @param string broker_company_id 编号
   * @returns Observable<BrokerageEntity>
   */
  public requestBrokerDetail(broker_company_id: string): Observable<BrokerageEntity> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/broker/${broker_company_id}`
    ).pipe(map(res => BrokerageEntity.Create(res.body)));
  }

  /**
   * 获取保险公司详情
   * @param string broker_company_id 编号
   * @returns Observable<BrokerageEntity>
   */
  public requestInsuranceDetail(ic_id: string): Observable<InsuranceEntity> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/insurance/${ic_id}`
    ).pipe(map(res => InsuranceEntity.Create(res.body)));
  }

  /**
   * 编辑经纪公司信息
   * @param params 参数列表
   * @param broker_company_id 经纪公司id
   * @returns Observable<HttpResponse<any>>
   */
  public requestModifyBrokerage(params: UpdateBrokerageEntity, broker_company_id: string): Observable<HttpResponse<any>> {
    return this.httpService.put(environment.OPERATION_SERVE + `/admin/broker/${broker_company_id}`, params.json());
  }

  /**
   * 新建保险公司信息
   * @param params 参数列表
   * @param application_id 应用id
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddInsurance(params: UpdateInsueranceEntity): Observable<HttpResponse<any>> {
    return this.httpService.post(environment.OPERATION_SERVE + `/admin/insurances`, params.json());
  }

  /**
   * 编辑保险公司信息
   * @param params 参数列表
   * @param ic_id 保险公司id
   * @returns Observable<HttpResponse<any>>
   */
  public requestModifyInsurance(params: UpdateInsueranceEntity, ic_id: string): Observable<HttpResponse<any>> {
    return this.httpService.put(environment.OPERATION_SERVE + `/admin/insurance/${ic_id}`, params.json());
  }

  /**
   * 验证经济公司隐私号
   * @param middleNumber 隐私号
   * @param ic_id 保险公司id
   * @returns Observable<HttpResponse<any>>
   */
  public requestCheckMiddleNumber(middleNumber: string): Observable<HttpResponse<any>> {
    return this.httpService.get(environment.OPERATION_SERVE + `/admin/secret_nums/${middleNumber}`);
  }
}

