import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable, timer } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpService, LinkResponse, HttpErrorEntity } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../../core/global.service';

export class RescueOrderSearchParams extends EntityBase {
  public order_type = 3; // 订单类型 1：到店保养 2：上门保养 3：救援订单
  public order_status = ''; // 1：待支付 2：待支付 3：已取消 4：已退款
  public service_status = ''; // 服务状态 1：待接单 2：待服务 3：已完成 4：已拒绝
  public rescue_project_type = ''; // 救援项目类别 1：搭电 2：换胎
  public contact_tel: string = undefined; // 手机号
  public contact_name: string = undefined; // 购买人
  public repair_shop_name: string = undefined; // 应援汽修店
  public order_id: string = undefined; // 订单id
  public order_section: string = undefined; // 下单时间
  public pay_section: string = undefined; // 支付时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 救援订单实体
export class RescueOrderEntity extends EntityBase {
  public rescue_order_id: string = undefined; // 救援订单id-主键
  public ht_code: string = undefined; // 用户id
  public ht_client_id: string = undefined; // 车辆类型 1：小型车
  public trade_no: string = undefined; // 微信支付订单id
  public contact_name: string = undefined; // 联系人
  public contact_tel: string = undefined; // 联系手机号
  public repair_shop_name: string = undefined; // 汽修店名称
  public repair_shop_id: string = undefined; // 汽修店id
  public rescue_project_type: number = undefined; // 救援项目类别 1：搭电 2：换胎
  public real_prepaid_fee: number = undefined; // 实收预付费 单位：分
  public right_prepaid_fee: number = undefined; // 应收预付费 单位：分
  public real_balance_fee: number = undefined; // 实收尾款 单位：分
  public right_balance_fee: number = undefined; // 应收尾款 单位：分
  public prepaid_platform_discount: number = undefined; // 预付平台立减 单位：分
  public balance_platform_discount: number = undefined; // 尾款平台立减 单位：分
  public prepaid_coupon_discount: number = undefined; // 预付优惠卷优惠金额 单位：分
  public balance_coupon_discount: number = undefined; // 尾款优惠卷优惠金额 单位：分
  public total_right_fee: number = undefined; // 总金额 单位：分
  public pay_time: number = undefined; // 支付时间
  public service_status: number = undefined; // 服务状态 1：待接单 2：待服务 3：已完成 4：已拒绝 默认为空
  public order_status: number = undefined; // 订单状态 1：待支付 2：已支付 3：已取消 4：已退款
  public car_id: string = undefined; // 车牌号
  public lon: number = undefined; // 经度
  public lat: number = undefined; // 纬度
  public location: string = undefined; // 地址坐标
  public address: string = undefined; // 地址
  public rescue_project_name: string = undefined; // 救援项目名称
  public take_order_time: number = undefined; // 接单时间
  public refund_time: number = undefined; // 退款时间
  public complete_time: number = undefined; // 完成时间
  public refund_reason: string = undefined; // 退款原因
  public refund_status: number = undefined; // 退款状态 1退款中，2已部分退款，3已全额退款，4退款失败
  public refund_fee: number = undefined; // 退款金额
  public pay_expire_time: number = undefined; // 支付订单失效时间
  public take_expire_time: number = undefined; // 接收订单失效时间
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

export class RefundParams extends EntityBase {
  public order_type = 3; // 订单类型 1：到店保养 2：上门保养 3:救援订单
  public order_id: string = undefined; // 订单id
  public refund_fee: number = undefined; // 退款金额
  public refund_remark: string = undefined; // 退款备注
}

export class RescueOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RescueOrderEntity> {
    const tempList: Array<RescueOrderEntity> = [];
    results.forEach(res => {
      tempList.push(RescueOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RescueOrderService {

  private domain = environment.EXEMPTION_DOMAIN; // 免检域名

  constructor(private httpService: HttpService, private globalService: GlobalService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: RescueOrderSearchParams): Observable<RescueOrderLinkResponse> {
    const httpUrl = `${this.domain}/exemption/orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new RescueOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<RescueOrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<RescueOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new RescueOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param order_id 订单ID
   * @returns Observable<RescueOrderEntity>
   */
  public requestOrderDetailData(order_id: string): Observable<RescueOrderEntity> {
    const httpUrl = `${this.domain}/exemption/orders/${order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => RescueOrderEntity.Create(res.body)));
  }

  /**
   * 退款
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestOrderRefundData(params: RefundParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/refund_orders`;
    return this.httpService.put(httpUrl, params.json());
  }
}
