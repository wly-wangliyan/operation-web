import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { FileUpdate } from '../../../../utils/file-update';

// 第三方产品实体
export class ThirdProductEntity extends EntityBase {
  public third_product_id: string = undefined; // 第三方产品id
  public third_product_name: string = undefined; // 第三方产品名称
  public add_time: number = undefined; // 第三方产品添加时间
  public third_product_image: string = undefined; // 第三方产品缩略图
  public type: string = undefined; // 第三方产品类型(A:景点 B:线路 C:酒店 F:套票 H:演出)
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 第三方产品详细地址
  public introduce: string = undefined; // 第三方产品介绍
  public grade: string = undefined; // 第三方产品等级
  public notice: string = undefined; // 第三方产品须知
  public run_time: number = undefined; // 第三方产品营业时间
  public saler_id: string = undefined; // 第三方产品资源id
  public sale_status: string = undefined; // 第三方产品销售状态
  public telephone: string = undefined; // 第三方联系电话
  public topics: string = undefined; // 第三方旅游主题
  public traffic_guide: string = undefined; // 第三方交通指南
  public open_time: number = undefined; // 第三方开放时间
  public market_price: number = undefined; // 第三方市场价
  public retail_price: number = undefined; // 第三方零售价
  public buy_price: number = undefined; // 第三方结算价
  public add_status: number = undefined; // 第三方产品添加状态
  public tickets: Array<TicketEntity> = []; // 门票实体
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'tickets') {
      return TicketEntity;
    }
    return null;
  }
}

export class ThirdProductLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ThirdProductEntity> {
    const tempList: Array<ThirdProductEntity> = [];
    results.forEach(res => {
      tempList.push(ThirdProductEntity.Create(res));
    });
    return tempList;
  }
}

// 产品实体
export class TicketProductEntity extends EntityBase {
  public product_id: string = undefined; // 产品id
  public third_product: ThirdProductEntity = undefined; // 第三方产品对象
  public product_name = ''; // 产品名称
  public product_subtitle = ''; // 产品副名称
  public sale_num: number = undefined; // 销量
  public image_urls: string = undefined; // 产品图片集合
  public run_time: number = undefined; // 营业时间
  public telephone: string = undefined; // 联系电话
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 详细地址
  public traffic_guide: string = undefined; // 交通指南
  public notice: string = undefined; // 产品须知
  public product_introduce: string = undefined; // 产品介绍
  public is_top: number = undefined; // 是否置顶 1:置顶 2:非置顶
  public top_time: number = undefined; // 置顶时间
  public is_deleted: number = undefined; // 是否删除 1:删除 2:未删除
  public shelve_time: number = undefined; // 上架时间
  public status: number = undefined; // 销售状态 1:销售中 2:已下架
  public tickets: Array<TicketEntity> = []; // 门票实体
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'third_product') {
      return ThirdProductEntity;
    } else if (propertyName === 'tickets') {
      return TicketEntity;
    }
    return null;
  }
}

export class ProductLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<TicketProductEntity> {
    const tempList: Array<TicketProductEntity> = [];
    results.forEach(res => {
      tempList.push(TicketProductEntity.Create(res));
    });
    return tempList;
  }
}

// 门票实体
export class TicketEntity extends EntityBase {
  public ticket_id: string = undefined; // 门票id 门票主键
  public third_ticket_id: string = undefined; // 第三方门票id
  public third_product: ThirdProductEntity = undefined; // 第三方门票id
  public third_price_id: string = undefined; // 第三方价格id
  public product: TicketProductEntity = undefined; // 产品对象
  public price_calendar: PriceCalendarEntity = undefined; // 门票价格日历
  public notes: string = undefined; // 购票须知
  public getaddr: string = undefined; // 取票信息
  public ticket_name: string = undefined; // 门票名称
  public pay: string = undefined; // 支付方式--UUpay 0:现场支付，1:在线支付
  public ticket_status: number = undefined; // 门票状态
  public market_price: number = undefined; // 市场价
  public validate_time_limit: string = undefined; // 验证时间
  public is_top: number = undefined; // 是否置顶 1:置顶 2:不置顶
  public top_time: number = undefined; // 置顶时间
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'third_product') {
      return ThirdProductEntity;
    } else if (propertyName === 'product') {
      return TicketProductEntity;
    } else if (propertyName === 'price_calendar') {
      return PriceCalendarEntity;
    }
    return null;
  }

}

