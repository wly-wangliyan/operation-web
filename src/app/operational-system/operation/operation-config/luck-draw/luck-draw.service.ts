import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { CommodityLinkResponse } from '../../../mall/goods-management/goods-management-http.service';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { environment } from '../../../../../environments/environment';
import { EntityBase } from '../../../../../utils/z-entity';
import { HttpResponse } from '@angular/common/http';

/**
 * 商品列表请求参数
 */
export class CommoditySearchParams extends EntityBase {
  public sales_status = 1; // 销售状态 1销售中,2已下架
  public giveaway_settings = 1; // int	F	0未设置 1兑换码兑换
  public page_size = 45; // 每页数量 默认15
  public page_num = 1; // 第几页 默认1
}

/**
 * 活动列表请求参数
 */
export class ActivitySearchParams extends EntityBase {
  public lottery_activity_name: string = undefined; // string(30)	F	活动名称
  public lottery_activity_id: string = undefined; // string(32)	F	活动id
  public page_size = 45; // 每页数量 默认15
  public page_num = 1; // 第几页 默认1
}

export class ActivityParams extends EntityBase {
  public lottery_activity_id: string = undefined; // string(32)	T	抽奖活动id
  public lottery_activity_name: string = undefined; // string(30)	T	活动名称
  public start_time: number = undefined; // float	T	活动开始时间
  public end_time: number = undefined; // float	T	活动结束时间
  public user_limit: number = undefined; // int	T	参与用户限制 1 不限制(所有用户)
  public interval_days: number = undefined; // int	T	间隔天数
  public daily_participation_limit: number = undefined; // int	T	每日可参与上限
  public max_participation_limit: number = undefined; // int	T	最大可参与上限
  public extra_times: number = undefined; // int T	每人首次分享后额外参与次数 0表示没有设置每人首次分享后额外参与次数
  public cover_image: string = undefined; // string(150)	T	封面图片
  public lottery_activity_rules: string = undefined; // string(500)	T	活动规则
  public wx_share_title: string = undefined; // string(20)	T	微信好友分享标题
  public wx_share_image: string = undefined; // string(150)	T	微信好友分享图
  public wx_share_poster: string = undefined; // string(150)	T	微信朋友圈分享海报
}

export class NoPrizeParams extends EntityBase {
  public missed_name: string = undefined; // string(10)	T	未中奖名称
  public missed_hint: string = undefined; // string(20)	T	未中奖提示语
  public missed_image: string = undefined; // string(150)	T	未中奖图片
}

export class ActivityEntity extends EntityBase {
  public lottery_activity_id: string = undefined; // string(32)	T	抽奖活动id
  public lottery_activity_name: string = undefined; // string(30)	T	活动名称
  public start_time: number = undefined; // float	T	活动开始时间
  public end_time: number = undefined; // float	T	活动结束时间
  public user_limit: number = undefined; // int	T	参与用户限制 1 不限制(所有用户)
  public interval_days: number = undefined; // int	T	间隔天数
  public daily_participation_limit: number = undefined; // int	T	每日可参与上限
  public max_participation_limit: number = undefined; // int	T	最大可参与上限
  public extra_times: number = undefined; // int T	每人首次分享后额外参与次数 0表示没有设置每人首次分享后额外参与次数
  public cover_image: string = undefined; // string(150)	T	封面图片
  public lottery_activity_rules: string = undefined; // string(500)	T	活动规则
  public wx_share_title: string = undefined; // string(20)	T	微信好友分享标题
  public wx_share_image: string = undefined; // string(150)	T	微信好友分享图
  public wx_share_poster: string = undefined; // string(150)	T	微信朋友圈分享海报
  public missed_name: string = undefined; // string(10)	T	未中奖名称
  public missed_hint: string = undefined; // string(20)	T	未中奖提示语
  public missed_image: string = undefined; // string(150)	T	未中奖图片
  public status: number = undefined; // int	T	状态 1开启 2关闭
  public is_deleted = undefined; // boolean	T	是否已删除
  public prizes: Array<PrizeEntity> = []; // Prize[] T	奖品对象列表
  public lottery_num: number = undefined; // int	T	抽奖次数
  public lottery_people_num: number = undefined; // int	T	抽奖人数
  public win_num: number = undefined; // int	T	中奖次数
  public win_people_num: number = undefined; // int	T	中奖人数
  public click_num: number = undefined; // int	T	活动点击数(访问量)
  public click_person: number = undefined; // int	T	活动点击人数(访问人数)
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'prizes') {
      return PrizeEntity;
    }
    return null;
  }
}

