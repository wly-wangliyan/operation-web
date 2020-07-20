import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from '../../../../../utils/z-entity';

// 推送配置统计
export class PushCountEntity extends EntityBase {
  public push_count_id: string = undefined; // 	string	推送统计id
  public push_plan: object = undefined; // 	obj	推送配置对象
  public push_count_date: number = undefined; // 	float	推送统计日期
  public reach_user_num: number = undefined; // 	int	触达(提示)次数
  public click_num: number = undefined; // 	int	点击次数
  public close_num: number = undefined; // 	int	关闭次数
  public click_user_num: number = undefined; // 	int	点击人数
  public close_user_num: number = undefined; // 	int	关闭人数
  public is_deleted: boolean = undefined; // 	bool	逻辑删除
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间
}

// 推送配置
export class PushEntity extends EntityBase {
  public push_plan_id: string = undefined; // 	string	推送配置id
  public push_plan_name: string = undefined; // 	string	推送配置名称(标题)
  public push_plan_status: number = undefined; // 	int	推送配置启停新状态
  public push_plan_rank: number = undefined; // 	int	推送优先级
  public push_range: number = undefined; // 	int	推送人群定位1:全部,2:领券未使用用户,3:下单未支付用户,4:自定义
  public push_range_detail = undefined; // 	json	人群定位详情 {'range_type':1, 'coupon_id':'xxx','coupon_group_id':'xxx','coupon_service':2,'date_limit':15}
  public push_speed_type: number = undefined; // 	int	推送频次类型1:触发后不再推送,2:触发后持续推送
  public push_speed = undefined; // 	json	推送频次 {'push_interval':5, 'push_num':6}
  public push_type: number = undefined; // 	int	推送形式1:首页浮窗,2:首页弹窗
  public push_image: string = undefined; // 	string	推送图片url
  public push_location_url: string = undefined; // 	string	推送触发落地页url
  public start_time: number = undefined; // 	float	上线时间
  public end_time: number = undefined; // 	float	下线时间 9999999999为永不下线
  public description: string = undefined; // 	string	备注
  public reach_user_num: number = undefined; // 	int	累计触达(提示)人数
  public click_num: number = undefined; // 	int	累计点击次数
  public close_num: number = undefined; // 	int	累计关闭次数
  public click_user_num: number = undefined; // 	int	累计点击人数
  public close_user_num: number = undefined; // 	int	累计关闭人数
  public push_counts: Array<PushCountEntity> = []; // 	[PushPlan][]	推送统计列表
  public url_type: string = undefined; // 	int	推送触发落地页url类型1:小程序原生页,2:H5
  public user_range: number = undefined; // 	integer	T	用户范围 1: 全部 2:自定用户 默认: 1
  public user_ids: string = undefined; // 	string	T	用户集合 多个逗号分隔 'xxx,xxx' 无传空字符串
  public is_deleted: boolean = undefined; // 	bool	逻辑删除
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'push_counts') {
      return PushCountEntity;
    }
    return null;
  }
}

export class SearchParams extends EntityBase {
  public push_plan_name: string = undefined; // 标题
  public section: string = undefined; // 上线时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

// 添加、编辑 push
export class PushParams extends EntityBase {
  public push_plan_name: string = undefined; // 	string	T	推送配置名称
  public push_plan_rank: number = undefined; // 	int	T	推送优先级
  public push_range: number = undefined; // 	int	T	推送人群定位1:全部,2:领券未使用用户,3:下单未支付用户,4:自定义
  public range_type: number = undefined; // 	int	F	推送人群类型1:优惠券模板id形式,2:优惠券组id形式,3:优惠券服务业务形式
  public coupon_id: string = undefined; // 	string	F	优惠券模板id(push_range为2时三选一)
  public coupon_group_id: string = undefined; // 	string	F	优惠券组id(push_range为2时三选一)
  public coupon_service: string = undefined; // 	int	F	优惠券服务业务1:停车,2:检车,3:保养,4:票务,5:预约,9:洗车,10:到店保养(push_range为2时三选一)
  public date_limit: number = undefined; // 	int	F	距离到期几日内显示推送(push_range为2时必传)
  public free_range_type: number = undefined; // 人群定位'自定义'下的类型 1:临近车险投保日期 2:临近年检日期用户(push_range为4时必传)
  public free_date_limit: number = undefined; // 临近(投保)日期推送天数(push_range为4且free_range_type为1时必传)
  public free_start_limit: number = undefined; // 临近日期推送开始日(push_range为4且free_range_type为1,2或3时必传)
  public free_end_limit: number = undefined; // 临近日期推送结束日(push_range为4且free_range_type为1,2或3时必传)
  public push_speed_type: number = undefined; // 	int	T	推送频次类型1:触发后不再推送,2:触发后持续推送
  public push_interval: number = undefined; // 	int	F	推送最小间隔天数(push_speed_type为2时必传)
  public push_num_everyday: number = undefined; // 	int	F	每日最大推送次数(push_speed_type为2时必传)
  public push_num: number = undefined; // 	int	F	最大推送次数(push_speed_type为2时必传)
  public push_type: number = undefined; // 	int	T	推送形式1:首页浮窗,2:首页弹窗
  public push_image: string = undefined; // 	string	T	推送图片url
  public push_location_url: string = undefined; // 	string	F	推送触发落地页url
  public start_time = new Date().getTime() / 1000; // 	float	T	上线时间(现只有立即发布)传当前时间时间戳
  public end_time: number = undefined; // 	float	T	下线时间 9999999999为永不下线
  public description: string = undefined; // 	string	F
  public url_type: string = undefined; // 	int	推送触发落地页url类型1:小程序原生页,2:H5
  public user_range: number = undefined; // 	integer	T	用户范围 1: 全部 2:自定用户 默认: 1
  public user_ids: string = undefined; // 	string	T	用户集合 多个逗号分隔 'xxx,xxx' 无传空字符串


