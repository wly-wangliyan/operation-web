import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';

// 产品实体
export class ProductEntity extends EntityBase {
  public third_product_id: string = undefined; // 第三方产品id
  public third_product_name: string = undefined; // 第三方产品名称
  public add_time: number = undefined; // 第三方产品添加时间
  public third_product_image: string = undefined; // 第三方产品缩略图
  public type: string = undefined; // 第三方产品类型(A:景点 B:线路 C:酒店 F:套票 H:演出)
  public provice: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 第三方产品详细地址
  public introduce: string = undefined; // 第三方产品介绍
  public notice: string = undefined; // 第三方产品须知
  public place_order_time: number = undefined; // 下单时间
  public run_time: number = undefined; // 第三方产品营业时间
  public sale_status: string = undefined; // 第三方产品销售状态
  public telephone: string = undefined; // 第三方联系电话
  public traffic_guide: string = undefined; // 第三方交通指南
  public open_time: number = undefined; // 第三方开放时间
  public retail_price: number = undefined; // 第三方零售价
  public buy_price: number = undefined; // 第三方结算价
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

export class ProductLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ProductEntity> {
    const tempList: Array<ProductEntity> = [];
    results.forEach(res => {
      tempList.push(ProductEntity.Create(res));
    });
    return tempList;
  }
}

export class SearchParams extends EntityBase {
  public status: number = undefined; // 销售状态 1:销售中 2:已下架
  public project_name: string = undefined; // 产品名称
  public order_id: string = undefined; // 订单编号
  public section: string = undefined; // 上架时间section'xxx,xxx'
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private domain = environment.OPERATION_SERVE; // 运营域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取产品列表
   * @param searchParams 条件检索参数
   */
  public requestProductListData(searchParams: SearchParams): Observable<ProductLinkResponse> {
    const httpUrl = `${this.domain}/products`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new ProductLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求产品列表
   * @param string url linkUrl
   * @returns Observable<ProductLinkResponse>
   */
  public continueProductListData(url: string): Observable<ProductLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ProductLinkResponse(res)));
  }

  /**
   * 获取第三方产品列表
   * @param third_product_name 产品名称关键字
   */
  public requestThirdProductListData(third_product_name: string): Observable<ProductLinkResponse> {
    const httpUrl = `${this.domain}/third_products`;
    const body = {
      third_product_name
    };
    const params = this.httpService.generateListURLSearchParams(body);
    return this.httpService.get(httpUrl, params.json())
      .pipe(map(res => new ProductLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求产品列表
   * @param string url linkUrl
   * @returns Observable<ProductLinkResponse>
   */
  public continueThirdProductListData(url: string): Observable<ProductLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ProductLinkResponse(res)));
  }
}
