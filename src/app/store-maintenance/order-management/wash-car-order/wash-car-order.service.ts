import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpResponse } from '@angular/common/http';

export class WashCarSearchParams extends EntityBase {
  public order_status = ''; // 订单状态 1：待支付 2：已取消 3：待核销 4：已完成 5:已关闭 6:已失效
  public specification_name: string = undefined; // 规格名称(产品名称)
  public wash_car_order_id: string = undefined; // 订单编号
  public order_section: string = undefined; // 下单时间区间 "xxx,xxx"
  public pay_section: string = undefined; // 支付时间区间 "xxx,xxx"
  public car_type = ''; // 车型 1: 5座小型车 2：SUV/MPV
  public ht_code: string = undefined; // 用户id
  public telephone: string = undefined; // 手机号
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class StatisticSearchParams extends EntityBase {
  public section: string = undefined; // 时间区间 "xxx,xxx"
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class WashRefundEntity extends EntityBase {
  public refund_application_id: string = undefined; // 	string	退款申请id 主键
  public wash_car_order: WashCarOrderEntity = undefined; // 	object	洗车订单对象 WashCarOrder
  public refund_reason: string = undefined; // 	string	退款原因
  public refuse_reason: string = undefined; // 	string	拒绝原因
  public refund_fee: number = undefined; // 	integer	退款金额
  public refund_explain: string = undefined; // 	string	退款说明
  public images = undefined; // 	string	上传凭证 多个逗号分隔
  public apply_status: number = undefined; // 	integer	申请状态 1: 处理中 2: 申请通过 3: 申请驳回
  public specification_name: string = undefined; // 	string	规格名称
  public car_type: number = undefined; // 	integer	车型 1: 5座小型车 2：SUV/MPV
  public valid_date_start: number = undefined; // 	float	规格有效期开始
  public valid_date_end: number = undefined; // 	float	规格有效期结束
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'wash_car_order') {
      // tslint:disable-next-line: no-use-before-declare
      return WashCarOrderEntity;
    }
    return null;
  }
}

export class WashCarOrderEntity extends EntityBase {
  public wash_car_order_id: string = undefined; // 订单编号 主键
  public ht_code: string = undefined; // 用户id
  public ht_client_id: string = undefined; // ht_client_id
  public trade_no: string = undefined; // 交易单号
  public wash_car_specification: any = undefined; // 洗车产品信息(规格名称从中获取)
  public original_fee: number = undefined; // 应收(原价) 单位:分
  public sale_fee: number = undefined; // 实收(售价) 单位:分
  public minus_fee: number = undefined; // 平台立减 单位:分
  public buy_fee: number = undefined; // 结算价 单位:分
  public coupon_used_amount: number = undefined; // 优惠卷 单位:分
  public remark: string = undefined; // 订单备注
  public order_status: number = undefined; // 订单状态 1：待支付 2：已取消 3：待核销 4：已完成 5:已关闭 6:已失效
  public pay_type: string = undefined; // 支付方式
  public pay_time: number = undefined; // 支付时间
  public pay_way: number = undefined; // 支付方式 1: 微信  2: 钱包
  public refund_status: number = undefined; // 退款状态 1:退款中 2:已退款 3：退款失败
  public refund_time: number = undefined; // 退款时间
  public refund_reason: string = undefined; // 退款原因
  public refund_fee: number = undefined; // 退款金额
  public pay_expire_time: number = undefined; // 支付订单失效时间
  public verify_use_num: number = undefined; // 核销凭证使用个数
  public qr_code: string = undefined; // 二维码
  public apollo_status: number = undefined; // 通知apollo状态 1：待支付 2：已取消 3：待核销 4：已完成 5:已关闭
  public valid_date_start: number = undefined; // 有效期开始日期
  public valid_date_end: number = undefined; // 有效期结束日期
  public telephone: string = undefined; // 用户电话
  public expense_verifies_info: Array<any> = undefined; // 订单下消费码集合(仅提供给前端使用)
  public refund_application: WashRefundEntity = new WashRefundEntity(); // 	integer	申请状态 1: 处理中 2: 申请通过 3: 申请驳回
  public client_type: number = undefined; // 订单来源  1: 小程序  2:安卓 3:苹果
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    // if (propertyName === 'wash_car_specification') {
    //   return WashCarSpecificationEntity;
    // }
    if (propertyName === 'refund_application') {
      return WashRefundEntity;
    }
    return null;
  }
}