export class PrizeEntity extends EntityBase {
  public prize_id: string = undefined; // string(32)	T	奖品id
  public prize_name: string = undefined; // string(10)	T	奖品名称
  public prize_image: string = undefined; // string(150)	T	奖品图片
  public prize_type: number = undefined; // int	T	奖品类型 1商城商品 2平台优惠卷 3再参与一次
  public prize_info: PrizeInfoEntity = new PrizeInfoEntity(); // obj	T	奖品信息
  public prize_num: number = undefined; // int	T	数量
  public remaining_amount: number = undefined; // int	T	剩余数量
  public win_probability: number = undefined; // float	T	中奖概率

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'prize_info') {
      return PrizeInfoEntity;
    }
    return null;
  }
}

export class PrizeInfoEntity extends EntityBase {
  public commodity_id: string = undefined; // string(32)	F	商品id prize_type为1时有该字段
  public name: string = undefined; // string	F	商品名称 prize_type为1时有该字段
  public specification_id: string = undefined; // string(32)	F	规格id prize_type为1时有该字段
  public stock: number = undefined; // int	F	库存 prize_type为1时有该字段
  public unit_sell_price: number = undefined; // int	F	售价 prize_type为1时有该字段
  public coupon_type = 1; // int	F	类型 1 优惠卷模板 2优惠卷组 prize_type为2时有该字段
  public coupon_id: string = undefined; // string(32)	F	id prize_type为2时有该字段
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

export class ActivityLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ActivityEntity> {
    const tempList: Array<ActivityEntity> = [];
    results.forEach(res => {
      tempList.push(ActivityEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LuckDrawService {

  private mall_domain = environment.MALL_DOMAIN;
  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /**
   * 获取商品列表
   * @param {CommoditySearchParams} searchParams
   * @returns {Observable<CommodityLinkResponse>}
   */
  public requestCommodityListData(searchParams: CommoditySearchParams): Observable<CommodityLinkResponse> {
    const url = this.mall_domain + `/admin/commodities`;
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(res => new CommodityLinkResponse(res)));
  }

  /**
   * 获取活动列表
   * @param {ActivitySearchParams} searchParams
   * @returns {Observable<ActivityLinkResponse>}
   */
  public requestActivityListData(searchParams: ActivitySearchParams): Observable<ActivityLinkResponse> {
    const url = this.domain + `/admin/lottery_activities`;
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService.get(url, params).pipe(map(res => new ActivityLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求活动列表
   * @param string url linkUrl
   * @returns Observable<ActivityLinkResponse>
   */
  public continueActivityListData(url: string): Observable<ActivityLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new ActivityLinkResponse(res)));
  }

  /**
   * 获取活动详情
   * @param banner_id banner ID
   * @returns Observable<ActivityEntity>
   */
  public requestActivityDetail(lottery_activity_id: string): Observable<ActivityEntity> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return ActivityEntity.Create(res.body);
    }));
  }

  /**
   * 修改活动启停状态
   * @param lottery_activity_id 活动ID
   * @param statusNum number 启用状态(1启用，2关闭)
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeStatus(lottery_activity_id: string, statusNum: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}/status`;
    const body = {status: statusNum};
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 删除活动
   * @param lottery_activity_id 活动ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeleteActivityData(lottery_activity_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}`;
    return this.httpService.delete(httpUrl);
  }

  /**
   * 添加抽奖活动
   * @param  activityParams 添加参数
   */
  public requestAddActivityData(activityParams: ActivityParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities`;
    return this.httpService.post(httpUrl, activityParams.json());
  }

  /**
   * 编辑抽奖活动
   * @param lottery_activity_id 抽奖活动ID
   * @param activityParams 编辑参数
   */
  public requestUpdateActivityData(lottery_activity_id: string, activityParams: ActivityParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}`;
    return this.httpService.put(httpUrl, activityParams.json());
  }

  /**
   * 添加抽奖活动奖品
   * @param  prizeParams 添加参数
   */
  public requestAddPrizeData(lottery_activity_id: string, prizeParams: PrizeEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}/prizes`;
    return this.httpService.post(httpUrl, prizeParams.json());
  }

  /**
   * 编辑抽奖活动奖品
   * @param lottery_activity_id 抽奖活动ID
   * @param prizeParams 编辑参数
   */
  public requestUpdatePrizeData(lottery_activity_id: string, prize_id: string, prizeParams: PrizeEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}/prizes/${prize_id}`;
    return this.httpService.put(httpUrl, prizeParams.json());
  }

  /**
   * 编辑未中奖信息设置
   * @param lottery_activity_id 抽奖活动ID
   * @param NoPrizeParams 编辑参数
   */
  public requestSaveNoPrizeData(lottery_activity_id: string, noPrizeParams: NoPrizeParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/admin/lottery_activities/${lottery_activity_id}/missed_settings`;
    return this.httpService.put(httpUrl, noPrizeParams.json());
  }
}
