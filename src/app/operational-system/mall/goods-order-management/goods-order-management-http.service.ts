import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class SearchParams extends EntityBase {
  public pay_status = null; // 	int	F	订单状态 1:待支付 2:已支付 3:已取消
  public delivery_status = null; // 	int	F	发货状态 1:待发货 2:已发货 3:已签收
  public refund_type = null; // int	F	退款类型 1全部退款，2部分退款,3未退款 售后/退款传2
  public order_status = null; // int F	订单状态 1未完成，2已完成
  public commodity_type = 0; // int	F	商品类型 1：实物商品 2：虚拟商品
  public shipping_method = 0; // int	供货方式 1平台自营，2第三方供应
  public business_id = ''; // string	F	商家Id
  public mobile = ''; // 	String	F	购买人手机号
  public contact = ''; // 	String	F	收货人
  public order_id = ''; // 	string	F	订单ID
  public commodity_name = ''; // 	string	F	商品名称
  public order_time = ''; // 	string	F	下单时间 12154.0,232645.0
  public pay_time = ''; // 	string	F	支付时间 12154.0,232645.0
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class ModifyOrderParams extends EntityBase {
  public is_delivery = 1; // 	是否需要邮寄 1为需要， 2为不需要
  public delivery_company = undefined; // 	String	物流公司
  public delivery_order = undefined; // 	String	物流单号
  public postage = undefined; // 	integer	邮费 单位分
}

export class OrderDetailEntity extends EntityBase {
  public commodity_id = ''; // 	string	商品id
  public commodity_name = ''; // 	string	商品名称
  public subtitle = ''; // 	string	副标题
  public commodity_images = []; // 	Array	商品图片列表
  public specification_id = ''; // 	string	规格id
  public specification_name = ''; // 	string	规格名称
  public shipping_method: number = undefined; // int	供货方式 1平台自营，2第三方供应
  public business_name = ''; // 	string	供应商
  public unit_original_price = undefined; // 	int	单位分 原价
  public unit_sell_price = undefined; // 	int	单位分 售价
  public amount = undefined; // 	int	数量
  public commodity_type = undefined; // int	商品类型 1：实物商品 2：虚拟商品
}

export class WriteOffEntity extends EntityBase {
  public id = ''; // 	string	核销码
  public start_time: number = undefined; // 	string	开始时间
  public end_time: number = undefined; // 	string	结束时间
  public write_off_time: number = undefined; // string 核销时间
  public write_off_people = ''; // 	string	核销人
  public write_off_status = 1; // 	number	核销状态
}

export class OrderRefundEntity extends EntityBase {
  public refund_order_id = ''; // 	string	退款交易单号id
  public refund_status: number = undefined; // 	int 退款状态 0未申请退款 1退款中，2已退款，3退款失败
  public transaction_id = ''; // 	string	微信订单号
  public refund_id = ''; // 	string	微信退款单号
  public refund_fee = ''; // 	int	退款费用
  public total_fee = ''; // 	int	标价金额
  public cash_fee = ''; // 	int	单位分 现金支付金额
}

export class GoodsOrderEntity extends EntityBase {
  public order_id = ''; // 	string	订单ID
  public trade_no = ''; // 	string	微信支付订单id
  public htcode = ''; // 	string	用户ID
  public commodity_ids = ''; // 	String	商品ids
  public is_delivery = 1; // 	是否需要邮寄 1为需要， 2为不需要
  public pay_status = undefined; // 	integer	订单状态 1:待支付 2:已支付 3:已取消
  public delivery_status = undefined; // 	integer	发货状态 1:待发货 2:已发货 3:已签收
  public order_status = undefined; // 	integer	订单状态 1未完成，2已完成
  public confirm_type = undefined; // 	integer	签收类型 1:客户签收 2:管理员签收 3:到期自动签收
  public total_amount = undefined; // 	integer	总金额 (应收金额 单位分)
  public discount_price = undefined; // 	integer	平台立减 单位分
  public platform_coupon_amount = undefined; // 	integer	平台优惠劵 单位分
  public real_price = undefined; // 	float	实付金额 (支付金额 单位分)
  public postage = undefined; // 	integer	邮费 单位分
  public contact = ''; // 	String	收货人
  public mobile = ''; // 	String	手机号
  public delivery_address = ''; // 	String	收货地址 例：远航西路IT国际201
  public delivery_region = ''; // 	String	收货行政区 例：沈阳市浑南区
  public pay_type = ''; // 	string	支付方式 微信 WX_XCX_SL
  public delivery_method: number = undefined; // 	number	配送方式  1物流发货  2无需配送
  public delivery_company = ''; // 	String	物流公司
  public delivery_order = ''; // 	String	物流单号
  public total_refund_fee = undefined; // 	integer	退款总金额
  public is_refundable = undefined; // boolean 是否可以退款 true 可以退款 false 不可以退款
  public refund_way = undefined; // number 1:原路返回
  public refund_order_id = undefined; // String 退款交易单号
  public refund_total_fee = undefined; // integer	退款总金额
  public order_remark = undefined; // String 订单备注
  public refund_remark = undefined; // String 退款备注
  public refund_status = undefined; // int 退款状态 0未申请退款 1退款中，2已退款，3退款失败
  public refund_type = undefined; // int 退款类型 1全部退款，2部分退款, 3未退款
  public order_channel = undefined; // int 下单渠道 1, 美行停车小程序
  public collection_type = undefined; // int 收款方式 1平台 2供应商户
  public business_id = undefined; // String 商家id
  public business_name = undefined; // String 商家名称
  public order_time = undefined; // 	float	下单时间
  public pay_time = undefined; // 	float	支付时间
  public pay_expire_time = undefined; // 	float	支付到期时间
  public delivery_time = undefined; // 	float	发货时间
  public platform_desc = undefined; // 	String 平台备注
  public business_desc = undefined; // 	String 商家备注
  public validity_type = undefined; // 	String 商家备注
  public refund_time = undefined; // 	float 退款时间
  public confirm_time = undefined; // 	float	确认收货时间
  public updated_time = undefined; // 	float	更新时间
  public created_time = undefined; // 	float	创建时间
  public detail: Array<OrderDetailEntity> = []; // 	obj[]	订单明细对象列表
  public write_off_code: Array<WriteOffEntity> = []; // 	obj[]	核销码对象列表
  public refund_order: OrderRefundEntity = undefined; // 	订单退款对象

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'detail') {
      return OrderDetailEntity;
    } else if (propertyName === 'refund_order') {
      return OrderRefundEntity;
    } else if (propertyName === 'write_off_code') {
      return WriteOffEntity;
    }
    return null;
  }
}