  constructor(entity?: PushEntity) {
    super();
    if (entity) {
      this.push_plan_name = entity.push_plan_name;
      this.push_plan_rank = entity.push_plan_rank;
      this.push_range = entity.push_range;
      this.range_type = entity.push_range_detail ? entity.push_range_detail.range_type : undefined;
      this.coupon_id = entity.push_range_detail ? entity.push_range_detail.coupon_id : undefined;
      this.coupon_group_id = entity.push_range_detail ? entity.push_range_detail.coupon_group_id : undefined; // 	string	F	优惠券组id(push_range为2时三选一)
      this.coupon_service = entity.push_range_detail ? entity.push_range_detail.coupon_service : undefined; // 	int	F	优惠券服务业务1:停车,2:检车,3:保养,4:票务,5:预约(push_range为2时三选一)
      this.date_limit = entity.push_range_detail ? entity.push_range_detail.date_limit : undefined; // 	int	F	距离到期几日内显示推送(push_range为2时必传)
      this.free_range_type = entity.push_range_detail ? entity.push_range_detail.free_range_type : undefined;
      this.free_date_limit = entity.push_range_detail ? entity.push_range_detail.free_date_limit : undefined;
      this.free_start_limit = entity.push_range_detail ? entity.push_range_detail.free_start_limit : undefined;
      this.free_end_limit = entity.push_range_detail ? entity.push_range_detail.free_end_limit : undefined;
      this.push_speed_type = entity.push_speed_type; // 	int	T	推送频次类型1:触发后不再推送,2:触发后持续推送
      this.push_interval = entity.push_speed.push_interval; // 	int	F	推送最小间隔天数(push_speed_type为2时必传)
      this.push_num_everyday = entity.push_speed.push_num_everyday;
      this.push_num = entity.push_speed.push_num; // 	int	F	最大推送次数(push_speed_type为2时必传)
      this.push_type = entity.push_type; // 	int	T	推送形式1:首页浮窗,2:首页弹窗
      this.push_image = entity.push_image; // 	string	T	推送图片url
      this.push_location_url = entity.push_location_url; // 	string	F	推送触发落地页url
      this.start_time = entity.start_time; // 	float	T	上线时间(现只有立即发布)传当前时间时间戳
      this.end_time = entity.end_time; // 	float	T	下线时间 9999999999为永不下线
      this.description = entity.description; // 	string	F
      this.url_type = entity.url_type;
      this.user_range = entity.user_range;
      this.user_ids = entity.user_ids;
    }
  }
  public toAddJson(): any {
    const json = this.json();
    return json;
  }

  public toEditJson(): any {
    const json = this.json();
    return json;
  }
}

export class PushLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PushEntity> {
    const tempList: Array<PushEntity> = [];
    results.forEach(res => {
      tempList.push(PushEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PushManagementService {

  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取推送列表 */
  public requestPushListData(searchParams: SearchParams): Observable<PushLinkResponse> {
    const httpUrl = `${this.domain}/push_plans`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new PushLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求推送列表
   * @param string url linkUrl
   * @returns Observable<PushLinkResponse>
   */
  public continuePushListData(url: string): Observable<PushLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new PushLinkResponse(res)));
  }

  /**
   * 添加推送信息
   * @param  pushParams 添加参数
   */
  public requestAddPushData(pushParams: PushParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/push_plans`;
    return this.httpService.post(httpUrl, pushParams.json());
  }

  /**
   * 编辑推送信息
   * @param push_plan_id 推送ID
   * @param pushParams 编辑参数
   */
  public requestUpdatePushData(push_plan_id: string, pushParams: PushParams): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/push_plans/${push_plan_id}`;
    return this.httpService.put(httpUrl, pushParams);
  }

  /**
   * Banner详情
   * @param push_plan_id 推送 ID
   * @returns Observable<PushEntity>
   */
  public requestPushDetail(push_plan_id: string): Observable<PushEntity> {
    const httpUrl = `${this.domain}/push_plans/${push_plan_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      return PushEntity.Create(res.body);
    }));
  }

  /**
   * 修改banner 上线状态
   * @param push_plan_id 推送 ID
   * @param is_use boolean 启用状态(1启用，2停用)
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeUseStatus(push_plan_id: string, push_plan_status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/push_plans/${push_plan_id}/status`;
    const body = {
      status: push_plan_status
    };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 删除banner
   * @param push_plan_id 推送 ID
   * @returns Observable<HttpResponse<any>>
   */
  public requestDeletePushData(push_plan_id: string): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/push_plans/${push_plan_id}`;
    return this.httpService.delete(httpUrl);
  }
}
