import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable, timer } from 'rxjs/index';
import { map } from 'rxjs/internal/operators/map';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpService, LinkResponse, HttpErrorEntity } from '../../core/http.service';
import { environment } from '../../../environments/environment';
import { WashCarOrderEntity } from '../order-management/wash-car-order/wash-car-order.service';

export class ExpenseSearchParams extends EntityBase {
  public status: any = ''; // 消费凭证状态1:已核销 (2:未核销) 3:已失效
  public expense_verify_code: string = undefined; // 核销码
  public repair_shop_name: string = undefined; // 所属汽修店名称
  public expense_section: string = undefined; // 核销时间区间 "xxx,xxx"
  public car_type: any = ''; // 车型 1:5座小型车 2:SUV/MPV
  public service_type: any = ''; // 服务类型 1:1次标准洗车 2：1次标准洗车+1次打蜡
  public wash_car_order_id: string = undefined; // 洗车订单id
}

// 核销记录实体
export class ExpenseVerifyEntity extends EntityBase {
  public expense_verify_id: string = undefined; // 消费凭证ID
  public wash_car_order: WashCarOrderEntity = undefined; // 洗车订单对象 WashCarOrder
  public expense_verify_code: string = undefined; // 消费凭证码
  public service_type: string = undefined; // 服务类型 1:1次标准洗车 2：1次标准洗车+1次打蜡
  public car_type: number = undefined; // 车型 1: 5座小型车 2：SUV/MPV
  public repair_shop_name: string = undefined; // 所属汽修店名称
  public repair_shop_id: string = undefined; // 所属汽修店ID
  public verify_person: string = undefined; // 核销人
  public verify_time: number = undefined; // 核销时间
  public valid_date_start: number = undefined; // 有效期开始日期
  public valid_date_end: number = undefined; // 有效期结束日期
  public status: number = undefined; // 消费凭证状态 1：已核销 2： 未核销 3： 已失效

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'wash_car_order') {
      return WashCarOrderEntity;
    }
    return null;
  }
}

export class ExpenseRecordLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ExpenseVerifyEntity> {
    const tempList: Array<ExpenseVerifyEntity> = [];
    results.forEach(res => {
      tempList.push(ExpenseVerifyEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseHttpService {

  private domain = environment.STORE_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取核销列表
   * @param searchParams 条件检索参数
   */
  public requestExpenseRecordData(searchParams: ExpenseSearchParams): Observable<ExpenseRecordLinkResponse> {
    const httpUrl = `${this.domain}/admin/wash_car/expense_verifies`;
    const params = this.httpService.generateListURLSearchParams(searchParams);
    return this.httpService.get(httpUrl, params)
      .pipe(map(res => new ExpenseRecordLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求核销列表
   * @param string url linkUrl
   * @returns Observable<ExpenseRecordLinkResponse>
   */
  public continueExpenseRecordData(url: string): Observable<ExpenseRecordLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ExpenseRecordLinkResponse(res)));
  }

  /**
   * 核销码数量统计
   * @param searchParams WashCarSearchParams
   * @returns Observable<WashCarOrderEntity>
   */
  public requestExpenseStatisticsData(searchParams: ExpenseSearchParams): Observable<any> {
    const params = searchParams.clone();
    delete params.page_num;
    delete params.page_size;
    const httpUrl = `${this.domain}/admin/wash_car/expense_verifies/statistics`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => res.body));
  }
}
