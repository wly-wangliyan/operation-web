import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';

export class SearchParams extends EntityBase {

}

export class OrderEntity extends EntityBase {

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

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /**
   * 获取订单列表
   * @param searchParams 条件检索参数
   */
  public requestOrderListData(searchParams: SearchParams): Observable<OrderLinkResponse> {
    const httpUrl = `${this.domain}`;
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
    const httpUrl = `${this.domain}/${order_id}`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => OrderEntity.Create(res.body)));
  }
}
