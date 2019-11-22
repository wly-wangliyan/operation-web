import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export class SearchParams extends EntityBase {
  public pay_status = ''; // 	int	F	订单状态 1:待支付 2:已支付 3:已取消
  public delivery_status = ''; // 	int	F	发货状态 1:待发货 2:已发货 3:已签收
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
  public unit_original_price = undefined; // 	int	单位分 原价
  public unit_sell_price = undefined; // 	int	单位分 售价
  public amount = undefined; // 	int	数量
}

export class GoodsOrderEntity extends EntityBase {
  public order_id = ''; // 	string	订单ID
  public trade_no = ''; // 	string	微信支付订单id
  public htcode = ''; // 	string	用户ID
  public commodity_ids = ''; // 	String	商品ids
  public pay_status = undefined; // 	integer	订单状态 1:待支付 2:已支付 3:已取消
  public delivery_status = undefined; // 	integer	发货状态 1:待发货 2:已发货 3:已签收
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
  public delivery_company = ''; // 	String	物流公司
  public delivery_order = ''; // 	String	物流单号
  public order_time = undefined; // 	float	下单时间
  public pay_time = undefined; // 	float	支付时间
  public pay_expire_time = undefined; // 	float	支付到期时间
  public delivery_time = undefined; // 	float	发货时间
  public confirm_time = undefined; // 	float	确认收货时间
  public updated_time = undefined; // 	float	更新时间
  public created_time = undefined; // 	float	创建时间
  public detail: Array<OrderDetailEntity> = []; // 	obj[]	订单明细对象列表

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'detail') {
      return OrderDetailEntity;
    }
    return null;
  }
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
    return this.httpService.put(httpUrl, params);
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
}
