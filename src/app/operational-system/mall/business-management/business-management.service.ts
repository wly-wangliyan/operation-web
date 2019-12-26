import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { HttpResponse } from '@angular/common/http';

export class SearchParams extends EntityBase {
  public status = ''; // 	int	F	营业状态 1.营业中 2.停业休息
  public business_name = ''; // 	F	商家名称
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class CompanyEntity extends EntityBase {
  public company_name = ''; // 企业名称
  public province: string = undefined; 	// 	string	省
  public city: string = undefined; 	// 	string	市
  public district: string = undefined; 	// 	string	区
}

export class BusinessEntity extends EntityBase {
  public mall_business_id: string = undefined; // 商城商家id
  public mall_business_name: string = undefined; // 商城商家名称
  public company: CompanyEntity = undefined; // 	obj	企业
  public business_type: number = undefined; // 商家类型 1商城供应商
  public contacts: string = undefined; // 联系人
  public telephone: string = undefined; // 联系电话
  public province: string = undefined; 	// 	string	省
  public city: string = undefined; 	// 	string	市
  public district: string = undefined; 	// 	string	区
  public region_id: string = undefined; // 省市区code
  public address: string = undefined; // 详细地址
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public images: Array<string> = []; // 	图片
  public business_status: number = undefined; // 运营状态 1.营业中 2.停业休息
  public postage_status: number = undefined; // 物流状态 1.需要填写物流 2.不需要填写物流

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'company') {
      return CompanyEntity;
    }
    return null;
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
export class BusinessManagementService {

  private domain = environment.MALL_DOMAIN; // 商城域名

  constructor(private httpService: HttpService) { }


  /**
   * 获取商家列表
   * @param searchParams 条件检索参数
   */
  public requestBusinessList(searchParams: SearchParams): Observable<BusinessLinkResponse> {
    const httpUrl = `${this.domain}/business`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new BusinessLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求商家列表
   * @param string url linkUrl
   * @returns Observable<BusinessLinkResponse>
   */
  public continueBusinessList(url: string): Observable<BusinessLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BusinessLinkResponse(res)));
  }

  /**
   * 获取商家详情
   * @param business_id 商家ID
   * @returns Observable<GoodsOrderEntity>
   */
  public requestBusinessDetail(business_id: string): Observable<BusinessEntity> {
    const httpUrl = `${this.domain}/business/${business_id}`;
    return this.httpService.get(httpUrl)
        .pipe(map(res => BusinessEntity.Create(res.body)));
  }

  /**
   * 修改商家营业状态
   * @param business_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestBusinessStatus(business_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/business/${business_id}/status`;
    return this.httpService.patch(httpUrl, params);
  }

  /**
   * 修改商家是否录入物流邮费
   * @param business_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestPostageStatus(business_id: string, params: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/business/${business_id}/postage_status`;
    return this.httpService.patch(httpUrl, params);
  }
}
