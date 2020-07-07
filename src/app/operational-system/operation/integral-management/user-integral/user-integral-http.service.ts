import { Injectable } from '@angular/core';
import { EntityBase } from '../../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

// 用户积分列表筛选
export class SearchUserIntegralParams extends EntityBase {
  public user_id: string = undefined; // 用户id
  public telephone: string = undefined; // 手机号
  public page_nun = 1;
  public page_size = 45;
}

// 用户发放积分明细筛选
export class SearchIntegralDetailParams extends EntityBase {
  public user_id: string = undefined; // user_id
  public issue_status: any = ''; // 发放状态
  public section: string = undefined; // 产生时间/消耗时间/失效时间
  public tab_key = 1;
  public page_num = 1;
  public page_size = 45;
}

// 用户积分实体
export class UserIntegralEntity extends EntityBase {
  public user_integral_id: string = undefined; // 主键
  public ht_code: string = undefined; // ht_code;
  public user_id: string = undefined; // user_id;
  public telephone: string = undefined; // 电话;
  public current_integral: number = undefined; // int 当前积分余额;
  public consume_integral: number = undefined; // int 已使用积分;
  public invalid_integral: number = undefined; // int 已失效积分;
  public created_time: number = undefined; // float 创建时间;
  public updated_time: number = undefined; // float 更新时间;
}

export class UserIntegralLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UserIntegralEntity> {
    const tempList: Array<UserIntegralEntity> = [];
    results.forEach(res => {
      tempList.push(UserIntegralEntity.Create(res));
    });
    return tempList;
  }
}

// 积分获取记录
export class GainRecordEntity extends EntityBase {
  public gain_record_id: string = undefined; // 主键
  public issue_record_id: string = undefined; // 发放记录id
  public ht_code: string = undefined; // ht_code;
  public user_id: string = undefined; // user_id
  public city_code = '210100'; // 城市 "210100", "210500"
  public rules_detail: string = undefined; // 积分规则
  public three_order_id: string = undefined; // 订单编号
  public business_type: number = undefined; // 业务类型(1停车缴费)
  public due_integral: number = undefined; // 应得积分
  public real_integral: number = undefined; // 实得积分
  public issue_time: number = undefined; // 发放时间
  public issue_status: number = undefined; // 发放状态 1已发放 2未发放
  public created_time: number = undefined; // float 创建时间;
  public updated_time: number = undefined; // float 更新时间;
}

export class GainRecordLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<GainRecordEntity> {
    const tempList: Array<GainRecordEntity> = [];
    results.forEach(res => {
      tempList.push(GainRecordEntity.Create(res));
    });
    return tempList;
  }
}

// 积分消费记录
export class ConsumeRecordEntity extends EntityBase {
  public consume_record_id: string = undefined; // 主键
  public ht_code: string = undefined; // ht_code;
  public user_id: string = undefined; // user_id
  public order_id: string = undefined; // 订单id
  public business_type: number = undefined; // 业务类型(1商城兑换)
  public consume_integral: number = undefined; // 消费积分
  public created_time: number = undefined; // float 创建时间;
  public updated_time: number = undefined; // float 更新时间;
}

export class ConsumeRecordLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ConsumeRecordEntity> {
    const tempList: Array<ConsumeRecordEntity> = [];
    results.forEach(res => {
      tempList.push(ConsumeRecordEntity.Create(res));
    });
    return tempList;
  }
}

// 积分失效记录
export class InvalidRecordEntity extends EntityBase {
  public invalid_record_id: string = undefined; // 主键
  public ht_code: string = undefined; // ht_code;
  public user_id: string = undefined; // user_id
  public invalid_integral: number = undefined; // 消费积分
  public created_time: number = undefined; // float 创建时间;
  public updated_time: number = undefined; // float 更新时间;
}

export class InvalidRecordLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<InvalidRecordEntity> {
    const tempList: Array<InvalidRecordEntity> = [];
    results.forEach(res => {
      tempList.push(InvalidRecordEntity.Create(res));
    });
    return tempList;
  }
}

// 积分发放记录
export class IssueRecordEntity extends EntityBase {
  public issue_record_id: string = undefined; // 主键
  public ht_code: string = undefined; // ht_code;
  public user_id: string = undefined; // user_id
  public due_integral: number = undefined; // 应得积分
  public real_integral: number = undefined; // 实得积分
  public created_time: number = undefined; // float 创建时间;
  public updated_time: number = undefined; // float 更新时间;
}

export class IssueRecordLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<IssueRecordEntity> {
    const tempList: Array<IssueRecordEntity> = [];
    results.forEach(res => {
      tempList.push(IssueRecordEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserIntegralHttpService {
  private domain = environment.INTEGRAL_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**
   * 获取用户积分列表
   * @param searchParams 条件筛选参数
   */
  public requestUserIntegralList(searchParams: SearchUserIntegralParams): Observable<UserIntegralLinkResponse> {
    const httpUrl = `${this.domain}/user_integrals`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new UserIntegralLinkResponse(res)));
  }

  /**
   * 分页获取用户积分列表
   * @param url linkurl
   */
  public continueUserIntegralList(url: string): Observable<UserIntegralLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new UserIntegralLinkResponse(res)));
  }

  /**
   * 获取积分获取记录
   * @param searchParams
   */
  public requestGainRecordList(searchParams: SearchIntegralDetailParams): Observable<GainRecordLinkResponse> {
    const httpUrl = `${this.domain}/gain_records`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new GainRecordLinkResponse(res)));
  }

  /**
   * 分页获取积分获取记录
   * @param url
   */
  public continueGainRecordList(url: string): Observable<GainRecordLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new GainRecordLinkResponse(res)));
  }
  /**
   * 获取积分失效记录
   * @param searchParams
   */
  public requestInvalidRecordList(searchParams: SearchIntegralDetailParams): Observable<InvalidRecordLinkResponse> {
    const httpUrl = `${this.domain}/invalid_records`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new InvalidRecordLinkResponse(res)));
  }

  /**
   * 分页获取积分获取记录
   * @param url
   */
  public continueInvalidRecordList(url: string): Observable<InvalidRecordLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new InvalidRecordLinkResponse(res)));
  }
}