export class RefundOrderEntity extends EntityBase {
  public refund_order_id = ''; // 	string	退款订单ID
}

export class OrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GoodsOrderEntity> {
    const tempList: Array<GoodsOrderEntity> = [];
    results.forEach(res => {
      tempList.push(GoodsOrderEntity.Create(res));
    });
    return tempList;
  }
}


@Injectable({
  providedIn: 'root'
})
export class GoodsOrderManagementHttpService {

  private domain = environment.MALL_DOMAIN; // 商城域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestGoodsOrderList(searchParams: SearchParams): Observable<OrderLinkResponse> {
    const httpUrl = `${this.domain}/admin/orders`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new OrderLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<OrderLinkResponse>
   */
  public continueOrderList(url: string): Observable<OrderLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new OrderLinkResponse(res)));
  }

  /**
   * 获取订单详情
   * @param order_id 订单ID
   * @returns Observable<GoodsOrderEntity>
   */
  public requestOrderDetail(order_id: string): Observable<GoodsOrderEntity> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => GoodsOrderEntity.Create(res.body)));
  }

  /**
   * 编辑物流信息
   * @param params 参数列表
   * @param order_id 订单id
   * @returns Observable<HttpResponse<any>>
   */
  public requestModifyOrderDelivery(order_id: string, params: ModifyOrderParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}`;
    return this.httpService.put(httpUrl,
      {
        ...params,
        is_delivery: Number(params.is_delivery)
      }
    );
  }

  /**
   * 确认收货
   * @param order_id 参数
   * @param params 参数列表
   * @returns Observable<HttpResponse<any>>
   */
  public requestConfirmReceipt(order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}/delivery`;
    return this.httpService.patch(httpUrl);
  }

  /**
   * 创建退款订单
   * @param order_id 订单id
   * @param refund_fee 退款金额
   * @param refund_remark 备注
   * @returns Observable<RefundOrderEntity>
   */
  public requestCreateRefundOrder(order_id: string, refund_fee: string, refund_remark: string): Observable<RefundOrderEntity> {
    const httpUrl = `${this.domain}/admin/refund_orders`;
    return this.httpService.post(httpUrl, {
      order_id,
      refund_fee: Number(refund_fee) * 100,
      refund_remark,
    }).pipe(map(res => RefundOrderEntity.Create(res.body)));
  }

  /**
   * 退款订单退款
   * @param refund_order_id 退款订单ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestRefundOrder(refund_order_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/refund_orders/${refund_order_id}/pay/refund`;
    return this.httpService.post(httpUrl);
  }

  /**
   * 修改备注信息
   * @param order_id 订单id
   * @param order_desc 订单备注
   * @param refund_desc 退款备注
   * @returns Observable<HttpResponse<any>>
   */
  public requestModifyOrderDesc(order_id: string, order_desc: string, platform_desc: string, business_desc: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}/remark`;
    return this.httpService.patch(httpUrl, {
      order_desc,
      platform_desc,
      business_desc,
    });
  }

  /**
   * 核销券码
   * @param order_id 订单id
   * @param write_off_codes write_off_codes 核销券码
   * @returns Observable<HttpResponse<any>>
   */
  public requestWriteOffCode(order_id: string, write_off_codes: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/orders/${order_id}/write_off_code`;
    return this.httpService.put(httpUrl, {
      write_off_codes
    });
  }

}