export class OrderSpecificationEntity extends EntityBase {
  public specification_name: string = undefined; //  string	规格名称
  public car_type: number = undefined; // 	integer	车型 车型 1: 5座小型车 2：SUV/MPV
  public specification_num: number = undefined; // 	integer	规格数量
}

export class OrderStatisticEntity extends EntityBase {
  public wash_car_statistic_id: string = undefined; //  string	洗车订单统计id 主键
  public statistic_date: number = undefined; // 	float	日期
  public pay_order_num: number = undefined; // 	integer	支付订单数量
  public specification_infos: Array<OrderSpecificationEntity> = undefined; // 	array	规格数量信息
  // -specification_name	string	规格名称
  // -car_type	integer	车型 车型 1: 5座小型车 2：SUV/MPV
  // -specification_num	integer	规格数量
  public running_money: number = undefined; // 	integer	流水 单位:分
  public code_num: number = undefined; // 	integer	核销码数量（卷数量）
  public small_code_num: number = undefined; // 	integer	小车卷数量
  public large_code_num: number = undefined; // 	integer	大车卷数量
  public verify_num: number = undefined; // 	integer	核销数量
  public refund_order_num: number = undefined; // 	integer	退款订单数量
  public refund_fee: number = undefined; // 	integer	退款金额
  public cancel_order_num: number = undefined; // 	integer	取消订单数量
  public created_time: number = undefined; // 下单时间(创建时间)
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'specification_infos') {
      return OrderSpecificationEntity;
    }
    return null;
  }
}

export class WashCarOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<WashCarOrderEntity> {
    const tempList: Array<WashCarOrderEntity> = [];
    results.forEach(res => {
      tempList.push(WashCarOrderEntity.Create(res));
    });
    return tempList;
  }
}

export class OrderStatisticLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<OrderStatisticEntity> {
    const tempList: Array<OrderStatisticEntity> = [];
    results.forEach(res => {
      tempList.push(OrderStatisticEntity.Create(res));
    });
    return tempList;
  }
}

// 退款
export class WashCarRefundParams extends EntityBase {
  public refund_fee: number = undefined; // 退款金额
  public refund_reason: string = undefined; // 退款原因

  public toEditJson(): any {
    const json = this.json();
    json.refund_fee = Math.round(json.refund_fee * 100);
    return json;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WashOrderService {

  private domain = environment.STORE_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: WashCarSearchParams): Observable<WashCarOrderLinkResponse> {
    const httpUrl = `${this.domain}/admin/wash_car_orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new WashCarOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<WashCarOrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<WashCarOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new WashCarOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param wash_car_order_id 订单ID
   * @returns Observable<WashCarOrderEntity>
   */
  public requestOrderDetailData(wash_car_order_id: string): Observable<WashCarOrderEntity> {
    const httpUrl = `${this.domain}/admin/wash_car_orders/${wash_car_order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => WashCarOrderEntity.Create(res.body)));
  }

  /**
   * 退款
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestOrderRefundData(wash_car_order_id: string, params: WashCarRefundParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_car_orders/${wash_car_order_id}/refund_orders`;
    return this.httpService.post(httpUrl, params.toEditJson());
  }

  /**
   * 编辑订单备注
   * @param wash_car_order_id 订单ID
   * @param remark 备注
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditRemark(wash_car_order_id: string, remark: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_car_orders/${wash_car_order_id}/remark`;
    const body = {
      remark
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 洗车订单数量统计
   * @param searchParams WashCarSearchParams
   * @returns Observable<WashCarOrderEntity>
   */
  public requestWashCarStatisticsData(searchParams: WashCarSearchParams): Observable<any> {
    const params = searchParams.clone();
    delete params.page_num;
    delete params.page_size;
    const httpUrl = `${this.domain}/admin/wash_car_orders/statistics`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => res.body));
  }

  /**
   * 洗车订单统计数据
   * @param searchParams StatisticSearchParams
   * @returns Observable<OrderStatisticEntity>
   */
  public requestOrderStatisticsData(searchParams: StatisticSearchParams): Observable<OrderStatisticLinkResponse> {
    const httpUrl = `${this.domain}/admin/wash_car_order_statistics`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new OrderStatisticLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单统计数据
   * @param string url linkUrl
   * @returns Observable<WashCarOrderLinkResponse>
   */
  public continueOrderStatisticData(url: string): Observable<OrderStatisticLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new OrderStatisticLinkResponse(res)));
  }
}
