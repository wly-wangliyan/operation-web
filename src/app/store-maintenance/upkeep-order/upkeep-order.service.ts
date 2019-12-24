import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable, timer } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpService, LinkResponse, HttpErrorEntity } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../../core/global.service';
import { AccessoryEntity } from '../accessory-library/accessory-library.service';

export class UpkeepOrderSearchParams extends EntityBase {
  public order_type = 3; // 订单类型 1：到店保养 2：上门保养 3：救援订单
  public order_status = ''; // 1：待支付 2：已支付 3：已取消 4：已退款
  public contact_tel: string = undefined; // 手机号
  public contact_name: string = undefined; // 购买人
  public repair_shop_name: string = undefined; // 汽修店
  public order_id: string = undefined; // 订单id
  public order_section: string = undefined; // 下单时间
  public pay_section: string = undefined; // 支付时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class MatchParams extends EntityBase {
  public repair_shop_id: string = undefined; // 汽修店id
  public repair_shop_name: string = undefined; // 汽修店
  public accessory_id: string = undefined; // 配件id
  public accessory_name: string = undefined; // 配件名称
  public specification_id: string = undefined; // 规格id
  public battery_model: string = undefined; // 配件型号
  public original_fee: string = undefined; // 商品价格

  public toEditJson(): any {
    const json = this.json();
    json.original_fee = json.original_fee * 100;
    return json;
  }
}

// 保养订单退款订单实体
export class DoorRefundOrderEntity extends EntityBase {
  public door_refund_order_id: string = undefined; // 上门保养退款订单id-主键
  public refund_status: number = undefined; // 退款状态 0未申请退款 1退款中，2已退款，3退款失败
}

// 保养订单实体
export class UpkeepOrderEntity extends EntityBase {
  public door_order_id: string = undefined; // 上门保养订单id-主键
  public ht_code: string = undefined; // 用户id
  public ht_client_id: string = undefined; // 车辆类型 1：小型车
  public trade_no: string = undefined; // 微信支付订单id
  public contact_name: string = undefined; // 联系人
  public contact_tel: string = undefined; // 联系手机号
  public repair_shop_name: string = undefined; // 汽修店名称
  public repair_shop_id: string = undefined; // 汽修店id
  public repair_shop_district: string = undefined; // 汽修店所在区域
  public buy_num: number = undefined; // 购买数量
  public is_matched: boolean = undefined; // 是否匹配
  public accessory_info: AccessoryEntity = undefined; // 配件信息
  public original_fee: number = undefined; // 原价
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
  public send_status: number = undefined; // 配送状态 1：待收货 2：已完成
  public order_status: number = undefined; // 订单状态 1：待支付 2：待服务 3:已取消 4：已完成 5：已关闭
  public service_message_count: number = undefined; // 客服短信条数
  public service_message_content: string = undefined; // 客服短信内容
  public repair_message_count: number = undefined; // 汽修店短信条数
  public repair_message_content: string = undefined; // 汽修店短信内容
  public car_id: string = undefined; // 车牌号
  public car_model: string = undefined; // 车型
  public region: string = undefined; // 行政区
  public lon: number = undefined; // 经度
  public lat: number = undefined; // 纬度
  public location: string = undefined; // 地址坐标
  public address: string = undefined; // 详细地址
  public expect_date: number = undefined; // 期望送达时间
  public remark: string = undefined; // 订单备注
  public take_order_time: number = undefined; // 接单时间
  public refund_time: number = undefined; // 退款时间
  public refund_fee: number = undefined; // 退款金额
  public complete_time: number = undefined; // 完成时间
  public cancel_reason: string = undefined; // 取消原因
  public refund_reason: string = undefined; // 退款原因
  public refund_status: number = undefined; // 退款状态 1:已部分退款 2:已全额退款
  public door_refund_order: DoorRefundOrderEntity = undefined; // 退款订单
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'accessory_info') {
      return AccessoryEntity;
    } else if (propertyName === 'door_refund_order') {
      return DoorRefundOrderEntity;
    }
    return null;
  }
}

export class DoorRefundParams extends EntityBase {
  public refund_fee: number = undefined; // 退款金额

  public toEditJson(): any {
    const json = this.json();
    json.refund_fee = json.refund_fee * 100;
    return json;
  }
}

export class UpkeepOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UpkeepOrderEntity> {
    const tempList: Array<UpkeepOrderEntity> = [];
    results.forEach(res => {
      tempList.push(UpkeepOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpkeepOrderService {

  private domain = environment.STORE_DOMAIN;

  constructor(private httpService: HttpService, private globalService: GlobalService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: UpkeepOrderSearchParams): Observable<UpkeepOrderLinkResponse> {
    const httpUrl = `${this.domain}/orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new UpkeepOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<UpkeepOrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<UpkeepOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new UpkeepOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param order_id 订单ID
   * @returns Observable<UpkeepOrderEntity>
   */
  public requestOrderDetailData(order_id: string): Observable<UpkeepOrderEntity> {
    const httpUrl = `${this.domain}/orders/${order_id}`;
    const body = {
      order_type: 3
    };
    return this.httpService.get(httpUrl, body).pipe(map(res => UpkeepOrderEntity.Create(res.body)));
  }

  /**
   * 退款
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestOrderRefundData(door_order_id: string, params: DoorRefundParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}`;
    return this.httpService.post(httpUrl, params.toEditJson());
  }

  /**
   * 人工匹配
   * @param door_order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestMatchDate(door_order_id: string, params: MatchParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}`;
    return this.httpService.put(httpUrl, params.toEditJson());
  }

  /**
   * 编辑期望送达日期
   * @param door_order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditDate(door_order_id: string, expect_date: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}/expect_date`;
    const body = {
      expect_date
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 编辑订单备注
   * @param door_order_id 订单ID
   * @param remark 备注
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditRemark(door_order_id: string, remark: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/door_orders/${door_order_id}/remark`;
    const body = {
      remark
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 重新发送短信
   * @param order_id 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestResendMessage(order_id: string, order_type: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/orders/${order_id}/send_short_message`;
    const body = {
      order_type
    };
    return this.httpService.post(httpUrl, body);
  }
}
