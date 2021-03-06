import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpService, LinkResponse } from '../../../../core/http.service';
import { EntityBase } from '../../../../../utils/z-entity';
import { environment } from '../../../../../environments/environment';

// 消息推送
export class PushMessageEntity extends EntityBase {
  public push_message_id: string = undefined; // 主键id
  public subject: string = undefined; // 推送主题
  public start_time: number = undefined; // 生效开始时间
  public end_time: number = undefined; // 生效结束时间
  public msg_tags: string = undefined; // 推送对象类型tag：subscribe(订阅),menu(点击),scan(扫码),dialogue(对话)"
  public push_amount: number = undefined; // 推送总人数
  public send_type: 'text' | 'image' = undefined; // 发送消息类型
  /**发送文本消息内容 eg:文本内容<a href="http://www.qq.com" data-miniprogram-appid="appid"
   * data-miniprogram-path="pages/index/index" > 点击跳小程序 </a>
   */
  public content: string = undefined; // 文本信息 send_type = 'text'时必传
  public title: string = undefined; // F 小程序链接名称
  public link: string = undefined; // F 小程序链接
  public media_id: string = undefined; // 微信返回图片media_id send_type = 'image'时必传
  public city_code: 'sy_wxmp' | 'bx_wxmp' = 'sy_wxmp'; // 城市code
  public user_ids: string = undefined; // 	String	F	推送目标用户id
  public send_all = 1; // 	Integer	T	推送目标用户1全部 2部分
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
  public request_date: number = undefined; // 标记数据请求时间

  public toEditJson(): any {
    const json = this.json();
    delete json.push_message_id;
    delete json.created_time;
    delete json.updated_time;
    delete json.request_date;
    return json;
  }
}

// 消息推送
export class PushLogEntity extends EntityBase {
  public push_message_log_id: string = undefined; // 	string(32)	T	主键id
  subject: string = undefined; // 	string(50)	T	推送主题
  total_number: number = undefined; // 	int	T	推送总人数
  success_number: number = undefined; // 	int	T	推送成功人数
  fail_number: number = undefined; // 	int	T	推送失败人数
  user_ids: string = undefined; // 	String	T	所有推送ids
  success_ids: string = undefined; // 	String	T	推送成功ids
  fail_ids: string = undefined; // 	String	T	推送失败ids
  send_time: number = undefined; // 	double	T	推送时间
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
}

export class SearchParams extends EntityBase {
  public subject = ''; // 推送主题
  public section: string = undefined; // 推送时间
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class PushMessageLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PushMessageEntity> {
    const tempList: Array<PushMessageEntity> = [];
    results.forEach(res => {
      tempList.push(PushMessageEntity.Create(res));
    });
    return tempList;
  }
}

export class PushLogLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PushLogEntity> {
    const tempList: Array<PushLogEntity> = [];
    results.forEach(res => {
      tempList.push(PushLogEntity.Create(res));
    });
    return tempList;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PushService {
  private domain = environment.OPERATION_SERVE;

  constructor(private httpService: HttpService) { }

  /** 获取消息推送信息列表 */
  public requestPushMessageList(): Observable<PushMessageLinkResponse> {
    const httpUrl = `${this.domain}/custom/messages`;
    const params = this.httpService.generateListURLSearchParams(null);
    return this.httpService.get(httpUrl, params).pipe(map(res => new PushMessageLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求消息推送信息列表
   * @param string url linkUrl
   * @returns Observable<PushMessageLinkResponse>
   */
  public continuePushMessageListData(url: string): Observable<PushMessageLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new PushMessageLinkResponse(res)));
  }

  /**
   * 给用户推送消息
   * @param addParams PushMessageEntity 添加参数
   */
  public requestAddPushMessageData(addParams: PushMessageEntity): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/custom/message/send`;
    return this.httpService.post(httpUrl, addParams.toEditJson());
  }

  /**
   * 消息推送详情
   * @param push_message_id
   * @returns Observable<PushMessageEntity>
   */
  public requestPushMessageDetail(push_message_id: string): Observable<PushMessageEntity> {
    const httpUrl = `${this.domain}/custom/messages/${push_message_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => {
      const body = res.body;
      const date = res.headers.get('date');
      body.request_date = date ? new Date(date).getTime() : null;
      return PushMessageEntity.Create(body);
    }));
  }

  /** 获取消息推送信息列表 */
  public requestPushLogList(searchParams: SearchParams): Observable<PushLogLinkResponse> {
    const httpUrl = `${this.domain}/custom/send_logs`;
    return this.httpService.get(httpUrl, searchParams).pipe(map(res => new PushLogLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求消息推送信息列表
   * @param string url linkUrl
   * @returns Observable<PushLogLinkResponse>
   */
  public continuePushLogListData(url: string): Observable<PushLogLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new PushLogLinkResponse(res)));
  }
}
