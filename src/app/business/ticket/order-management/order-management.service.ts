import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';

export class SearchParams extends EntityBase {
  public status: number = undefined; // 订单状态 1:待支付 2：已支付 3：已取消
  public project_name: string = undefined; // 产品名称
  public order_id: string = undefined; // 订单编号
  // 缺少时间setion
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 订单实体
export class OrderEntity extends EntityBase {
  public order_id: string = undefined; // 订单id
  public price_calendar: any = undefined; // 门票价格日历对象
  public ticket: any = undefined; // 门票对象
  public product: any = undefined; // 产品对象
  public buy_num: number = undefined; // 购买数量
  public right_price: number = undefined; // 应收价格
  public real_price: number = undefined; // 实收价格
  public pay_type: string = undefined; // 支付方式 悠悠:UU 微信:WX
  public place_order_time: number = undefined; // 下单时间
  public pay_time: number = undefined; // 支付时间
  public third_order_id: string = undefined; // 第三方订单id
  public order_code: string = undefined; // 凭证码/消费码
  public order_code_url: string = undefined; // 订单详情及二维码
  public order_code_image: string = undefined; // 二维码图片
  public status: number = undefined; // 订单状态 1:待支付 2：已支付 3：已取消
  public use_status: number = undefined; // 使用状态 1:已使用,2:已取消,3:未使用,4:已过期
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

export class OrderLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<OrderEntity> {
    const tempList: Array<OrderEntity> = [];
    results.forEach(res => {
      tempList.push(OrderEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  private domain = environment.OPERATION_SERVE; // 运营域名

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
  public requestOrderDetailData(order_id: string): Observable<OrderEntity> {
    const httpUrl = `${this.domain}/order/${order_id}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => OrderEntity.Create(res.body)));
  }
}
