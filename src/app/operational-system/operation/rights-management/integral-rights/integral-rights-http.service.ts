import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

// 通用积分规则
export class CommonRuleEntity extends EntityBase {
  public config_id: string = undefined; // 主键
  public city_code = '210100'; // 城市code 沈阳:"210100", 本溪："210500"
  public valid_forever = 2; // 是否永久有效 1是 2否(为否时字段必传)
  public interval: any = ''; // int 间隔年份
  public month: number = undefined; // 清零日=>月
  public day: number = undefined; // 清零日=>日
  public start_year: any = ''; // int 开始年份
  public max_integral: number = undefined; // Integer	每日积分上限 -1无上限
  public date_update_time: number = undefined; // 有效期更新时间
  public integral_update_time: number = undefined; // 积分上限更新时间
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  public toEditJson(): any {
    const json = this.json();
    delete json.config_id;
    delete json.date_update_time;
    delete json.integral_update_time;
    delete json.created_time;
    delete json.updated_time;

    return json;
  }
}

// 规则详情
export class RuleDetail extends EntityBase {
  public type: number = undefined; // 1:每笔订单赠送xx积分 2:每购买100元赠送xx积分
  public order_number: number = undefined; // 笔数 每购买×笔
  public fee_amount: number = undefined; // 单位:分 每购买×元
}

// 自定义规则
export class RuleEntity extends EntityBase {
  public rule_id: string = undefined; // 主键
  public name: string = undefined; // 规则名称
  public city_code = '210100'; // 城市code 沈阳:"210100", 本溪："210500"
  public business_type: number = undefined; // 业务类型(1停车缴费)
  public award_integral: number = undefined; // 奖励分值
  public rule_detail: RuleDetail = undefined; // 规则详情
  public issued_time: number = undefined; // 发放时间 (当天的第几分钟,例:480代表8点, 1201代表20:01)
  public status: number = undefined; // 1开启 2关闭
  public issued_integral: number = undefined; // 已发放积分
  public unissued_integral: number = undefined; // 未发放积分
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'rule_detail') {
      return RuleDetail;
    }
    return null;
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.rule_id;
    delete json.status;
    delete json.issued_integral;
    delete json.unissued_integral;
    delete json.created_time;
    delete json.updated_time;

    return json;
  }
}

export class SearchCustomIntegralParams extends EntityBase {
  public status: any = ''; // 状态 1生效 2失效
  public name: string = undefined; // 名称
}

export class CustomRuleLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RuleEntity> {
    const tempList: Array<RuleEntity> = [];
    results.forEach(res => {
      tempList.push(RuleEntity.Create(res));
    });
    return tempList;
  }
}

export class IntegralStatistics extends EntityBase {
  public total_issue: number = undefined; // 累计发放积分
  public total_consume: number = undefined; // 累计消耗积分
  public total_invalid: number = undefined; // 已失效积分
}

@Injectable({
  providedIn: 'root'
})
export class IntegralRightsHttpService {
  private domain = environment.INTEGRAL_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取通用积分明细
   */
  public requestCommonIntegralRuleDetail(): Observable<CommonRuleEntity> {
    const httpUrl = `${this.domain}/configs`;
    return this.httpService.get(httpUrl).pipe(map(res => CommonRuleEntity.Create(res.body)));
  }

  /**
   * 设置通用积分规则
   * @param config_id 规则id
   * @param editParams {CommonRuleEntity} 编辑所需参数
   * @param type {1|2} 1:设置有效期 2设置积分上限
   */
  public requestEditCommonIntegralRule(config_id: string, editParams: CommonRuleEntity, type: 1 | 2): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/configs/${config_id}`;
    const params = editParams.toEditJson();
    return this.httpService.put(httpUrl, { params, type });
  }

  /**
   * 获取自定义规则列表
   * @param searchParams 筛选参数
   */
  public requestCustomIntegralRuleListData(searchParams: SearchCustomIntegralParams): Observable<CustomRuleLinkResponse> {
    const httpUrl = `${this.domain}/rules`;
    return this.httpService.get(httpUrl, searchParams.json()).pipe(map(res => new CustomRuleLinkResponse(res)));
  }

  /**
   * 分页获取自定义规则列表
   * @param url linkurl
   */
  public continueCustomIntegralRuleListData(url: string): Observable<CustomRuleLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new CustomRuleLinkResponse(res)));
  }

  /**
   * 获取自定义规则详情
   * @param rule_id 规则id
   */
  public requestCustomIntegralRuleDetailData(rule_id: string): Observable<RuleEntity> {
    const httpUrl = `${this.domain}/rules/${rule_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => RuleEntity.Create(res.body)));
  }

  /**
   * 添加自定义积分规则
   * @param addParams {RuleEntity} 规则实体类
   */
  public requestAddCustomIntegralRule(addParams: CommonRuleEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/rules`;
    return this.httpService.post(httpUrl, addParams.toEditJson());
  }

  /**
   * 编辑自定义积分规则
   * @param rule_id 规则id
   * @param editParams {RuleEntity} 规则实体类
   */
  public requestEditCustomIntegralRule(rule_id: string, editParams: CommonRuleEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/rules/${rule_id}`;
    return this.httpService.put(httpUrl, editParams.toEditJson());
  }

  /**
   * 删除自定义规则
   * @param rule_id 规则id
   */
  public requestDeleteCustomIntegralRuleData(rule_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/rules/${rule_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 启停自定义规则
   * @param rule_id 规则id
   * @param status 状态 1生效 2失效
   */
  public requestChangeCustomIntegralRuleStatus(rule_id: string, status: 1 | 2): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/rules/${rule_id}/status`;
    return this.httpService.patch(httpUrl);
  }

  /**
   * 获取积分统计
   */
  public requestIntegralStatisticsData(): Observable<IntegralStatistics> {
    const httpUrl = `${this.domain}/integral/statistics`;
    return this.httpService.get(httpUrl).pipe(map(res => IntegralStatistics.Create(res.body)));
  }
}
