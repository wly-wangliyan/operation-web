import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../core/http.service';
import { EntityBase } from 'src/utils/z-entity';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '@angular/common/http';
import { ThirdProductEntity } from '../ticket/product-management/product.service';

export class SearchParams extends EntityBase {
  public page_num = 1; // 页码
  public page_size = 45; // 每页条数
}

export class NoticeEntity extends EntityBase {
  public message_id: string = undefined; // 通知-主键
  public action_time: string = undefined; // 变更时间
  public message_info: string = undefined; // 消息内容
  public third_product: ThirdProductEntity = undefined; // 第三方产品实体
  public status: number = undefined; // 通知状态 1：已读 2：未读
  public updated_time: number = undefined; // 更新时间
  public created_time: number = undefined; // 更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'tickets') {
      return ThirdProductEntity;
    }
    return null;
  }
}

export class NoticeLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<NoticeEntity> {
    const tempList: Array<NoticeEntity> = [];
    results.forEach(res => {
      tempList.push(NoticeEntity.Create(res));
    });
    return tempList;
  }
}


@Injectable({
  providedIn: 'root'
})
export class NoticeCenterService {

  private domain = environment.TICKET_SERVER; // 票务域名

  constructor(private httpService: HttpService) { }

  /**
   * 获取通知列表
   * @param searchParams 条件检索参数
   */
  public requestNoticeListData(searchParams: SearchParams): Observable<NoticeLinkResponse> {
    const httpUrl = `${this.domain}/messages`;
    return this.httpService.get(httpUrl, searchParams.json())
      .pipe(map(res => new NoticeLinkResponse(res)));
  }

  /**
   * 通过linkUrl继续请求订单列表
   * @param string url linkUrl
   * @returns Observable<NoticeLinkResponse>
   */
  public continueNoticeListData(url: string): Observable<NoticeLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new NoticeLinkResponse(res)));
  }

  /**
   * 修改通知状态
   * @param notice_id 产品id
   * @param status 是否已读 1:已读 2:未读
   * @returns Observable<HttpResponse<any>>
   */
  public requestChangeReadStatusData(notice_id: string, status: number): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/messages/${notice_id}/status`;
    const body = {
      status
    };
    return this.httpService.patch(httpUrl, body);
  }
}
