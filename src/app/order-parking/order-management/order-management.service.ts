import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../core/http.service';
import { environment } from '../../../environments/environment';

export class OrderSearchParams extends EntityBase {
  public order_status = ''; // 订单状态
  public buyer_tel = ''; // 车主信息：手机号
  public buyer_name = ''; // 车主信息：预定人
  public order_id = ''; // 订单id
  public order_time = ''; // 下单时间
  public pay_time = ''; // 支付时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 停车场信息实体
export class ParkingEntity extends EntityBase {
  public parking_id: string = undefined; // 停车场ID 主键
  public area_type: number = undefined; // 用地类型 1:路内 2:路外
  public parking_name: string = undefined; // 停车场名称
  public images: string = undefined; // 图片
  public operate_type: number = undefined; // 管理模式/运营模式 1:非封闭 2:封闭 -1:未知
  public province: string = undefined; // 省
  public city: string = undefined; // 市
  public district: string = undefined; // 区
  public address: string = undefined; // 停车场地址
  public start_time: number = undefined; // 营业开始时间 默认:空
  public end_time: number = undefined; // 营业结束时间 默认:空
  public lon: string = undefined; // 经度
  public lat: string = undefined; // 纬度
  public location: any = undefined; // point	位置坐标
  public tags: Array<any> = undefined; // 标签
  public origin_fee: number = undefined; // 原价 单位:分
  public sale_fee: number = undefined; // 售价 单位:分
  public pre_fee: number = undefined; // 预付 单位:分
  public minus_fee: number = undefined; // 下单立减 单位:分
  public min_days: number = undefined; // 最低预定
  public main_tel: string = undefined; // 手机号(主)
  public standby_tel: string = undefined; // 手机号(备)
  public instruction: string = undefined; // 预约说明
  public notice: string = undefined; // 购买须知
  public is_deleted: boolean = undefined; // 逻辑删除 默认:False
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间
}

// 订单实体
export class BookingOrderEntity extends EntityBase {
  public order_id: string = undefined; // 订单id
  public ht_code: string = undefined; // 	用户ID
  public client_id: string = undefined; // 	client_id 区分平台
  public buyer_name: string = undefined; // 车主信息：购买人
  public buyer_tel: string = undefined; // 车主信息：手机号
  public trade_no: string = undefined; // 支付交易单号
  public order_status: number = undefined; // 订单状态 1未支付 2已支付 3已退款 4已入场 5已取消
  public car_message_count: number = undefined; // 	车主短信次数
  public parking_message_count: number = undefined; // 	停车场短信次数
  public car_id: string = undefined; // 车主信息：车牌号
  public booking_days: number = undefined; // 	integer	预约时长
  public booking_arrive_time: number = undefined; // 	float	预约到场时间
  public coupon_id: string = undefined; // 	string	优惠券ID
  public parking_info: ParkingEntity = undefined; // 	string	停车场信息
  public order_time: number = undefined; // 	下单时间
  public pay_time: number = undefined; // 支付时间
  public arrive_time: number = undefined; // 到场时间
  public refund_time: number = undefined; // 退款时间
  public remark: string = undefined; // 订单备注
  public total_fee: number = undefined; // 应付总金额 单位:分
  public should_pre_fee: number = undefined; // 应付预付金 单位:分
  public real_pre_fee: number = undefined; // 实付预付金 单位:分
  public real_fee: number = undefined; // 实付金额 单位:分
  public minus_fee: number = undefined; // 平台立减 单位：分
  public parking_fee: number = undefined; // 取车时现场支付停车场 单位：分
  public coupon_fee: number = undefined; // 优惠卷优惠金额 单位：分
  public refund_fee: number = undefined; // 退款金额
  public created_time: number = undefined; // 下单时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'parking_info') {
      return ParkingEntity;
    }
    return null;
  }
}

export class BookingOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BookingOrderEntity> {
    const tempList: Array<BookingOrderEntity> = [];
    results.forEach(res => {
      tempList.push(BookingOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  private domain = environment.BOOKING_DOMAIN; // 预约泊车域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: OrderSearchParams): Observable<BookingOrderLinkResponse> {
    const httpUrl = `${this.domain}/admin/orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new BookingOrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<ExemptionOrderLinkResponse>
   */
  public continueOrderListData(url: string): Observable<BookingOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new BookingOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param order_id 订单ID
   * @returns Observable<ExemptionOrderEntity>
   */
  public requestOrderDetailData(order_id: string): Observable<BookingOrderEntity> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => BookingOrderEntity.Create(res.body)));
  }

  /**
   * 编辑订单详情
   * @param order_id 订单ID
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestUpdateOrderDetailData(params: any, order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}/remark`;
    return this.httpService.patch(httpUrl, params);
  }

  /**
   * 创建退款订单
   * @param param 创建退款订单参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestCreateRefundOrder(param: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/refund_orders`;
    return this.httpService.post(httpUrl, param);
  }

  /**
   * 订单退款
   * @param param 退款订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestOrderRefund(refund_order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/refund_orders/${refund_order_id}/pay_refund`;
    return this.httpService.put(httpUrl);
  }

  /**
   * 重发订单短信
   * @param param 订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestResendMessage(order_id: string, param: any): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}/send_message`;
    return this.httpService.get(httpUrl, param);
  }
}
