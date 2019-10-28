import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { PriceCalendarEntity, TicketEntity, TicketProductEntity } from '../product-management/product.service';

export class SearchParams extends EntityBase {
  public status: number = undefined; // 订单状态 1:待支付 2：已支付 3：已取消
  public use_status: number = undefined; // 使用状态 1:已使用,2:已取消,3:未使用,4:已过期
  public product_name: string = undefined; // 产品名称
  public order_id: string = undefined; // 订单编号
  public order_section: string = undefined; // 下单时间
  public pay_section: string = undefined; // 支付时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 票务信息
export class TicketInfo extends EntityBase {
  public ticket_name: string = undefined; // 门票名称
  public valid_time: string = undefined; // 门票有效期
  public ticket_use_status: string = undefined; // 门票使用状态
}

// 游客信息
export class VisitorInfo extends EntityBase {
  public name: string = undefined; // 游客姓名
  public certificate_type: number = undefined; // 证件类型 1:身份证 2:护照
  public certificate_id: string = undefined; // 证件号
  public telephone: string = undefined; // 手机号
}

// 订单实体
export class TicketOrderEntity extends EntityBase {
  public order_id: string = undefined; // 订单id
  public price_calendar: PriceCalendarEntity = undefined; // 门票价格日历对象
  public ticket: TicketEntity = undefined; // 门票对象
  public product: TicketProductEntity = undefined; // 产品对象
  public buy_num: number = undefined; // 购买数量
  public right_price: number = undefined; // 应收价格
  public real_price: number = undefined; // 实收价格
  public total_price: number = undefined; // 总价格 单位：分
  public discount_price: number = undefined; // 平台优惠 单位：分
  public market_price: number = undefined; // 市场价 单位：分
  public retail_price: number = undefined; // 零售价 单位：分
  public buy_price: number = undefined; // 	结算价 单位：分
  public platform_price: number = undefined; // 平台价 单位：分
  public pay_type: string = undefined; // 支付方式 悠悠:UU-UU 微信:UU-WX,WX-WX
  public pay_time: number = undefined; // 支付时间
  public third_order_id: string = undefined; // 第三方订单id
  public order_code: string = undefined; // 凭证码/消费码
  public order_code_url: string = undefined; // 订单详情及二维码
  public order_code_image: string = undefined; // 二维码图片
  public take_order_time: string = undefined; // 取票时间
  public is_take_order: number = undefined; // 是否取票 1：未取票 2：已取票
  public consume_time: string = undefined; // 消费时间 格式：Y - m - d H: i: s
  public present_consume_num: number = undefined; // integer	本次消费数量
  public total_consume_num: number = undefined; // integer	总计消费数
  public is_all_consume: number = undefined; // 是否全部消费 1: 全部消费 7：部分消费
  public consume_source: number = undefined; // 验证渠道 2 - 平台；4 - 硬件
  public is_expire_consume: number = undefined; // 是否有效期消费 1: 有效期内消费 2：不是
  public refund_check_time: string = undefined; // 审核时间
  public refund_remain_num: number = undefined; // 剩余数量
  public refund_check_result: number = undefined; // 退票审核结 1 - 同意退票 2 - 拒绝退票
  public is_refund: number = undefined; // 是否退票 1：退票 2：不退票
  public refund_check_explain: string = undefined; // 审核说明
  public refund_price: number = undefined; // 退款金额（单价 * 数量） 不包含退票手续费 单位: 分
  public refund_fee: number = undefined; // 退票手续费 单位：分
  public refund_serial_number: string = undefined; // 退票流水号
  public refund_source: number = undefined; // 退票验证渠道 2 - 平台；4 - 硬件
  public code: string = undefined; // 三方消费
  public user_id: string = undefined; // 用户id
  public visitor_ids: Array<any> = undefined; // 游客id集合
  public upload_flag: boolean = undefined; // 上传标志
  public pay_expiration_time: number = undefined; // 支付截止时间
  public unpaid_expire: number = undefined; // 待支付有效期
  public status: number = undefined; // 订单状态 1:待支付 2：已支付 3：已取消
  public order_begin_time: number = undefined; // 有效开始时间
  public order_end_time: number = undefined; // 有效结束时间
  public play_time: number = undefined; // 游玩日期
  public ota_pay_type: number = undefined; // OTA支付方式 1：授信余额 2：账户余额
  public use_status: number = undefined; // 使用状态 1:已使用,2:已取消,3:未使用,4:已过期
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间/下单时间
  public coupon_used_amount: number = undefined; // 优惠券优惠金额
  public coupon_id: string = undefined; // 优惠券id
  public coupon_upload_flag: string = undefined; // 优惠券同步状态
  public ticket_info: TicketInfo = undefined; // 票务信息
  public visitor_info: Array<VisitorInfo> = undefined; // 游客信息

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'ticket') {
      return TicketEntity;
    } else if (propertyName === 'product') {
      return TicketProductEntity;
    } else if (propertyName === 'price_calendar') {
      return PriceCalendarEntity;
    } else if (propertyName === 'ticket_info') {
      return TicketInfo;
    } else if (propertyName === 'visitor_info') {
      return VisitorInfo;
    }
    return null;
  }
}

export class OrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<TicketOrderEntity> {
    const tempList: Array<TicketOrderEntity> = [];
    results.forEach(res => {
      tempList.push(TicketOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  private domain = environment.TICKET_SERVER; // 票务域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: SearchParams): Observable<OrderLinkResponse> {
    const httpUrl = `${this.domain}/orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new OrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<OrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<OrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new OrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param order_id 订单ID
   * @returns Observable<OrderEntity>
   */
  public requestOrderDetailData(order_id: string): Observable<TicketOrderEntity> {
    const httpUrl = `${this.domain}/orders/${order_id}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => TicketOrderEntity.Create(res.body)));
  }
}
