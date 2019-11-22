import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';

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

// 支付实体
export class PaySettingEntity extends EntityBase {
  public pay_setting_id: string = undefined; // 支付-主键
  public pay_type: number = undefined; // integer	支付类型 1：授信支付 2：余额支付
  public balance: number = undefined; // float	余额 单位：分
  public status: number = undefined; // integer	是否选用 1：已选用 2：未选用 默认选授信余额
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间/下单时间
}

export class PaySettingLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PaySettingEntity> {
    const tempList: Array<PaySettingEntity> = [];
    results.forEach(res => {
      tempList.push(PaySettingEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FinanceManagementService {

  private domain = environment.TICKET_SERVER; // 票务域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取支付配置列表
   * @returns Observable<PaySettingLinkResponse>
   */
  public requestPaySettingListData(): Observable<PaySettingLinkResponse> {
    const httpUrl = `${this.domain}/pay_settings`;
    return this.httpService.get(httpUrl)
      .pipe(map(res => new PaySettingLinkResponse(res)));
  }

  /**
   * 修改支付配置
   * @param pay_setting_id 支付id
   * @returns Observable<HttpResponse<any>>
   */
  public requestPaySettingStatus(pay_setting_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/pay_settings/${pay_setting_id}/status`;
    return this.httpService.patch(httpUrl);
  }
}
