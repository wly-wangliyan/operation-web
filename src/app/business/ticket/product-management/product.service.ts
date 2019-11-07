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
  public tp_id: string = undefined; // 产品id
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
  public grade: string = undefined; // 第三方产品等级
  public notice: string = undefined; // 第三方产品须知
  public run_time: number = undefined; // 第三方产品营业时间
  public saler_id: string = undefined; // 第三方产品资源id
  public fax: string = undefined; // 第三方产品联系传真--UUfax
  public sale_status: string = undefined; // 第三方产品销售状态
  public telephone: string = undefined; // 第三方联系电话
  public topics: string = undefined; // 第三方旅游主题
  public traffic_guide: string = undefined; // 第三方交通指南
  public open_time: number = undefined; // 第三方开放时间
  public market_price: number = undefined; // 第三方市场价
  public retail_price: number = undefined; // 第三方零售价
  public platform_price: number = undefined; // 平台售价
  public buy_price: number = undefined; // 第三方结算价
  public merchant: number = undefined; // 1：甜程网
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
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public location: string = undefined; // 坐标
  public notice: string = undefined; // 产品须知
  public product_introduce: string = undefined; // 产品介绍
  public is_top: number = undefined; // 是否置顶 1:置顶 2:非置顶
  public top_time: number = undefined; // 置顶时间
  public is_deleted: number = undefined; // 是否删除 1:删除 2:未删除
  public shelve_time: number = undefined; // 上架时间
  public status: number = undefined; // 销售状态 1:销售中 2:已下架
  public tickets: Array<TicketEntity> = []; // 门票实体
  public merchant: number = undefined; // 1：甜程网
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
  public tp_id: string = undefined; // 第三方产品id(原始数据)
  public third_price_id: string = undefined; // 第三方价格id
  public supplier_id: string = undefined; // 供应商id--UUaid
  public product: TicketProductEntity = undefined; // 产品对象
  public ass_station: string = undefined; // 集合地点/线路--UUass_station
  public age_limit_max: string = undefined; // 最大年龄限制--UUage_limit_max
  public age_limit_min: string = undefined; // 最小年龄限制--UUage_limit_min
  public buy_limit_num: number = undefined; // 限购票数--UUbuy_limit_num
  public buy_limit_date: number = undefined; // 购买限制时间--UUbuy_limit_date 0：整个销售时间段，1：每日，2：每周，3：每月
  public buy_limit: number = undefined; // 购买限制--UUbuy_limit 0: 不限，1: 手机号 - 张票，2: 身份证 - 张票，3: 手机号 - 笔订单，4: 身份证 - 笔订单，5: 同时 - 张票，6: 同时 - 笔订单
  public buy_limit_up: number = undefined; // 购买上限--UUbuy_limit_up 0：不限
  public buy_limit_low: number = undefined; // 购买下限--UUbuy_limit_low
  public end_place: number = undefined; // 目的地--UUendplace
  public expire_action: number = undefined; // 订单过期后处理方式--UUexpire_action 1: 不做处理，2: 自动完结，3: 自动验证，4: 自动取消
  public expire_action_days: number = undefined; // 多少天后自动处理--UUexpire_action_days
  public expire_cancel_fee: number = undefined; // 自动取消的手续费--UUexpire_cancel_fee
  public tourist_info: number = undefined; // 身份证信息--UUtourist_info 0: 不需要填写，1: 需要填写，2: 需要填写所有游客身份证
  public cancel_auto_in_min: number = undefined; // 未支付多少分钟内自动取消--UUcancel_auto_onMin
  public num_modify: number = undefined; // 更改数量--UUnum_modify 0: 只可减少，大于0为增减或减少的上限比例
  public tour_days: number = undefined; // 一次游玩天数--UUrday
  public order_advance_day: number = undefined; // 提前下单时间间隔--UUdday
  public order_advance_hour: string = undefined; // 提前下单截止具体时间--UUdhour
  public max_order_days: number = undefined; // 提前下单最多间隔天数--UUmax_order_days
  public print_ticket_limit: number = undefined; // 是否当日可取票--UUprint_ticket_limit 0: 不限，1: 单日可取
  public refund_audit: number = undefined; // 退票审核--UUrefund_audit 0：不需要审核，1：需要审核
  public refund_early_time: number = undefined; // 退票提前多少分钟--UUrefund_early_time
  public refund_rule: number = undefined; // 退票规则--UUrefund_rule 退票规0 - 有效期内可退：未使用订单末级分销商可退；过期订单供应商可退，1 - 游玩日期内可退，阶梯退：未使用订单末级分销商可退；过期订单供应商可退2 - 不可退：分销商供应商都不可退3 - 随时退：未使用订单末级分销商可退；过期订单分销商可退，供应商可退 - 1=不可退且是可提现
  public cancel_cost: string = undefined; // 取消费用--UUcancel_cost
  public reb_type: number = undefined; // 取消费用类型--UUreb_type
  public reb: number = undefined; // 退款数值--UUreb
  public start_place: string = undefined; // 出发城市或地区--UUstartplace
  public series_model: string = undefined; // 团号模型--series_model
  public delay_days: number = undefined; // 允许退职游玩的天数--UUdelaydays
  public order_end: number = undefined; // 期票结束日--UUorder_end
  public order_start: number = undefined; // 期票起始日--UUorder_start
  public is_validated: string = undefined; // 游玩日期前是否可验证--UUif_verify 0：不限，1：游玩日期前不可验证
  public delay_type: number = undefined; // 使用有效期类型--UUdelaytype 0: 游玩日期起有效，1: 下单日期起有效，2: 期票模式
  public order_limit: string = undefined; // 订单验证限制日期--UUorder_limit
  public batch_day_check: number = undefined; // 分批验证，每天可验证张数--UUbatch_day_check
  public batch_check: number = undefined; // 分批验证--UUbatch_check 0: 不支持，1: 支持，2: 一票一码，3: 一票一证
  public delay_time: string = undefined; // 延迟验证时间--UUdelaytime
  public preset_time: string = undefined; // 预定时间
  public fee_contain: string = undefined; // 费用包含
  public use_notice: string = undefined; // 使用须知
  public rc_notice: string = undefined; // 退改须知
  public order_advance_days: string = undefined; // 提前下单时间间隔 - -UUddays
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
  public third_product: ThirdProductEntity = undefined; // 第三方产品对象
  public date: number = undefined; // 价格日期
  public storage: number = undefined; // 总库存 -1:表示无限
  public remain: string = undefined; // 实时剩余库存 -1:表示无限 99999999:表示无限
  public buy_price: string = undefined; // 结算价--buy_price 单位：分
  public retail_price: string = undefined; // 零售价--retail_price 单位：分
  public platform_price: string = undefined; // 平台价 单位：分
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'ticket') {
      return TicketEntity;
    } else if (propertyName === 'product') {
      return TicketProductEntity;
    } else if (propertyName === 'third_product') {
      return ThirdProductEntity;
    }
    return null;
  }
}

