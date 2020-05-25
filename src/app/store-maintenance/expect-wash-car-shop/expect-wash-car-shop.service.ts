import { Injectable } from '@angular/core';
import { EntityBase } from '../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpService, LinkResponse } from '../../core/http.service';
import { HttpResponse } from '@angular/common/http';

// 期望门店信息
export class WishWashShopEntity extends EntityBase {
  public mechanic_id: string = undefined; // 	string	PK
  public wash_shop_id: string = undefined; // 	string	期望洗车店id 主键
  public wash_shop_name: string = undefined; // 	string	期望洗车店名称
  public address: string = undefined; // 	string	期望洗车店地址
  public lat: string = undefined; // 	string	经度
  public lon: string = undefined; // 	string	纬度
  public location = undefined; // 	point	位置点
  public shop_tel: string = undefined; // 	string	期望洗车店电话
  public user_tel: string = undefined; // 	string	用户电话
  public user_id: string = undefined; // 	string	用户id
  public is_deleted = undefined; // bool	是否删除
  public is_readed = undefined; // 	bool	是否已阅
  public province: string = undefined; // 	string	省
  public city: string = undefined; // 	string	市
  public district: string = undefined; // 	string	区
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
}

// 期望门店筛选参数
export class WishWashShopParams extends EntityBase {
  public add_section: string = undefined; // 	string	F	添加时间区间 "xxx,xxx"
  public wash_shop_name: string = undefined; // 	string	F	门店名称
  public order_rule: string = undefined; // 	string	F	排序规则 多种排序逗号分隔 1: 添加时间倒序 2:添加时间正序 默认: '1'
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class WishWashShopLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<WishWashShopEntity> {
    const tempList: Array<WishWashShopEntity> = [];
    results.forEach(res => {
      tempList.push(WishWashShopEntity.Create(res));
    });
    return tempList;
  }
}


@Injectable({
  providedIn: 'root'
})
export class ExpectWashCarShopService {

  private domain = environment.STORE_DOMAIN; // 商城域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取期望门店列表
   * @param searchParams 条件检索参数
   */
  public requestWishWashShopList(searchParams: WishWashShopParams): Observable<WishWashShopLinkResponse> {
    const httpUrl = `${this.domain}/admin/wish_wash_shops`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new WishWashShopLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求期望门店表
   * @param string url linkUrl
   * @returns Observable<BusinessLinkResponse>
   */
  public continueWishWashShopList(url: string): Observable<WishWashShopLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new WishWashShopLinkResponse(res)));
  }

  /**
   * 删除期望门店
   * @param wash_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteWishWashShop(wish_wash_shop_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wish_wash_shops/${wish_wash_shop_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 编辑期望洗车店的阅读状态
   * @param wash_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestReadedWishWashShop(wish_wash_shop_id: string, status: boolean): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wish_wash_shops/${wish_wash_shop_id}/is_readed`;
    return this.httpService.patch(httpUrl, {is_readed: status});
  }
}
