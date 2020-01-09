import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { CommodityLinkResponse } from '../../../mall/goods-management/goods-management-http.service';
import { HttpService } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { EntityBase } from '../../../../../utils/z-entity';

/**
 * 商品列表请求参数
 */
export class CommoditySearchParams extends EntityBase {
  public giveaway_settings = 1; // int	F	0未设置 1兑换码兑换
  public page_size = 45; // 每页数量 默认15
  public page_num = 1; // 第几页 默认1
}

@Injectable({
  providedIn: 'root'
})
export class LuckDrawService {

  private domain = environment.MALL_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取商品列表
   * @param {CommoditySearchParams} searchParams
   * @returns {Observable<CommodityLinkResponse>}
   */
  public requestCommodityListData(searchParams: CommoditySearchParams): Observable<CommodityLinkResponse> {
    const url = this.domain + `/admin/commodities`;
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(res => new CommodityLinkResponse(res)));
  }

  /**
   * 获取活动列表
   * @param {CommoditySearchParams} searchParams
   * @returns {Observable<CommodityLinkResponse>}
   */
  public requestActiveListData(searchParams: CommoditySearchParams): Observable<CommodityLinkResponse> {
    const url = this.domain + `/admin/commodities`;
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(res => new CommodityLinkResponse(res)));
  }
}