export class TicketLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<TicketEntity> {
    const tempList: Array<TicketEntity> = [];
    results.forEach(res => {
      tempList.push(TicketEntity.Create(res));
    });
    return tempList;
  }
}

export class PriceCalendarLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PriceCalendarEntity> {
    const tempList: Array<PriceCalendarEntity> = [];
    results.forEach(res => {
      tempList.push(PriceCalendarEntity.Create(res));
    });
    return tempList;
  }
}

// 批量导入字段
export class SearchBatchImportParams extends EntityBase {
  public type: number = undefined; // 录入方式
  public price: string = undefined; // 查询价格结束日期
}

// 价格日历条件筛选
export class SearchPriceCalendarParams extends EntityBase {
  public start_date: string = undefined; // 查询价格开始日期
  public end_date: string = undefined; // 查询价格结束日期
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
   * 编辑门票列表购票须知
   * @param string product_id 产品id
   * @param ticket TicketEntity 门票数据源
   * @returns Observable<HttpResponse<any>>
   */
  public requestSetInstructions(product_id: string, ticket: TicketEntity): Observable<HttpResponse<any>> {
    return this.httpService.put(`${this.domain}/products/${product_id}/tickets/${ticket.ticket_id}`, {
      preset_time: ticket.preset_time,
      fee_contain: ticket.fee_contain,
      use_notice: ticket.use_notice,
      rc_notice: ticket.rc_notice,
    }
    );
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

  /**
 * 更新门票列表
 * @param string product_id 产品id
 * @returns Observable<TicketLinkResponse>
 */
  public requesTicketsList(product_id: string): Observable<TicketLinkResponse> {
    const httpUrl = `${this.domain}/products/${product_id}/tickets`;
    return this.httpService.get(httpUrl).pipe(map(res => new TicketLinkResponse(res)));
  }

  /**
   * 获取价格日历
   * @param product_id 产品ID
   * @param ticket_id 门票ID
   * @param searchPriceCalendarParams SearchPriceCalendarParams
   * @returns Observable<PriceCalendarLinkResponse>
   */
  public requestPriceCalendars(product_id: string, ticket_id: string, searchPriceCalendarParams: SearchPriceCalendarParams): Observable<PriceCalendarLinkResponse> {
    const httpUrl = `${this.domain}/products/${product_id}/tickets/${ticket_id}/price_calendars`;
    return this.httpService.get(httpUrl, searchPriceCalendarParams)
      .pipe(map(res => new PriceCalendarLinkResponse(res)));
  }

  /**
 * 编辑价格日历的平台售价
 * @param string product_id 产品id
 * @param string ticket_id 门票ID
 * @returns Observable<HttpResponse<any>>
 */
  public requestSetPlatformPrice(product_id: string, ticket_id: string, value: any): Observable<HttpResponse<any>> {
    return this.httpService.patch(`${this.domain}/products/${product_id}/tickets/${ticket_id}/price_calendars/${value.price_id}/platform_price`, {
      platform_price: Number(value.platform_price) * 100,
    }
    );
  }

  /**
   * 获取第三方价格日历
   * @param third_product_id 第三方产品ID
   * @param ticket_id 门票ID
   * @param searchPriceCalendarParams SearchPriceCalendarParams
   * @returns Observable<PriceCalendarLinkResponse>
   */
  public requestThirdPriceCalendars(third_product_id: string, ticket_id: string, searchPriceCalendarParams: SearchPriceCalendarParams): Observable<PriceCalendarLinkResponse> {
    const httpUrl = `${this.domain}/third_products/${third_product_id}/tickets/${ticket_id}/price_calendars`;
    return this.httpService.get(httpUrl, searchPriceCalendarParams)
      .pipe(map(res => new PriceCalendarLinkResponse(res)));
  }

}
