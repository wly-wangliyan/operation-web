import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { HttpResponse } from '@angular/common/http';
import { TechnicianLinkResponse } from '../../garage-management.service';
import { UserEntity } from '../../../../core/auth.service';

// 赠品信息
export class GiftEntity extends EntityBase {
  public gift_id: string = undefined; // 	string	赠品id-主键
  public repair_id: string = undefined; // 	string	汽修店id
  public images: string = undefined; // 	string	赠品图片
  public name: string = undefined; // 	string	赠品名称
  public introduce: string = undefined; // 	string	赠品描述
  public details: string = undefined; // 	string	T	详情
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
}

// 赠品信息
export class GiftParams extends EntityBase {
  public images: string = undefined; // 	string	赠品图片
  public name: string = undefined; // 	string	赠品名称
  public introduce: string = undefined; // 	string	赠品描述
  public details: string = undefined; // 	string	T	详情

  constructor(data: GiftEntity) {
    super();
    this.images = data.images;
    this.name = data.name;
    this.introduce = data.introduce;
    this.details = data.details;
  }
}

export class GiftLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GiftEntity> {
    const tempList: Array<GiftEntity> = [];
    results.forEach(res => {
      tempList.push(GiftEntity.Create(res));
    });
    return tempList;
  }
}


@Injectable({
  providedIn: 'root'
})
export class GarageGiftService {

  private domain = environment.STORE_DOMAIN; // 商城域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取赠品列表
   * @param repair_shop_id 汽修店ID
   * @returns Observable<GiftLinkResponse>
   */
  public requestGiftList(repair_shop_id: string): Observable<GiftLinkResponse> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/gifts`;
    return this.httpService.get(httpUrl).pipe(map(res => new GiftLinkResponse(res)));
  }

  /**
   * 添加赠品
   * @param repair_shop_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestCreateGift(repair_shop_id: string, params: GiftParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/gifts`;
    return this.httpService.post(httpUrl, params);
  }

  /**
   * 编辑赠品
   * @param gift_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditGift(repair_shop_id: string, gift_id: string, params: GiftParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/gifts/${gift_id}`;
    return this.httpService.put(httpUrl, params);
  }

  /**
   * 删除赠品
   * @param gift_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestDelGift(repair_shop_id: string, gift_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/repair_shops/${repair_shop_id}/gifts/${gift_id}`;
    return this.httpService.delete(httpUrl);
  }
}
