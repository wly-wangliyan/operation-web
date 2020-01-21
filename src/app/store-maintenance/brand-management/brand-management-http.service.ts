import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';

// 品牌实体
export class AccessoryBrandEntity extends EntityBase {
  public accessory_brand_id: string = undefined; // string	配件品牌id - 主键
  public brand_name: string = undefined; // string	配件品牌名称
  public sign_image: string = undefined; // string	配件品牌标志图片
  public introduce: string = undefined; // string	简介
  public is_deleted: boolean = undefined; // bool	是否删除
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

export class AccessoryBrandLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<AccessoryBrandEntity> {
    const tempList: Array<AccessoryBrandEntity> = [];
    results.forEach(res => {
      tempList.push(AccessoryBrandEntity.Create(res));
    });
    return tempList;
  }
}

// 查询参数
export class SearchParams extends EntityBase {
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 编辑配件品牌参数
export class SearchBrandParams extends EntityBase {
  public brand_name = ''; // string	T	配件品牌名称
  public sign_image = ''; // string	T	配件品牌标志图片
  public introduce = ''; // string	string	T	简介 无：''
}

@Injectable({
  providedIn: 'root'
})
export class BrandManagementHttpService {

  private domain = environment.STORE_DOMAIN; // 保养域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取配件品牌列表
   * @param searchParams 条件检索参数
   * @returns Observable<AccessoryBrandLinkResponse>
   */
  public requestAccessoryBrandListData(searchParams: SearchParams): Observable<AccessoryBrandLinkResponse> {
    const httpUrl = `${this.domain}/admin/accessory_brands`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new AccessoryBrandLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求服务费列表
   * @param string url linkUrl
   * @returns Observable<AccessoryBrandLinkResponse>
   */
  public continueAccessoryBrandListData(url: string): Observable<AccessoryBrandLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new AccessoryBrandLinkResponse(res)));
  }

  /**
   * 获取配件品牌全部数据
   * @returns Observable<AccessoryBrandLinkResponse>
   */
  public requestAccessoryBrandAllListData(): Observable<AccessoryBrandLinkResponse> {
    const httpUrl = `${this.domain}/admin/accessory_brands/all`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new AccessoryBrandLinkResponse(res)));
  }

  /**
   * 获取配置库详情
   * @param accessory_brand_id string	T	配件品牌ID
   * @returns Observable<AccessoryBrandEntity>
   */
  public requestAccessoryBrandDetailData(accessory_brand_id: string): Observable<AccessoryBrandEntity> {
    const httpUrl = `${this.domain}/admin/accessory_brands/${accessory_brand_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => AccessoryBrandEntity.Create(res.body)));
  }

  /**
   * 新建配件品牌
   * @param params SearchBrandParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddAccessoryData(params: SearchBrandParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/accessory_brands`;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑配件品牌
   * @param accessory_brand_id 配件品牌id
   * @param params SearchBrandParams 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateAccessoryData(accessory_brand_id: string, params: SearchBrandParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/accessory_brands/${accessory_brand_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 删除配件品牌
   * @param accessory_brand_id 配件品牌id
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteAccessoryData(accessory_brand_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/accessory_brands/${accessory_brand_id}`;
    return this.httpService.delete(httpUrl);
  }
}

