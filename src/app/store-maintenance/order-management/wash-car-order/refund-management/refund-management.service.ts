import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { WashCarOrderEntity, WashCarOrderLinkResponse, WashCarSearchParams } from '../wash-car-order.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { map } from 'rxjs/internal/operators/map';

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
      return WashCarOrderEntity;
    }
    return null;
  }
}

// 退款
export class WashCarCheckRefundParams extends EntityBase {
  public refund_fee: number = undefined; // 退款金额
  public refuse_reason: string = undefined; // 拒绝原因
  public apply_status: number = undefined; // integer	T	申请状态 1: 处理中 2: 申请通过 3: 申请驳回


  public toEditJson(): any {
    const json = this.json();
    json.refund_fee = Math.round(json.refund_fee * 100);
    return json;
  }
}

export class WashCarRefundSearchParams extends EntityBase {
  public order_status = ''; // 订单状态 1：待支付 2：已取消 3：待核销 4：已完成 5:已关闭 6:已失效
  public specification_name = ''; // 规格名称(产品名称)
  public wash_car_order_id = ''; // 订单编号
  public apply_section = ''; // 申请时间区间 "xxx,xxx"
  public car_type = ''; // 车型 1: 5座小型车 2：SUV/MPV
  public user_id = ''; // 用户id
  public telephone = ''; // 手机号
  public order_rules = ''; // string	F	排序规则 多种排序逗号分隔 1: 申请时间倒序 2:申请时间正序 3:退款状态(成功在前,失败在后) 4: 退款状态(成功在后,失败在前) 默认: '1'
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class WashCarRefundLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<WashRefundEntity> {
    const tempList: Array<WashRefundEntity> = [];
    results.forEach(res => {
      tempList.push(WashRefundEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RefundManagementService {

  private domain = environment.STORE_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取洗车退款申请列表
   * @param searchParams 条件检索参数
   */
  public requestOrderRefundList(searchParams: WashCarRefundSearchParams): Observable<WashCarRefundLinkResponse> {
    const httpUrl = `${this.domain}/admin/wash_refund_applications`;
    return this.httpService.get(httpUrl, searchParams.json())
        .pipe(map(res => new WashCarRefundLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求洗车退款申请列表
   * @param string url linkUrl
   * @returns Observable<WashCarRefundLinkResponse>
   */
  public continueOrderRefundList(url: string): Observable<WashCarRefundLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new WashCarRefundLinkResponse(res)));
  }

  /**
   * 退款
   * @param params 参数
   * @returns Observable<HttpResponse<any>>
   */
  public requestOrderRefundData(refund_application_id: string, params: WashCarCheckRefundParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/wash_refund_applications/${refund_application_id}`;
    return this.httpService.put(httpUrl, params.toEditJson());
  }

  /**
   * 洗车退款申请订单数量统计
   * @param searchParams WashCarSearchParams
   * @returns Observable<WashCarOrderEntity>
   */
  public requestWashCarRefundStatistics(searchParams: WashCarRefundSearchParams): Observable<any> {
    const params = searchParams.clone();
    delete params.page_num;
    delete params.page_size;
    const httpUrl = `${this.domain}/admin/wash_refund_applications/statistics`;
    return this.httpService.get(httpUrl, params)
        .pipe(map(res => res.body));
  }
}
