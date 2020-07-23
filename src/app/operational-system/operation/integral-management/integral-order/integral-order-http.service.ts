import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

// 积分订单筛选
export class SearchIntegralOrderParams extends EntityBase {
  public telephone: string = undefined; // 手机号
  public name: string = undefined; // 买家姓名
  public integral_order_id: string = undefined; // 订单号
  public commodity_name: string = undefined; // 产品名称
  public pay_section: string = undefined; // 支付时间
  public order_section: string = undefined; // 下单时间
  public pay_status: any = undefined; // 订单状态 1待支付 2已支付 3:已取消
  public order_status: any = undefined;
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class OrderDetailEntity extends EntityBase {
  public commodity_id: string = undefined; // 商品id;
  public commodity_name: string = undefined; // 商品名称;
  public commodity_type: number = undefined; // 商品类型
  public cover_image: string = undefined; // 封面图片地址;
  public commodity_images: Array<string> = []; // 商品图片列表;
  public integral_amount: number = undefined; // 兑换积分
  public amount: number = undefined; // 商品数量;
  public template_coupon_ids: string = undefined; // 优惠券模板ID 'XXX,XXX'
  public coupon_group_ids: string = undefined; // 券组ID 'XXX,XXX'
}

// 积分订单
export class IntegralOrderEntity extends EntityBase {
  public integral_order_id: string = undefined; // 主键
  public ht_code: string = undefined; // 用户;
  public client_id: string = undefined; // 订单来源;
  public commodity_id: string = undefined; // 商品id;
  public commodity_name: string = undefined; // 商品名称;
  public detail: Array<OrderDetailEntity> = undefined; // 商品明细;
  public pay_status: number = undefined; // 订单状态; 1; 待支付; 2; 已支付; 3; 已取消;
  public is_delivery = 2; // 	是否需要邮寄 1为需要， 2为不需要
  public delivery_status: number = undefined; // 发货状态; 1: 待发货; 2: 已发货; 3: 已签收; 4: 发货失败;
  public order_status = undefined; // 	integer	订单状态 1未完成，2已完成
  public pay_time: number = undefined; // 支付时间;
  public order_remark: string = undefined; // 平台备注;
  public buyer_remark: string = undefined; // 买家备注;
  public name: string = undefined; // 买家姓名;
  public telephone: string = undefined; // 买家电话;
  public cost_integral: number = undefined; // 使用积分数;
  public failed_template_ids: string = undefined; // 发货失败的模板ids
  public failed_group_ids: string = undefined; // 发货失败的券组ids
  public created_time: number = undefined; // 创建时间;
  public updated_time: number = undefined; // 更新时间;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'detail') {
      return OrderDetailEntity;
    }
    return null;
  }
}

export class IntegralOrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<IntegralOrderEntity> {
    const tempList: Array<IntegralOrderEntity> = [];
    results.forEach(res => {
      tempList.push(IntegralOrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class IntegralOrderHttpService {
  private domain = environment.INTEGRAL_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取积分商城订单列表
   * @param searchParams 条件筛选参数
   */
  public requestIntegralOrderList(searchParams: SearchIntegralOrderParams): Observable<IntegralOrderLinkResponse> {
    const httpUrl = `${this.domain}/integral_orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new IntegralOrderLinkResponse(res)));
  }

  /**
   * 分页获取积分商城订单列表
   * @param url linkurl
   */
  public continueIntegralOrderList(url: string): Observable<IntegralOrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new IntegralOrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param integral_order_id 订单id
   */
  public requestIntegralOrderDetail(integral_order_id: string): Observable<IntegralOrderEntity> {
    const httpUrl = `${this.domain}/integral_orders/${integral_order_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => IntegralOrderEntity.Create(res.body)));
  }

  /**
   * 修改备注信息
   * @param integral_order_id 订单id
   * @param order_remark 平台备注
   * @returns Observable<HttpResponse<any>>
   */
  public requestModifyOrderRemark(integral_order_id: string, order_remark: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/integral_orders/${integral_order_id}`;
    return this.httpService.put(httpUrl, {
      order_remark
    });
  }
}
