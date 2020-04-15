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
  public media_id: string = undefined; // 微信返回图片media_id send_type = 'image'时必传
  public created_time: number = undefined; // 创建时间
  public updated_time: number = undefined; // 更新时间
  public request_date: number = undefined; // 标记数据请求时间
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
}