// 门票价格日历
export class PriceCalendarEntity extends EntityBase {
  public price_id: string = undefined; // 价格id
  public third_price_id: string = undefined; // 第三方价格id
  public ticket: TicketEntity = undefined; // 门票对象
  public product: TicketProductEntity = undefined; // 产品对象
  public date: number = undefined; // 价格日期
  public storage: number = undefined; // 总库存 -1:表示无限
  public remain: string = undefined; // 实时剩余库存 -1:表示无限 99999999:表示无限
  public buy_price: number = undefined; // 结算价--buy_price 单位：分
  public retail_price: number = undefined; // 零售价--retail_price 单位：分
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'ticket') {
      return TicketEntity;
    } else if (propertyName === 'product') {
      return TicketProductEntity;
    }
    return null;
  }
}

// 产品列表条件筛选
export class SearchParams extends EntityBase {
  public status: number = undefined; // 销售状态 1:销售中 2:已下架
  public product_name: string = undefined; // 产品名称
  public order_id: string = undefined; // 订单编号
  public section: string = undefined; // 上架时间section'xxx,xxx'
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private domain = environment.TICKET_SERVER; // 票务域名
  private imageDomain: string = environment.STORAGE_DOMAIN;

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
  public requestThirdProductListData(third_product_name: string): Observable<ThirdProductLinkResponse> {
    const httpUrl = `${this.domain}/third_products`;
    const body = {
      third_product_name
    };
    const params = this.httpService.generateListURLSearchParams(body);
    return this.httpService.get(httpUrl, params)
      .pipe(map(res => new ThirdProductLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求第三方产品列表
   * @param string url linkUrl
   * @returns Observable<ThirdProductLinkResponse>
   */
  public continueThirdProductListData(url: string): Observable<ThirdProductLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ThirdProductLinkResponse(res)));
  }

  /**
   * 选用产品
   * @param third_product_id 第三方产品id
   * @returns Observable<HttpResponse<any>>
   */
  public requestAddProductData(third_product_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/products`;
    const body = {
      third_product_id
    };
    return this.httpService.post(httpUrl, body);
  }

  /**
   * 修改产品销售状态 （上架/下架）
   * @param product_id 产品id
   * @param status 销售状态 1:上架 2:下架
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeSaleStatusData(product_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/products/${product_id}/status`;
    const body = {
      status
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 修改产品排序
   * @param product_id 产品id
   * @param is_top 是否置顶 1:是 2:否
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeTopStatusData(product_id: string, is_top: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/products/${product_id}/is_top`;
    const body = {
      is_top
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 删除产品
   * @param product_id 产品id
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteProductData(product_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/products/${product_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
     * 产品详情
     * @param string product_id 产品id
     * @returns Observable<ThirdProductEntity>
     */
  public requestProductsDetail(product_id: string): Observable<TicketProductEntity> {
    return this.httpService.get(`${this.domain}/products/${product_id}`
    ).pipe(map(res => {
      return TicketProductEntity.Create(res.body);
    }));
  }

  /**
   * 第三方产品详情
   * @param string third_product_id 第三方产品id
   * @returns Observable<ThirdProductEntity>
   */
  public requestThirdProductsDetail(third_product_id: string): Observable<ThirdProductEntity> {
    return this.httpService.get(`${this.domain}/third_products/${third_product_id}`
    ).pipe(map(res => {
      return ThirdProductEntity.Create(res.body);
    }));
  }

  /**
   * 置顶
   * @param product_id 产品id
   * @param is_top 是否置顶
   * @returns Observable<HttpResponse<any>>
   */
  public requestIsTopProduct(product_id: string, ticket_id: string, is_top: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/products/${product_id}/tickets/${ticket_id}/is_top`;
    const body = {
      is_top
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 编辑产品
   * @param string product_id 产品id
   * @param productData ThirdProductEntity 数据源
   * @returns Observable<HttpResponse<any>>
   */
  public requestSetProductData(product_id: string, productData: TicketProductEntity): Observable<HttpResponse<any>> {
    return this.httpService.put(`${this.domain}/products/${product_id}`, {
      product_name: productData.product_name,
      product_subtitle: productData.product_subtitle,
      image_urls: productData.image_urls,
      telephone: productData.telephone,
      traffic_guide: productData.traffic_guide,
      notice: productData.notice,
      product_introduce: productData.product_introduce,
    }
    );
  }

  /**
   * 上传图片
   * @param file
   * @returns {any}
   */
  public requestUploadPicture(file: any): Observable<any> {
    const url = this.imageDomain + `/storages/images`;
    return Observable.create(observer => {
      FileUpdate(file, url, (sourceUrl) => {
        observer.next({ sourceUrl });
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }

}
